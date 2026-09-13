import type { PreviewScreen } from '@/app/preview/previewScreen';
import { CompatibilityMapScreen, FriendRanking, type Friend } from '@/features/friends';
import { Button } from '@/ui/Button';

const friends: Friend[] = [
  { nickname: '영채', score: 94, tier: 'GUIIN' },
  { nickname: '진희', score: 83, tier: 'CHALTTEOK' },
  { nickname: '유민', score: 76, tier: 'CHALTTEOK' },
  { nickname: '선우', score: 68, tier: 'BEOT' },
  { nickname: '성준', score: 52, tier: 'SEUCHIM' },
  { nickname: '다정한친구', score: 61, tier: 'BEOT' },
];

// SCR-08 궁합 지도 — 05/T2.
export const preview: PreviewScreen = {
  title: 'SCR-08 궁합 지도',
  order: 3,
  backdrop: 'result',
  states: {
    '친구 6명': () => <CompatibilityMapScreen friends={friends} nickname="달빛토끼" />,
    '친구 2명': () => <CompatibilityMapScreen friends={friends.slice(0, 2)} nickname="달빛토끼" />,
    '빈 상태': () => <CompatibilityMapScreen friends={[]} nickname="달빛토끼" />,
    '결과 화면 순위 요약': () => (
      <div className="flex flex-col gap-16">
        <FriendRanking friends={friends} limit={3} />
        <FriendRanking
          emptyAction={
            <Button className="w-full" variant="secondary">
              친구에게 공유
            </Button>
          }
          friends={[]}
        />
      </div>
    ),
  },
};
