import type { PreviewScreen } from '@/app/preview/previewScreen';
import { OpeningSoon } from '@/features/intro';

// 오픈 시각은 2026-09-29 09:00 KST(운영 VITE_OPEN_AT). 미리보기는 남은 시간 모양만 보려고 지금 기준으로 잡는다.
const hoursFromNow = (hours: number) => Date.now() + hours * 3600_000;

// 오픈 대기 화면 — 운영 배포에서 오픈 시각 전 모든 주소를 대신한다(App.tsx).
export const preview: PreviewScreen = {
  title: '오픈 대기',
  order: 99,
  states: {
    '9시간 전': () => <OpeningSoon onOpen={() => {}} openAt={hoursFromNow(9)} />,
    '하루 넘게': () => <OpeningSoon onOpen={() => {}} openAt={hoursFromNow(30)} />,
  },
};
