import { request, type ApiOutcome } from './client';
import { photoContentTypeSchema, photoUploadUrlSchema } from './schema/upload';

// 사진 업로드 — 발급 → S3 PUT 두 단계를 한 함수로 묶어 화면은 photoKey 만 받는다(ARCHITECTURE `uploads.ts`).
// [미확인] 소개팅 프로필 사진이 사전등록과 같은 발급 경로를 쓰는지는 백엔드 명세 전(2026-09-24)이다 —
// 지금은 사전등록 경로를 쓴다. `VITE_API_MOCK=true` 면 요청 없이 목 photoKey 를 돌려준다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const MOCK_UPLOAD_DELAY_MS = 500;

export type PhotoUpload = { photoKey: string };

export async function uploadPhoto(file: File): Promise<ApiOutcome<PhotoUpload>> {
  const contentType = photoContentTypeSchema.safeParse(file.type);
  if (!contentType.success) {
    return {
      ok: false,
      error: { kind: 'api', code: 'INVALID_INPUT', message: 'JPG·PNG·WEBP 사진만 올릴 수 있어요.' },
    };
  }

  if (isMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_UPLOAD_DELAY_MS));
    return { ok: true, data: { photoKey: `mock-photos/${crypto.randomUUID()}` } };
  }

  const issued = await request(
    { method: 'POST', path: '/signups/photo-upload-url', body: { contentType: contentType.data } },
    photoUploadUrlSchema,
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
  return { ok: true, data: { photoKey: issued.data.photoKey } };
}
