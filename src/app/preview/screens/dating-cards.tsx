import type { PreviewScreen } from '@/app/preview/previewScreen';
import { DatingCards, type DatingCardsView, type MatchCandidateView } from '@/features/dating';
import photoHorse from '@/ui/assets/zodiac/zodiac-horse.webp';
import photoRabbit from '@/ui/assets/zodiac/zodiac-rabbit.webp';
import photoTiger from '@/ui/assets/zodiac/zodiac-tiger.webp';

const noop = () => {};

// 사람 사진 대신 십이간지 그림을 쓴다 — 잠긴 사진은 썸네일만 받는다.
const lockedCandidates: readonly MatchCandidateView[] = [
  {
    id: 'c1',
    rank: 1,
    score: 98,
    relationLabel: '천생연분',
    mbti: 'ENTP',
    bio: '안녕하세요! 처음에는 조금 낯을 가리지만 친해지면 장난도 많고 말도 꽤 많은 편이에요. 평소에는 영화나 전시 보러 가는 걸 좋아하고, 새로운 카페나 맛집 찾아다니는 것도 좋아합니다. 같이 축제 공연 보러 갈 사람을 찾아요.',
    photo: { isLocked: true, thumbnailUrl: photoRabbit, cost: 10 },
    name: { isLocked: true, cost: 7 },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  },
  {
    id: 'c2',
    rank: 2,
    score: 87,
    relationLabel: '천생연분',
    mbti: 'INFJ',
    bio: '조용한 카페에서 책 읽는 걸 좋아해요.',
    photo: { isLocked: true, thumbnailUrl: photoTiger, cost: 10 },
    name: { isLocked: true, cost: 7 },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  },
  {
    id: 'c3',
    rank: 3,
    score: 68,
    relationLabel: '천생연분',
    mbti: null,
    bio: '운동하고 맛집 다니는 걸 좋아합니다.',
    photo: { isLocked: true, thumbnailUrl: photoHorse, cost: 10 },
    name: { isLocked: true, cost: 7 },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  },
];

const [first, ...rest] = lockedCandidates;
export const partlyUnlocked: readonly MatchCandidateView[] = first
  ? [
      {
        ...first,
        photo: { isLocked: false, url: photoRabbit },
        name: { isLocked: false, value: '김채원' },
        department: { isLocked: false, value: '바이오헬스의료기기규제과학과' },
        reason: { isLocked: true, cost: 3 },
      },
      ...rest,
    ]
  : lockedCandidates;

// Figma 전체 해금 안 했을 때 보이는 화면(112:3241) — 이름만 열었다.
const nameOnly: readonly MatchCandidateView[] = lockedCandidates.map((candidate, index) =>
  index === 0 ? { ...candidate, name: { isLocked: false, value: '차은호' } } : candidate,
);

const allUnlocked: readonly MatchCandidateView[] = partlyUnlocked.map((candidate, index) =>
  index === 0
    ? {
        ...candidate,
        reason: {
          isLocked: false,
          value:
            '두 사람 모두 물의 기운이 약해 서로를 채워 주는 사이예요. 대화가 끊이지 않을 거예요.',
        },
      }
    : candidate,
);

export const cardsBase: DatingCardsView = {
  balance: 12,
  candidates: lockedCandidates,
  reroll: { kind: 'paid', cost: 3, canAfford: true },
};

// 해금·운명의 실 모달 미리보기(dating-unlock·dating-thread)도 이 화면 위에 띄운다.
export function Cards({
  view = cardsBase,
  face,
  isRerollOpen = false,
}: {
  view?: DatingCardsView;
  face?: 'front' | 'back';
  isRerollOpen?: boolean;
}) {
  return (
    <DatingCards
      initialCardFace={face}
      initialRerollOpen={isRerollOpen}
      onOpenRequests={noop}
      onOpenUnlock={noop}
      onReroll={noop}
      onSendThread={noop}
      view={view}
    />
  );
}

// SCR-17 오늘의 인연 Top 3 — 10/T4 퍼블리싱. 잔액·추천·리롤 연결은 10/T2·T3, 해금·운명의 실 모달은 SCR-18·19 미리보기.
export const preview: PreviewScreen = {
  title: 'SCR-17 오늘의 인연 Top 3',
  order: 12,
  states: {
    '카드 앞면': () => <Cards />,
    '카드 뒷면(잠김)': () => <Cards face="back" />,
    '카드 뒷면(이름만 해금)': () => (
      <Cards face="back" view={{ ...cardsBase, candidates: nameOnly }} />
    ),
    '카드 뒷면(일부 해금)': () => (
      <Cards face="back" view={{ ...cardsBase, candidates: partlyUnlocked }} />
    ),
    '카드 앞면(전체 해금)': () => <Cards view={{ ...cardsBase, candidates: allUnlocked }} />,
    '카드 뒷면(전체 해금)': () => (
      <Cards face="back" view={{ ...cardsBase, candidates: allUnlocked }} />
    ),
    '인연 없음': () => <Cards view={{ ...cardsBase, candidates: [] }} />,
    '리롤 무료 o': () => <Cards isRerollOpen view={{ ...cardsBase, reroll: { kind: 'free' } }} />,
    '리롤 무료 x': () => <Cards isRerollOpen />,
    '리롤 잔액 부족': () => (
      <Cards
        isRerollOpen
        view={{ ...cardsBase, balance: 2, reroll: { kind: 'paid', cost: 3, canAfford: false } }}
      />
    ),
  },
};
