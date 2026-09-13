import type { PreviewScreen } from '@/app/preview/previewScreen';
import { SajuForm } from '@/features/saju';

const SUBMIT_DELAY_MS = 1200;

// SCR-02 사주 입력 — 빈 칸으로 제출하면 오류, 채워서 제출하면 로딩중 뒤 연결문제 상태가 보인다.
export const preview: PreviewScreen = {
  title: 'SCR-02 사주 입력',
  order: 0,
  states: { 기본: SajuForm },
  action: async () => {
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
    return { formError: 'connection' };
  },
};
