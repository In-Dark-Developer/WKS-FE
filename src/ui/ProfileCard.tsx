import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/cn';
import rotateRight from '@/ui/assets/icons/rotate-right.svg';
import { Icon } from '@/ui/Icon';

export type ProfileCardFace = 'front' | 'back';

type Props = {
  // 카드 전체를 채우는 배경(사진·빈 상태 그림). 앞·뒷면이 같이 쓴다.
  background: ReactNode;
  front: ReactNode;
  // 뒷면이 없는 카드(빈 상태)는 뒤집기 버튼도 없다.
  back?: ReactNode;
  initialFace?: ProfileCardFace;
  flipLabel?: string;
  className?: string;
};

// 소개팅 인연 카드 틀 — Figma 카드 앞면 96:1876 · 뒷면 103:2543 (343×433).
// 앞면은 아래 절반, 뒷면은 전체에 어둠 그라데이션을 깔고 그 위에 슬롯 내용을 얹는다. 내용과 값은 쓰는 화면이 정한다.
export function ProfileCard({
  background,
  front,
  back,
  initialFace = 'front',
  flipLabel = '카드 뒤집기',
  className,
}: Props) {
  const [face, setFace] = useState<ProfileCardFace>(back ? initialFace : 'front');
  const isBack = face === 'back';

  return (
    <div
      className={cn(
        'relative h-[433px] w-full overflow-hidden rounded-12 border border-neutral-0 bg-neutral-800 shadow-lg',
        className,
      )}
      data-face={face}
    >
      <div className="absolute inset-0">{background}</div>

      <div className="absolute inset-0 flex flex-col justify-end" hidden={isBack}>
        <div className="bg-linear-to-b from-transparent to-neutral-900 to-60% px-20 pt-48 pb-24 opacity-90">
          {front}
        </div>
      </div>

      {back ? (
        <div
          className="absolute inset-0 bg-linear-to-b from-transparent to-neutral-900 to-60% opacity-90"
          hidden={!isBack}
        >
          {back}
        </div>
      ) : null}

      {back ? (
        <button
          aria-pressed={isBack}
          className="absolute top-12 left-1/2 flex -translate-x-1/2 items-center gap-8 rounded-999 border border-neutral-100 px-12 py-4 text-ui-12 whitespace-nowrap text-neutral-100 backdrop-blur-sm"
          onClick={() => setFace(isBack ? 'front' : 'back')}
          type="button"
        >
          <Icon className="size-[14px]" src={rotateRight} />
          {flipLabel}
        </button>
      ) : null}
    </div>
  );
}
