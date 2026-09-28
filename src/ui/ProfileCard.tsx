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

// 앞·뒷면을 같은 자리에 겹쳐 두고 뒷면만 미리 180도 돌려 둔다. `backface-hidden` 이 돌아간 동안
// 뒤통수를 가려, 절반을 지나면 다른 면이 나타난다(홈 운명 카드 ConnectionCard.css 와 같은 방식).
const faceClass =
  'absolute inset-0 overflow-hidden rounded-12 border border-neutral-0 bg-neutral-800 shadow-lg backface-hidden';

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
        // Figma 카드 규격 343×433 — 높이를 고정하지 않고 비율로 둔다. 화면 폭이 달라도(360~430px)
        // 가로세로가 함께 늘고 375px 에서 정확히 343×433 이 된다(Figma 96:1876 · 134:2527).
        // 원근은 홈 운명 카드와 같은 1200px 다.
        'relative aspect-[343/433] w-full perspective-[1200px]',
        className,
      )}
      data-face={face}
    >
      <div
        className={cn(
          'relative size-full transition-transform duration-500 ease-out transform-3d',
          // 동작 줄이기 설정에서는 돌아가는 모습 없이 면만 바뀐다(NFR-5).
          'motion-reduce:transition-none',
          isBack && 'rotate-y-180',
        )}
        data-profile-card-inner=""
      >
        {/* 앞면 — 뒤집힌 동안에는 화면 낭독기·탭 이동에서 뺀다. */}
        <div aria-hidden={isBack} className={faceClass} inert={isBack}>
          <div className="absolute inset-0">{background}</div>
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="bg-linear-to-b from-transparent to-neutral-900 to-60% px-20 pt-48 pb-24 opacity-90">
              {front}
            </div>
          </div>
        </div>

        {back ? (
          <div aria-hidden={!isBack} className={cn(faceClass, 'rotate-y-180')} inert={!isBack}>
            <div className="absolute inset-0">{background}</div>
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-neutral-900 to-60% opacity-90">
              {back}
            </div>
          </div>
        ) : null}
      </div>

      {back ? (
        <button
          aria-pressed={isBack}
          // 카드와 함께 돌지 않게 회전하는 칸 밖에 둔다(ConnectionCard 와 같다).
          // 사진 위에 얹히는 유리 칩 — 흰색 18% 채움 + 테두리(Figma 134:2275). 채움이 없으면
          // 밝은 사진 위에서 글자가 묻힌다.
          className="absolute top-12 left-1/2 z-10 flex -translate-x-1/2 items-center gap-8 rounded-999 border border-neutral-100 bg-opacity-card-neutral-0-18 px-12 py-4 text-ui-12 whitespace-nowrap text-neutral-100 backdrop-blur-sm"
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
