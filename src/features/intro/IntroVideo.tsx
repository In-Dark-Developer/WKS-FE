import { useEffect, useState } from 'react';

import introVideo from '@/ui/assets/video/intro.mp4';

const SKIP_AFTER_MS = 2000;

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
      <div className="relative h-full w-full max-w-[430px]">
        <video
          aria-label="인트로 영상"
          autoPlay
          className="h-full w-full object-cover"
          muted
          onEnded={onFinish}
          onError={onFinish}
          playsInline
          src={introVideo}
        />
        {/* 영상 위에 떠 있는 반투명 버튼 — 디자인시스템 Button 에 없는 모양이라 여기서만 쓴다(소유자 참고 캡처). */}
        {canSkip ? (
          <button
            className="absolute top-16 right-16 rounded-8 border border-opacity-card-neutral-0-80 bg-opacity-card-neutral-0-50 px-16 py-8 text-ui-12 font-semibold tracking-widest text-primary backdrop-blur-xs focus-visible:outline-2 focus-visible:outline-focus"
            onClick={onFinish}
            type="button"
          >
            건너뛰기
          </button>
        ) : null}
      </div>
    </div>
  );
}
