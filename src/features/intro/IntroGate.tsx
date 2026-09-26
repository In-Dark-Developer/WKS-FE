import { useEffect, useState, type ReactNode } from 'react';

import {
  hasPassedTeaser,
  hasSeenIntro,
  markIntroSeen,
  markTeaserPassed,
  resetTeaserPassed,
} from './introSeen';
import { IntroVideo } from './IntroVideo';

type Stage = 'intro' | 'teaser' | 'done';

type Props = {
  // 메인 티저 — 이동은 부르는 쪽(app)이 정한다. pass 를 부르면 지난 것으로 기록하고 children 으로 바꾼다.
  // 없으면 인트로 뒤 바로 children 이다 — 공유 링크로 처음 들어온 방문자는 티저 없이 입력(SCR-06)으로 간다.
  teaser?: (pass: () => void) => ReactNode;
  // 이 화면을 떠날 때 부른다 — false 면 티저를 지난 기록을 지워 다음에 올 때 티저부터 보인다.
  // 사주 결과가 없는 사용자는 홈 탭·뒤로가기로 돌아와도 티저가 홈이다(FR-19, 2026-09-26). 없으면 이번 접속 내내 기억한다.
  keepPassedOnLeave?: () => boolean;
  children: ReactNode;
};

function stageAfterIntro(hasTeaser: boolean): Stage {
  return hasTeaser && !hasPassedTeaser() ? 'teaser' : 'done';
}

// 첫 방문이면 인트로 → 메인 티저 → children(사주 입력) 순서로 보여준다 (FR-1 V1).
// 인트로는 끝까지 가야 봤다고 기록한다 — 보는 중에 새로고침하면 다시 나온다. 티저는 진입을 골라야 지나간다.
export function IntroGate({ teaser, keepPassedOnLeave, children }: Props) {
  const [stage, setStage] = useState<Stage>(() =>
    hasSeenIntro() ? stageAfterIntro(teaser !== undefined) : 'intro',
  );

  // 떠날 때(언마운트) 한 번 판단한다 — 폼을 제출해 결과가 생긴 뒤 떠나면 기록을 남긴다.
  // keepPassedOnLeave 는 모듈 수준 함수처럼 고정된 참조로 넘긴다(바뀌면 정리가 먼저 돈다).
  useEffect(
    () => () => {
      if (keepPassedOnLeave && !keepPassedOnLeave()) resetTeaserPassed();
    },
    [keepPassedOnLeave],
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
