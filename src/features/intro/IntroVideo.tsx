import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import introVideo from '@/ui/assets/video/intro.mp4';

import './IntroVideo.css';

const SKIP_AFTER_MS = 2000;

// 영상 위에 떠 있는 반투명 칸 — 디자인시스템 Button 에 없는 모양이라 여기서만 쓴다(소유자 참고 캡처).
const skipClass =
  'rounded-8 border border-opacity-card-neutral-0-80 bg-opacity-card-neutral-0-50 px-16 py-12 text-ui-12 font-semibold tracking-widest text-primary backdrop-blur-xs';

type Props = { onFinish: () => void };

// SCR-01 인트로 — 디자인 없이 전달받은 8초 영상 (FR-1). 모바일 브라우저는 소리 있는 자동 재생을
// 막으므로 음소거로 재생한다.
export function IntroVideo({ onFinish }: Props) {
  const [canSkip, setCanSkip] = useState(false);

  // 영상 재생 시각이 아니라 화면에 뜬 시각으로 센다 — 자동 재생이 막혀도(저전력 모드 등) 2초 뒤 넘길 수 있다.
  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), SKIP_AFTER_MS);
    return () => clearTimeout(timer);
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
            src={introVideo}
          />
          {/* 건너뛰기 칸은 영상 속 로고를 처음부터 가린다 — 2초 전에는 글자 없이 같은 크기의 빈 칸이다. */}
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
            <div aria-hidden="true" className={skipClass} data-intro-skip="">
              <span className="invisible">건너뛰기</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
