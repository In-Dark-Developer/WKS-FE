import { request, type ApiOutcome } from './client';
import { datingPhotoContentTypeSchema, datingPhotoUploadSchema } from './schema/dating';

// 사진 업로드 — 발급(POST /dating/profile/photo) → S3 PUT 두 단계를 한 함수로 묶어 화면은 photoId 만 받는다
// (ARCHITECTURE `uploads.ts` · WKS-BE api-spec.md §10.1). `VITE_API_MOCK=true` 면 요청 없이 목 id 를 돌려준다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const MOCK_UPLOAD_DELAY_MS = 500;

export type PhotoUpload = { photoId: string };

// 백엔드는 10MB 를 넘는 사진을 업로드 때가 아니라 프로필 저장 때 거절한다(WKS-BE DatingPhotoService) —
// 입력을 다 마친 뒤에 막히지 않도록 고르는 순간 거른다.
export const DATING_PHOTO_MAX_BYTES = 10 * 1024 * 1024;

export async function uploadDatingPhoto(file: File): Promise<ApiOutcome<PhotoUpload>> {
  const contentType = datingPhotoContentTypeSchema.safeParse(file.type);
  if (!contentType.success) {
    return {
      ok: false,
      error: { kind: 'api', code: 'INVALID_INPUT', message: 'JPG·PNG 사진만 올릴 수 있어요.' },
    };
  }
  if (file.size > DATING_PHOTO_MAX_BYTES) {
    return {
      ok: false,
      error: { kind: 'api', code: 'INVALID_INPUT', message: '10MB 이하 사진만 올릴 수 있어요.' },
    };
  }

  if (isMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_UPLOAD_DELAY_MS));
    return { ok: true, data: { photoId: crypto.randomUUID() } };
  }

  const issued = await request(
    { method: 'POST', path: '/dating/profile/photo', body: { contentType: contentType.data } },
    datingPhotoUploadSchema,
  );
  if (!issued.ok) return issued;

  // S3 는 봉투가 없는 빈 응답을 준다 — 상태 코드로만 본다. Content-Type 이 발급 때와 다르면 서명이 깨진다.
  try {
    const response = await fetch(issued.data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType.data },
      body: file,
    });
    if (!response.ok) return { ok: false, error: { kind: 'network' } };
  } catch {
    return { ok: false, error: { kind: 'network' } };
  }
  return { ok: true, data: { photoId: issued.data.photoId } };
}
