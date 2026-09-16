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

// 한 궤도에 44px 간격이 들어가지 않을 만큼 붐빈 상태 — 숨는 시간이 늘어나는지 본다(스침 10명·귀인 8명·찰떡 6명).
const crowdedFriends: Friend[] = [
  ...Array.from({ length: 8 }, (_, i) => ({
    nickname: `귀인${i + 1}`,
    score: 99 - i,
    tier: 'GUIIN' as const,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    nickname: `찰떡${i + 1}`,
    score: 88 - i,
    tier: 'CHALTTEOK' as const,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    nickname: `스침${i + 1}`,
    score: 50 - i,
    tier: 'SEUCHIM' as const,
  })),
];

// SCR-08 궁합 지도 — 05/T2. SCR-13 친구의 궁합 지도(링크 주인의 지도) — 05/T5·T10.
export const preview: PreviewScreen = {
  title: 'SCR-08 궁합 지도',
  order: 3,
  backdrop: 'result',
  states: {
    '친구 6명': () => <CompatibilityMapScreen friends={friends} nickname="달빛토끼" />,
    '뒤로가기 있음(내 지도)': () => (
      <CompatibilityMapScreen
        back={<button type="button">뒤로가기</button>}
        friends={friends}
        nickname="달빛토끼"
      />
    ),
    '친구 24명(붐비는 궤도)': () => (
      <CompatibilityMapScreen friends={crowdedFriends} nickname="달빛토끼" />
    ),
    '친구 2명': () => <CompatibilityMapScreen friends={friends.slice(0, 2)} nickname="달빛토끼" />,
    '빈 상태': () => <CompatibilityMapScreen friends={[]} nickname="달빛토끼" />,
    'SCR-13 친구의 궁합 지도': () => (
      <CompatibilityMapScreen
        friends={friends.slice(0, 5)}
        nickname="달빛토끼"
        share={
          <Button className="w-full" variant="apricot">
            내 사주 내용도 확인하기
          </Button>
        }
        variant="visitor"
      />
    ),
    'SCR-13 친구의 궁합 지도 · 친구 없음': () => (
      <CompatibilityMapScreen
        friends={[]}
        nickname="달빛토끼"
        share={
          <Button className="w-full" variant="apricot">
            내 사주 내용도 확인하기
          </Button>
        }
        variant="visitor"
      />
    ),
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
