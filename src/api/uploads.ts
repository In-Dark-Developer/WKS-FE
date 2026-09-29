import { request } from './client';
import { datingPhotoContentTypeSchema, datingPhotoUploadSchema } from './schema/dating';

// 사진 업로드 — 발급(POST /dating/profile/photo) → S3 PUT 두 단계를 한 함수로 묶어 화면은 photoId 만 받는다
// (ARCHITECTURE `uploads.ts` · WKS-BE api-spec.md §10.1). `VITE_API_MOCK=true` 면 요청 없이 목 id 를 돌려준다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const MOCK_UPLOAD_DELAY_MS = 500;

export type PhotoUpload = { photoId: string };

// 백엔드는 10MB 를 넘는 사진을 업로드 때가 아니라 프로필 저장 때 거절한다(WKS-BE DatingPhotoService) —
// 입력을 다 마친 뒤에 막히지 않도록 고르는 순간 거른다.
export const DATING_PHOTO_MAX_BYTES = 10 * 1024 * 1024;

// 백엔드가 썸네일을 만들 때 거절하는 한도(WKS-BE DatingPhotoService.MAX_PIXELS). 용량이 작아도 화소가 많으면
// 걸린다 — 요즘 폰 사진이 자주 넘는다. 여기서 먼저 걸러야 "다 입력하고 저장에서 실패"가 되지 않는다.
export const DATING_PHOTO_MAX_PIXELS = 20_000_000;

// 왜 실패했는지 — 화면이 원인에 맞는 문구를 고르는 데 쓴다(2026-09-29 QA: 용량 초과도 '연결이 원활하지 않아요'
// 로만 보였다). 문구는 화면이 갖는다(`features/dating/profile/photoView.ts`).
export type PhotoUploadFailure =
  | 'type' // JPG·PNG 가 아니다
  | 'size' // 10MB 를 넘는다
  | 'pixels' // 화소가 너무 많다
  | 'unreadable' // 이미지로 열리지 않는다(확장자만 사진인 파일·깨진 파일)
  | 'auth' // 로그인이 풀렸다
  | 'rejected' // 백엔드가 거절했다
  | 'network'; // 연결 실패 · 봉투가 계약과 다름

export type PhotoUploadResult =
  { ok: true; data: PhotoUpload } | { ok: false; failure: PhotoUploadFailure };

// 화소 수를 읽는다. 브라우저가 못 여는 파일은 백엔드(ImageIO)도 못 열어 'unreadable' 로 본다.
// `createImageBitmap` 이 없는 환경에서는 건너뛰고 백엔드 판단에 맡긴다 — 여기서 막는 건 편의일 뿐이다.
async function readPixelCount(file: File): Promise<number | 'unreadable' | null> {
  if (typeof createImageBitmap !== 'function') return null;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return 'unreadable';
  }
  const pixels = bitmap.width * bitmap.height;
  bitmap.close();
  return pixels;
}

export async function uploadDatingPhoto(file: File): Promise<PhotoUploadResult> {
  const contentType = datingPhotoContentTypeSchema.safeParse(file.type);
  if (!contentType.success) return { ok: false, failure: 'type' };
  if (file.size > DATING_PHOTO_MAX_BYTES) return { ok: false, failure: 'size' };

  const pixels = await readPixelCount(file);
  if (pixels === 'unreadable') return { ok: false, failure: 'unreadable' };
  if (pixels !== null && pixels > DATING_PHOTO_MAX_PIXELS) return { ok: false, failure: 'pixels' };

  if (isMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_UPLOAD_DELAY_MS));
    return { ok: true, data: { photoId: crypto.randomUUID() } };
  }

  const issued = await request(
    { method: 'POST', path: '/dating/profile/photo', body: { contentType: contentType.data } },
    datingPhotoUploadSchema,
  );
  if (!issued.ok) {
    if (issued.error.kind !== 'api') return { ok: false, failure: 'network' };
    return {
      ok: false,
      failure: issued.error.code === 'UNAUTHENTICATED' ? 'auth' : 'rejected',
    };
  }

  // S3 는 봉투가 없는 빈 응답을 준다 — 상태 코드로만 본다. Content-Type 이 발급 때와 다르면 서명이 깨진다.
  try {
    const response = await fetch(issued.data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType.data },
      body: file,
    });
    // 서명이 만료됐거나(403) S3 가 파일을 거부하면 다시 고르는 것이 답이라 'rejected' 로 알린다.
    if (!response.ok)
      return { ok: false, failure: response.status >= 500 ? 'network' : 'rejected' };
  } catch {
    return { ok: false, failure: 'network' };
  }
  return { ok: true, data: { photoId: issued.data.photoId } };
}
