import { useEffect, useState } from 'react';

import introVideo from '@/ui/assets/video/intro.mp4';
import { Button } from '@/ui/Button';

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
        {canSkip ? (
          <div className="absolute inset-x-0 bottom-40 flex justify-center">
            <Button onClick={onFinish} size="m" variant="secondary">
              건너뛰기
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
