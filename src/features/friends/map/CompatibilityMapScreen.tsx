import { Button } from '@/ui/Button';

import { CompatibilityMap } from './CompatibilityMap';
import { FriendRanking } from './FriendRanking';
import { RelationStats } from './RelationStats';
import type { Friend } from './tiers';

type Props = {
  nickname: string;
  // 순위 순서 — 정렬·조회는 연동 Task 가 한다.
  friends: readonly Friend[];
  onShare?: () => void;
};

// SCR-08 궁합 지도 — Figma 「UI 최종 - 개발용」 지도 최종 v2(558:2625).
export function CompatibilityMapScreen({ nickname, friends, onShare }: Props) {
  return (
    <div className="flex flex-col gap-12 pt-4 pb-24">
      <h1 className="sr-only">{nickname}님의 궁합 지도</h1>
      <CompatibilityMap friends={friends} nickname={nickname} />
      <RelationStats friends={friends} />
      <FriendRanking friends={friends} />
      <Button className="mt-24" onClick={onShare} variant="accent">
        친구에게 공유하고 궁합 지도 넓히기
      </Button>
    </div>
  );
}
