import type { PreviewScreen } from '@/app/preview/previewScreen';
import { MyMapScreen } from '@/app/screens/MyMapScreen';
import { SharedMapScreen } from '@/app/screens/SharedMapScreen';
import type { Friend } from '@/features/friends';

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

const SHARE_ID = '9f0d3f1e-0000-4000-8000-000000000001';
const noop = () => undefined;

function MyMap({ friends: list }: { friends: readonly Friend[] }) {
  return <MyMapScreen friends={list} nickname="달빛토끼" onBack={noop} shareId={SHARE_ID} />;
}

// SCR-08 궁합 지도 — 05/T2. SCR-13 친구의 궁합 지도(링크 주인의 지도) — 05/T5·T10.
// 조립은 라우트와 같은 `@/app/screens/` 의 두 화면을 쓴다.
export const preview: PreviewScreen = {
  title: 'SCR-08 궁합 지도',
  order: 3,
  backdrop: 'result',
  states: {
    '친구 6명': () => <MyMap friends={friends} />,
    '친구 24명(붐비는 궤도)': () => <MyMap friends={crowdedFriends} />,
    '친구 2명': () => <MyMap friends={friends.slice(0, 2)} />,
    '빈 상태': () => <MyMap friends={[]} />,
    'SCR-13 친구의 궁합 지도': () => (
      <SharedMapScreen friends={friends.slice(0, 5)} nickname="달빛토끼" onViewMyReading={noop} />
    ),
    'SCR-13 친구의 궁합 지도 · 친구 없음': () => (
      <SharedMapScreen friends={[]} nickname="달빛토끼" onViewMyReading={noop} />
    ),
  },
};
