import { useState, type ReactNode } from 'react';

import { hasSeenIntro, markIntroSeen } from './introSeen';
import { IntroVideo } from './IntroVideo';

type Props = {
  // 인트로 뒤에 보일 화면 — `/` 는 메인 티저, 공유 링크(`/s/:shareId`)는 입력(SCR-06)이다.
  children: ReactNode;
};

// 첫 방문이면 인트로를 먼저 보여준다 (FR-1). 인트로는 끝까지 가야 봤다고 기록한다 — 보는 중에 새로고침하면 다시 나온다.
export function IntroGate({ children }: Props) {
  const [isIntro, setIsIntro] = useState(() => !hasSeenIntro());

  if (isIntro) {
    return (
      <IntroVideo
        onFinish={() => {
          markIntroSeen();
          setIsIntro(false);
        }}
      />
    );
  }
  return <>{children}</>;
}
