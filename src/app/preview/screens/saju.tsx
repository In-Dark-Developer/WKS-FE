import type { PreviewScreen } from '@/app/preview/previewScreen';
import { ShareInputScreen } from '@/app/screens/ShareInputScreen';
import { SajuForm } from '@/features/saju';

const SUBMIT_DELAY_MS = 1200;

// SCR-02 사주 입력 — 빈 칸으로 제출하면 오류, 채워서 제출하면 로딩중 뒤 연결문제 상태가 보인다.
// SCR-06 은 같은 폼에 링크 주인 닉네임이 든 설명이 붙은 화면이다(`@/app/screens/ShareInputScreen`).
export const preview: PreviewScreen = {
  title: 'SCR-02 사주 입력',
  order: 0,
  states: {
    기본: SajuForm,
    'SCR-06 공유 링크 입력': () => <ShareInputScreen ownerNickname="달빛토끼" />,
  },
  action: async () => {
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
    return { formError: 'connection' };
  },
};
