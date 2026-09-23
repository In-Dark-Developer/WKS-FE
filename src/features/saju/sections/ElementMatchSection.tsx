import type { ReactNode } from 'react';

import type { ReadingView } from '../readingView';

type Props = {
  match: NonNullable<ReadingView['elementMatch']>;
  // 'OO 기운의 사람 만나보기' — 소개팅으로 가는 입구. 이동은 조립하는 쪽(app)이 정한다.
  action?: ReactNode;
};

const hanja = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' } as const;

// Figma Card/Shell(39:2481) — 사주 카드 화면에서 오행 분포 아래, 행운 위(FR-3 V1, 기능명세서 3.5·3.6).
export function ElementMatchSection({ match, action }: Props) {
  return (
    <section
      aria-label="나와 잘 맞는 오행"
      className="flex flex-col gap-12 rounded-16 border border-apricot bg-opacity-card-apricot-50-50 p-16 backdrop-blur-sm"
    >
      <div className="flex flex-col gap-8 text-primary">
        <h2 className="text-ui-18 font-semibold">나와 잘 맞는 오행은</h2>
        <p className="text-center">
          <span className="font-display text-display-32">{match.korean}</span>{' '}
          <span className="text-ui-14 font-semibold">({hanja[match.element]})</span>
        </p>
      </div>
      <p className="text-ui-16 break-keep text-secondary">{match.reason}</p>
      {action ? <div className="flex justify-end">{action}</div> : null}
    </section>
  );
}
