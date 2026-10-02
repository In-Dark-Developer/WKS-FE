import type { PreviewScreen } from '@/app/preview/previewScreen';
import { SiteClosed } from '@/features/intro';

// 사이트 종료 화면 — 운영 배포에서 종료 시각(VITE_SITE_CLOSE_AT) 뒤 모든 주소를 대신한다(App.tsx).
export const preview: PreviewScreen = {
  title: '사이트 종료',
  order: 100,
  states: {
    안내: () => <SiteClosed />,
    '커피 모달': () => <SiteClosed initialView="coffee" />,
    피드백: () => <SiteClosed initialView="feedback" />,
  },
};
