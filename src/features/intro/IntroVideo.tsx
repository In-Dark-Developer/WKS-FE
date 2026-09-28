import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import introVideo from '@/ui/assets/video/intro.mp4';

import './IntroVideo.css';

// 영상 첫 프레임(406×720 webp 7KB) — 1MB 영상이 도착하기 전에 같은 그림을 먼저 그린다. index.html 이 해시 없는
// 이 주소를 preload 해 JS 가 뜨자마자 그려지고, 첫 방문의 LCP 가 이 그림이 된다(08/T5, NFR-2).
const introPoster = '/intro-poster.webp';

// 건너뛰기까지 남은 초 — 칸에 2 → 1 을 보인 뒤 버튼이 된다(FR-1).
const SKIP_AFTER_SECONDS = 2;

// 영상 위에 떠 있는 반투명 칸 — 디자인시스템 Button 에 없는 모양이라 여기서만 쓴다(소유자 참고 캡처).
const skipClass =
  'rounded-8 border border-opacity-card-neutral-0-80 bg-opacity-card-neutral-0-50 px-16 py-12 text-ui-12 font-semibold tracking-widest text-primary backdrop-blur-xs';

type Props = { onFinish: () => void };

// SCR-01 인트로 — 디자인 없이 전달받은 8초 영상 (FR-1). 모바일 브라우저는 소리 있는 자동 재생을
// 막으므로 음소거로 재생한다.
export function IntroVideo({ onFinish }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(SKIP_AFTER_SECONDS);
  const canSkip = secondsLeft === 0;

  // 영상 재생 시각이 아니라 화면에 뜬 시각으로 센다 — 자동 재생이 막혀도(저전력 모드 등) 2초 뒤 넘길 수 있다.
  useEffect(() => {
    let left = SKIP_AFTER_SECONDS;
    const timer = setInterval(() => {
      left -= 1;
      setSecondsLeft(left);
      if (left === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-neutral-900">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden">
        <div data-intro-frame="">
          <video
            aria-label="인트로 영상"
            autoPlay
            className="h-full w-full"
            muted
            onEnded={onFinish}
            onError={onFinish}
            playsInline
            poster={introPoster}
            src={introVideo}
          />
          {/* 건너뛰기 칸은 영상 속 로고를 처음부터 가린다 — 2초 전에는 같은 크기의 칸에 남은 초를 보인다.
              숫자는 버튼이 아니라서 스크린리더에서 숨긴다. */}
          {canSkip ? (
            <button
              className={cn(skipClass, 'focus-visible:outline-2 focus-visible:outline-focus')}
              data-intro-skip=""
              onClick={onFinish}
              type="button"
            >
              건너뛰기
            </button>
          ) : (
            <div aria-hidden="true" className={cn(skipClass, 'grid')} data-intro-skip="">
              <span className="invisible col-start-1 row-start-1">건너뛰기</span>
              <span className="col-start-1 row-start-1 text-center" data-intro-countdown="">
                {secondsLeft}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
