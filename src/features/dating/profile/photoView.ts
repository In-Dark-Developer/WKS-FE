import type { PhotoUploadFailure } from '@/api/uploads';

// 프로필 사진 업로드 상태 뷰 모델 — 업로드 URL 발급 → 업로드 → 저장은 연동 Task(10/T1)가 하고 화면은 상태만 그린다(FR-25).
// previewUrl 은 내가 올린 사진의 미리보기다(상대 사진이 아니다).
export type DatingPhotoView = {
  status: 'empty' | 'uploading' | 'uploaded' | 'error';
  previewUrl?: string;
  // status 가 'error' 일 때만 있다 — 없으면 원인을 모르는 실패로 본다.
  failure?: PhotoUploadFailure;
};

// 원인별 안내(2026-09-29 QA: 용량이 넘쳐도 '연결이 원활하지 않아요' 하나로만 보였다).
// 고칠 방법을 한 문장에 담는다 — 무엇이 틀렸는지와 다음에 무엇을 할지.
const PHOTO_ERROR_MESSAGES: Record<PhotoUploadFailure, string> = {
  type: 'JPEG·PNG 사진만 올릴 수 있어요. 다른 파일을 골라 주세요.',
  size: '사진 용량이 10MB를 넘어요. 더 작은 사진으로 올려 주세요.',
  pixels: '사진 크기가 너무 커요. 사진을 줄여서 다시 올려 주세요.',
  unreadable: '사진을 열 수 없어요. 파일이 손상되지 않았는지 확인해 주세요.',
  auth: '로그인이 풀렸어요. 다시 로그인한 뒤 사진을 올려 주세요.',
  rejected: '사진을 등록하지 못했어요. 다른 사진으로 다시 시도해 주세요.',
  network: '연결이 원활하지 않아요. 잠시 뒤 다시 시도해 주세요.',
};

const UNKNOWN_PHOTO_ERROR = 'JPEG·PNG, 10MB 이하 사진인지 확인하고 다시 시도해 주세요.';

export function photoErrorMessage(failure: PhotoUploadFailure | undefined): string {
  return failure === undefined ? UNKNOWN_PHOTO_ERROR : PHOTO_ERROR_MESSAGES[failure];
}
