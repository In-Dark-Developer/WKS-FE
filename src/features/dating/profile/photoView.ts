// 프로필 사진 업로드 상태 뷰 모델 — 업로드 URL 발급 → 업로드 → 저장은 연동 Task(10/T1)가 하고 화면은 상태만 그린다(FR-25).
// previewUrl 은 내가 올린 사진의 미리보기다(상대 사진이 아니다).
export type DatingPhotoView = {
  status: 'empty' | 'uploading' | 'uploaded' | 'error';
  previewUrl?: string;
};
