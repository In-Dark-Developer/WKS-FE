import type { PreviewScreen } from '@/app/preview/previewScreen';
import { MyMapScreen } from '@/app/screens/MyMapScreen';
import { CompatibilityReasonSheet, ReasonAnswers, type ReasonState } from '@/features/friends';

const friends = [
  { nickname: '연꽃친구', score: 90, tier: 'GUIIN', compatibilityId: 1 },
  { nickname: '달빛친구', score: 83, tier: 'CHALTTEOK', compatibilityId: 2 },
  { nickname: '다정한친구', score: 68, tier: 'BEOT', compatibilityId: 3 },
  { nickname: '스쳐간친구', score: 52, tier: 'SEUCHIM', compatibilityId: 4 },
] as const;

const ready: ReasonState = {
  status: 'ready',
  why: '나무의 기운이 불의 기운을 살리는 사이라, 함께 있으면 서로의 장점이 더 잘 드러나요. 달빛친구님은 당신이 망설일 때 먼저 손을 내밀어 주는 사람이에요.',
  together:
    '함께 있으면 한 사람이 먼저 길을 내고 다른 사람이 그 길을 밝혀 주는 사이예요. 새로운 곳에 같이 가 보면 대화가 끊이지 않아요.',
  conflict: '불의 기운 쪽이 먼저 달아오르기 쉬워요. 한 박자 쉬고 이야기하면 금방 풀려요.',
};

const noop = () => undefined;

function Sheet({ index, state }: { index: number; state: ReasonState }) {
  const friend = friends[index] ?? friends[0];
  return (
    <>
      <MyMapScreen
        friends={friends}
        nickname="달빛토끼"
        onBack={noop}
        onSelectFriend={noop}
        shareId="s"
      />
      <CompatibilityReasonSheet friend={friend} onClose={noop} rank={index + 1}>
        <ReasonAnswers onRetry={noop} state={state} tier={friend.tier} />
      </CompatibilityReasonSheet>
    </>
  );
}

// SCR-21 궁합 이유 상세 — 09/T4 (Figma 3.2 30:5749). 궁합 지도 위의 시트, 선택한 줄은 등급 색이다.
export const preview: PreviewScreen = {
  title: 'SCR-21 궁합 이유 상세',
  order: 9,
  backdrop: 'result',
  states: {
    '귀인 — 답': () => <Sheet index={0} state={ready} />,
    '찰떡 — 답': () => <Sheet index={1} state={ready} />,
    '벗 — 생성 중': () => <Sheet index={2} state={{ status: 'loading' }} />,
    '스침 — 실패': () => <Sheet index={3} state={{ status: 'error' }} />,
  },
};
