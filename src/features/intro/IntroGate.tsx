import { useState, type ReactNode } from 'react';

import { hasSeenIntro, markIntroSeen } from './introSeen';
import { IntroVideo } from './IntroVideo';

type Props = { children: ReactNode };

// 첫 방문이면 인트로를 먼저 보여주고, 끝나거나 건너뛰면 children(사주 입력)으로 바꾼다 (FR-1).
// 끝까지 가야 봤다고 기록한다 — 보는 중에 새로고침하면 다시 나온다.
export function IntroGate({ children }: Props) {
  const [isPlaying, setIsPlaying] = useState(() => !hasSeenIntro());

  function handleFinish() {
    markIntroSeen();
    setIsPlaying(false);
  }

  return isPlaying ? <IntroVideo onFinish={handleFinish} /> : <>{children}</>;
}
