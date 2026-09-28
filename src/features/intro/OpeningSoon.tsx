import { useEffect, useState } from 'react';

import orbs from '@/ui/assets/teaser/orbs.webp';

import { formatOpenAt, formatRemaining } from './openingGate';
import './OpeningSoon.css';

type Props = {
  openAt: number;
  // 오픈 시각이 되면 한 번 부른다 — 새로고침 없이 서비스로 넘어간다.
  onOpen: () => void;
};

// 오픈 대기 화면 — 메인 티저(Figma v1.0 「0. 메인 진입 티저」)의 제목·구슬 그림에 결과 화면 사전신청 섹션의
// 'GRAND OPEN' 글꼴·칠을 얹었다. 디자인에 없는 화면이라 기존 토큰으로 그린다. 배경은 AppShell 의 dawn 이다.
export function OpeningSoon({ openAt, onOpen }: Props) {
  const [now, setNow] = useState(() => Date.now());
  const remaining = openAt - now;

  useEffect(() => {
    if (remaining <= 0) {
      onOpen();
      return;
    }
    const timer = setTimeout(() => setNow(Date.now()), Math.min(1000, remaining));
    return () => clearTimeout(timer);
  }, [remaining, onOpen]);

  return (
    <section
      aria-labelledby="opening-soon-title"
      className="flex flex-col items-center pt-[65px] text-center"
    >
      <header className="flex flex-col items-center gap-24">
        <h1 className="font-display text-display-28 text-primary" id="opening-soon-title">
          운명도 꿰어야 사랑이다
        </h1>
        <p className="text-ui-16 font-medium whitespace-pre-line text-primary-900">
          {'보살님이 인연의 실을 꿰고 있어요.\n문이 열리면 가장 먼저 만나러 와 주세요.'}
        </p>
      </header>

      <img alt="" className="h-[298px] w-[199px] object-cover" draggable={false} src={orbs} />

      <div className="-mt-[6px] flex flex-col items-center gap-24">
        <div className="flex flex-col items-center">
          <p className="font-sungkok text-ui-20 text-primary-900">{formatOpenAt(openAt)}</p>
          <p className="font-slim text-display-40" data-opening-title="">
            GRAND OPEN
          </p>
        </div>

        <div className="flex flex-col items-center gap-8" role="timer">
          <span className="text-ui-14 font-medium text-primary">문이 열리기까지</span>
          <span className="font-display text-display-28 text-primary tabular-nums">
            {formatRemaining(remaining)}
          </span>
        </div>

        <p className="text-ui-14 font-medium whitespace-pre-line text-secondary">
          {'동국대학교 가을 대동제에서\n본인의 운명을 만나보세요!'}
        </p>
      </div>
    </section>
  );
}
