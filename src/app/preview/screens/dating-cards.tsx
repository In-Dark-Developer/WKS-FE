import type { PreviewScreen } from '@/app/preview/previewScreen';
import { DatingCards, type DatingCardsView, type MatchCandidateView } from '@/features/dating';
import photoRabbit from '@/ui/assets/zodiac/zodiac-rabbit.webp';

const noop = () => {};

// 추천 응답(WKS-BE §10.4)에 있는 값만 쓴다 — 잠긴 사진 썸네일은 아직 오지 않아 null 이다.
// 해금된 사진은 사람 사진 대신 십이간지 그림을 쓴다.
const lockedCandidates: readonly MatchCandidateView[] = [
  {
    id: 'c1',
    rank: 1,
    score: 98,
    mbti: 'ENTP',
    birthYear: '03년생',
    bio: '안녕하세요! 처음에는 조금 낯을 가리지만 친해지면 장난도 많고 말도 꽤 많은 편이에요. 평소에는 영화나 전시 보러 가는 걸 좋아하고, 새로운 카페나 맛집 찾아다니는 것도 좋아합니다. 같이 축제 공연 보러 갈 사람을 찾아요.',
    photo: { isLocked: true, thumbnailUrl: null, cost: 10 },
    name: { isLocked: true, cost: 7 },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  },
  {
    id: 'c2',
    rank: 2,
    score: 87,
    mbti: 'INFJ',
    birthYear: '02년생',
    bio: '조용한 카페에서 책 읽는 걸 좋아해요.',
    photo: { isLocked: true, thumbnailUrl: null, cost: 10 },
    name: { isLocked: true, cost: 7 },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  },
  {
    id: 'c3',
    rank: 3,
    score: 68,
    mbti: 'ISFP',
    birthYear: '04년생',
    bio: '운동하고 맛집 다니는 걸 좋아합니다.',
    photo: { isLocked: true, thumbnailUrl: null, cost: 10 },
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

// 궁합 이유만 연 카드 — 잠긴 이름·학과 알약이 위아래로 붙는다.
const reasonOnly: readonly MatchCandidateView[] = lockedCandidates.map((candidate, index) =>
  index === 0
    ? {
        ...candidate,
        reason: {
          isLocked: false,
          value:
            '두 분은 마음을 편안하게 채워주는 따뜻한 인연이에요. 서로에게 든든한 힘이 되어줘요.',
        },
      }
    : candidate,
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

// 마지막 날 50% 할인(2026-10-01 10시~자정) — 서버가 할인된 비용을 주면 정가에 취소선이 붙는다. 이름만 연 카드로
// 사진·학과·궁합 이유 알약을 함께 보인다.
const nameOnlyOnSale: readonly MatchCandidateView[] = nameOnly.map((candidate) => ({
  ...candidate,
  photo: candidate.photo.isLocked ? { ...candidate.photo, cost: 5 } : candidate.photo,
  department: candidate.department.isLocked ? { isLocked: true, cost: 2 } : candidate.department,
  reason: candidate.reason.isLocked ? { isLocked: true, cost: 1 } : candidate.reason,
}));

// 리롤 비용 20 은 Figma 112:3675('실 20개로 지금 변경하기')와 백엔드 REROLL_COST 와 같다(2026-09-29).
// 실제 화면은 서버가 준 `rerollCost` 를 그대로 쓴다 — 이 값은 미리보기용 고정값이다.
export const REROLL_COST = 20;

export const cardsBase: DatingCardsView = {
  balance: 24,
  checkedInToday: true,
  festivalRewarded: false,
  candidates: lockedCandidates,
  reroll: { kind: 'paid', cost: REROLL_COST, canAfford: true },
};

// 해금·운명의 실 모달 미리보기(dating-unlock·dating-thread)도 이 화면 위에 띄운다.
export function Cards({
  view = cardsBase,
  face,
  isRerollOpen = false,
  isThreadGuideOpen = false,
}: {
  view?: DatingCardsView;
  face?: 'front' | 'back';
  isRerollOpen?: boolean;
  isThreadGuideOpen?: boolean;
}) {
  return (
    <DatingCards
      initialCardFace={face}
      initialRerollOpen={isRerollOpen}
      initialThreadGuideOpen={isThreadGuideOpen}
      onOpenReceived={noop}
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
    '카드 뒷면(궁합 이유만 해금)': () => (
      <Cards face="back" view={{ ...cardsBase, candidates: reasonOnly }} />
    ),
    '카드 뒷면(일부 해금)': () => (
      <Cards face="back" view={{ ...cardsBase, candidates: partlyUnlocked }} />
    ),
    '카드 앞면(전체 해금)': () => <Cards view={{ ...cardsBase, candidates: allUnlocked }} />,
    '카드 뒷면(전체 해금)': () => (
      <Cards face="back" view={{ ...cardsBase, candidates: allUnlocked }} />
    ),
    '인연 없음': () => <Cards view={{ ...cardsBase, candidates: [] }} />,
    // 자기소개 최대 170자(BIO_MAX)를 띄어쓰기 없이 채운 카드 — 카드 폭 안에서 줄을 바꿔야 한다.
    '자기소개 170자(띄어쓰기 없음)': () => (
      <Cards
        view={{
          ...cardsBase,
          candidates: lockedCandidates.map((candidate, index) =>
            index === 0 ? { ...candidate, bio: '안녕하세요'.repeat(34) } : candidate,
          ),
        }}
      />
    ),
    // 상대가 먼저 보낸 카드는 잠긴 채로 두지 않는다 — 받은 신청의 상대 정보는 해금 없이 보인다(FR-30, 11/T10).
    '상대가 먼저 실을 보냄': () => (
      <Cards
        view={{
          ...cardsBase,
          candidates: lockedCandidates.map((candidate, index) =>
            index === 0
              ? {
                  ...candidate,
                  isThreadReceived: true,
                  photo: { isLocked: false, url: photoRabbit },
                  name: { isLocked: false, value: '김채원' },
                  department: { isLocked: false, value: '바이오헬스의료기기규제과학과' },
                  reason: {
                    isLocked: false,
                    value: '두 사람 모두 물의 기운이 약해 서로를 채워 주는 사이예요.',
                  },
                }
              : candidate,
          ),
        }}
      />
    ),
    '리롤 무료 o': () => <Cards isRerollOpen view={{ ...cardsBase, reroll: { kind: 'free' } }} />,
    '리롤 무료 x': () => <Cards isRerollOpen />,
    '리롤 잔액 부족': () => (
      <Cards
        isRerollOpen
        view={{
          ...cardsBase,
          balance: 2,
          reroll: { kind: 'paid', cost: REROLL_COST, canAfford: false },
        }}
      />
    ),
    '마지막 날 할인(뒷면)': () => (
      <Cards face="back" view={{ ...cardsBase, candidates: nameOnlyOnSale }} />
    ),
    '마지막 날 할인(리롤)': () => (
      <Cards
        isRerollOpen
        view={{ ...cardsBase, reroll: { kind: 'paid', cost: 10, canAfford: true } }}
      />
    ),
    '재화 안내(출석 받음)': () => <Cards isThreadGuideOpen />,
    '재화 안내(출석 전)': () => (
      <Cards isThreadGuideOpen view={{ ...cardsBase, checkedInToday: false }} />
    ),
  },
};
