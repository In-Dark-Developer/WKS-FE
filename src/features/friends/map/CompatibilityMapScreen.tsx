import type { ReactNode } from 'react';

import { CompatibilityMap } from './CompatibilityMap';
import { FriendRanking } from './FriendRanking';
import { RelationStats } from './RelationStats';
import type { Friend } from './tiers';

type Props = {
  nickname: string;
  // 순위 순서(점수 높은 순) — 정렬·조회는 연동(05/T3 toReadingView)이 한다.
  friends: readonly Friend[];
  // 맨 아래 '친구에게 공유하고 궁합 지도 넓히기' — friends 는 share feature 를 import 하지 않으므로 app 이 채운다.
  share?: ReactNode;
};

// SCR-08 궁합 지도 — Figma 「UI 최종 - 개발용」 지도 최종 v2(558:2625).
export function CompatibilityMapScreen({ nickname, friends, share }: Props) {
  return (
    <div className="flex flex-col gap-12 pt-4 pb-24">
      <h1 className="sr-only">{nickname}님의 궁합 지도</h1>
      <CompatibilityMap friends={friends} nickname={nickname} />
      <RelationStats friends={friends} />
      <FriendRanking friends={friends} />
      {share ? <div className="mt-24">{share}</div> : null}
    </div>
  );
}
