import { useState, type ReactNode } from 'react';

import { hasPassedTeaser, hasSeenIntro, markIntroSeen, markTeaserPassed } from './introSeen';
import { IntroVideo } from './IntroVideo';

type Stage = 'intro' | 'teaser' | 'done';

type Props = {
  // 메인 티저 — 이동은 부르는 쪽(app)이 정한다. pass 를 부르면 지난 것으로 기록하고 children 으로 바꾼다.
  // 없으면 인트로 뒤 바로 children 이다 — 공유 링크로 처음 들어온 방문자는 티저 없이 입력(SCR-06)으로 간다.
  teaser?: (pass: () => void) => ReactNode;
  children: ReactNode;
};

function stageAfterIntro(hasTeaser: boolean): Stage {
  return hasTeaser && !hasPassedTeaser() ? 'teaser' : 'done';
}

// 첫 방문이면 인트로 → 메인 티저 → children(사주 입력) 순서로 보여준다 (FR-1 V1).
// 인트로는 끝까지 가야 봤다고 기록한다 — 보는 중에 새로고침하면 다시 나온다. 티저는 진입을 골라야 지나간다.
export function IntroGate({ teaser, children }: Props) {
  const [stage, setStage] = useState<Stage>(() =>
    hasSeenIntro() ? stageAfterIntro(teaser !== undefined) : 'intro',
  );

  function handleIntroFinish() {
    markIntroSeen();
    setStage(stageAfterIntro(teaser !== undefined));
  }

  function passTeaser() {
    markTeaserPassed();
    setStage('done');
  }

  if (stage === 'intro') return <IntroVideo onFinish={handleIntroFinish} />;
  if (stage === 'teaser' && teaser) return <>{teaser(passTeaser)}</>;
  return <>{children}</>;
}
