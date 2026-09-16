import type { PreviewScreen } from '@/app/preview/previewScreen';
import { ShareJoinLoading } from '@/features/friends';

// 공유 링크 첫 진입 대기 화면 — Figma 「ui (기획 확인용)」 [최종] 링크 공유 시 친구가 보이는 화면(1044:4150).
export const preview: PreviewScreen = {
  title: '공유 링크 대기',
  order: 4,
  backdrop: 'result',
  states: {
    '만드는 중': () => <ShareJoinLoading />,
  },
};
