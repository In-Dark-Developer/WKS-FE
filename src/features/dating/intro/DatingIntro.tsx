import { useState } from 'react';

import bottom1 from '@/ui/assets/dating/card-wall/bottom-1.webp';
import bottom2 from '@/ui/assets/dating/card-wall/bottom-2.webp';
import bottom3 from '@/ui/assets/dating/card-wall/bottom-3.webp';
import bottom4 from '@/ui/assets/dating/card-wall/bottom-4.webp';
import bottom5 from '@/ui/assets/dating/card-wall/bottom-5.webp';
import middle1 from '@/ui/assets/dating/card-wall/middle-1.webp';
import middle2 from '@/ui/assets/dating/card-wall/middle-2.webp';
import middle3 from '@/ui/assets/dating/card-wall/middle-3.webp';
import middle4 from '@/ui/assets/dating/card-wall/middle-4.webp';
import middle5 from '@/ui/assets/dating/card-wall/middle-5.webp';
import top1 from '@/ui/assets/dating/card-wall/top-1.webp';
import top2 from '@/ui/assets/dating/card-wall/top-2.webp';
import top3 from '@/ui/assets/dating/card-wall/top-3.webp';
import top4 from '@/ui/assets/dating/card-wall/top-4.webp';
import top5 from '@/ui/assets/dating/card-wall/top-5.webp';
import { Button } from '@/ui/Button';

import { DatingBackdrop } from '../DatingBackdrop';
import { LoginSheet } from './LoginSheet';

// 소개팅 인트로 뷰 모델 — 로그인 여부는 연동 Task 가 `GET /me` 로 판단해 넘긴다(FR-24, ARCHITECTURE V1).
export type DatingIntroView = { viewer: 'guest' | 'member' };

type Props = {
  view: DatingIntroView;
  // 로그인한 사용자가 '내 운명 찾아 떠나기'를 누를 때 — 프로필 등록 또는 추천으로 보내는 일은 부르는 쪽이 한다.
  onStart: () => void;
  onKakaoLogin: () => void;
  onLogout: () => void;
  // 미리보기용 — 로그인 시트를 연 채로 시작한다(Intro 1.1.1).
  initialSheetOpen?: boolean;
};

// SCR-15 소개팅 인트로 — Figma Intro 1.1 비로그인(126:2097) · 2.1 로그인(132:3472) · 1.1.1 카카오 시트(132:3133).
export function DatingIntro({
  view,
  onStart,
  onKakaoLogin,
  onLogout,
  initialSheetOpen = false,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(view.viewer === 'guest' && initialSheetOpen);
  const isGuest = view.viewer === 'guest';

  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center gap-32 text-center">
      <DatingBackdrop variant="intro">
        <CardWall />
      </DatingBackdrop>

      <div className="flex flex-col gap-20 text-neutral-100">
        <h1 className="font-display text-display-20">
          당신은 운명을 믿으십니까?
          <br />내 사주 속 인연은 어디에 있을까요?
        </h1>
        <p className="text-ui-14">
          내 인생에 하나뿐인 인연을 찾아드립니다.
          <br />
          사주 속 운명의 실을 따라 내 반쪽을 찾으러 가보세요!
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-16">
        <Button
          className="w-full"
          onClick={isGuest ? () => setSheetOpen(true) : onStart}
          size="m"
          variant="accent"
        >
          {isGuest ? '로그인하고 내 운명 찾아 떠나기' : '내 운명 찾아 떠나기'}
        </Button>
        {isGuest ? null : (
          <button
            className="text-ui-14 text-neutral-200 underline"
            onClick={onLogout}
            type="button"
          >
            로그아웃
          </button>
        )}
      </div>

      <LoginSheet
        onClose={() => setSheetOpen(false)}
        onKakaoLogin={onKakaoLogin}
        open={sheetOpen}
      />
    </section>
  );
}

// 배경의 흐린 인연 카드 벽 — 장식이라 값이 없고 읽히지 않는다(Figma 132:2982 등 세 줄).
// 줄마다 끝없이 흐른다: 1·3번 줄은 왼쪽, 2번 줄은 오른쪽(dating.css [data-card-wall-row]).
// 카드 한 벌을 두 번 이어 붙이고 한 벌 길이만큼 옮긴 뒤 처음으로 돌아가므로 이음매가 보이지 않는다 —
// 간격을 gap 이 아니라 카드마다 오른쪽 여백(pr-12)으로 줘야 두 벌 사이 간격도 카드 사이 간격과 같다.
// 카드는 세 줄 모두 같은 규격(171×216)이고, 줄 사이 간격도 카드 사이 간격과 같은 12px 이다.
// phase 는 Figma 에서 그 줄이 왼쪽으로 밀려 있던 거리(px)이고, 한 벌 길이(183px × 5) 중 그만큼 진행한 데서 시작한다.
// 사진은 Figma 1.2 로그인 성공(365:9257)의 줄별 카드 다섯 장이다.
const cardsPerSet = 5;
const setWidth = (171 + 12) * cardsPerSet;
const wallRows = [
  { id: 'top', direction: 'left', phase: 227, photos: [top1, top2, top3, top4, top5] },
  {
    id: 'middle',
    direction: 'right',
    phase: 212,
    photos: [middle1, middle2, middle3, middle4, middle5],
  },
  {
    id: 'bottom',
    direction: 'left',
    phase: 547,
    photos: [bottom1, bottom2, bottom3, bottom4, bottom5],
  },
] as const;

// 왼쪽으로 흐르는 줄은 0 → -한 벌, 오른쪽은 -한 벌 → 0 으로 움직인다. 음수 지연으로 그 진행 지점에서 시작한다.
function startDelay(direction: 'left' | 'right', phase: number): string {
  const progress = direction === 'left' ? phase / setWidth : 1 - phase / setWidth;
  return `calc(var(--card-wall-duration) * ${-progress.toFixed(4)})`;
}

function CardWall() {
  return (
    <div className="absolute top-[30px] left-0 flex flex-col gap-12">
      {wallRows.map((row) => (
        <div
          className="flex"
          data-card-wall-row={row.direction}
          key={row.id}
          style={{ animationDelay: startDelay(row.direction, row.phase) }}
        >
          {[...row.photos, ...row.photos].map((photo, index) => (
            <div className="shrink-0 pr-12" key={index}>
              <WallCard photo={photo} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// 카드 한 장 — 모든 줄이 이 하나를 쓴다. 사진은 Figma 처럼 흐리게 깔고 아래쪽을 어둡게 덮는다.
function WallCard({ photo }: { photo: string }) {
  return (
    <div className="relative flex h-[216px] w-[171px] flex-col justify-end gap-4 overflow-hidden rounded-8 border border-neutral-0 bg-neutral-900 p-12 text-neutral-0">
      <img
        alt=""
        className="absolute top-[-14px] left-[-6px] h-[229px] w-[183px] max-w-none object-cover blur-[7.5px]"
        src={photo}
      />
      <div className="absolute inset-x-0 bottom-0 h-[117px] bg-linear-to-b from-transparent to-neutral-900 opacity-90" />
      <span className="relative font-sungkok text-ui-12">천생연분</span>
      <span className="relative h-4 w-3/4 rounded-999 bg-neutral-400" />
      <span className="relative h-4 w-full rounded-999 bg-neutral-400" />
    </div>
  );
}
