import type { PreviewScreen } from '@/app/preview/previewScreen';
import { DatingIntro } from '@/features/dating';

const noop = () => {};

// SCR-15 소개팅 인트로 — 10/T4 퍼블리싱. 로그인 여부는 연동 Task(10/T1)가 `GET /me` 로 정한다.
export const preview: PreviewScreen = {
  title: 'SCR-15 소개팅 인트로',
  order: 10,
  states: {
    비로그인: () => (
      <DatingIntro onKakaoLogin={noop} onLogout={noop} onStart={noop} view={{ viewer: 'guest' }} />
    ),
    '카카오 로그인 시트': () => (
      <DatingIntro
        initialSheetOpen
        onKakaoLogin={noop}
        onLogout={noop}
        onStart={noop}
        view={{ viewer: 'guest' }}
      />
    ),
    로그인: () => (
      <DatingIntro onKakaoLogin={noop} onLogout={noop} onStart={noop} view={{ viewer: 'member' }} />
    ),
  },
};
