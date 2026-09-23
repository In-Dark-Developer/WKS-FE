// 오늘의 인연 Top 3 화면 뷰 모델 — 응답 → 뷰 모델 변환은 연동 Task(10/T2·T3)가 한다.
// 잠긴 항목은 값 대신 잠금 상태와 비용만 갖는다 — 값이 이 모양에 들어올 자리가 없다(FR-26 · FR-28 · NFR-4).
export type LockableField<T> = { isLocked: true; cost: number } | { isLocked: false; value: T };

// 잠긴 사진은 썸네일(흐리게 보일 것)만 받는다. 원본 주소는 해금된 뒤에만 온다.
export type CandidatePhoto =
  { isLocked: true; thumbnailUrl: string; cost: number } | { isLocked: false; url: string };

export type MatchCandidateView = {
  id: string;
  // 1 ~ 3 — 궁합 점수 순위. 정렬은 백엔드가 한다.
  rank: number;
  score: number;
  // 관계 유형 이름(예: 천생연분) — 백엔드가 준 문구 그대로.
  relationLabel: string;
  mbti: string | null;
  bio: string;
  photo: CandidatePhoto;
  name: LockableField<string>;
  department: LockableField<string>;
  reason: LockableField<string>;
};

// 다른 인연 만나보기 — 오늘 무료가 남았는지, 아니면 비용과 잔액으로 가능한지. 판단은 백엔드 값을 옮긴 것이다(FR-27 · FR-31).
export type RerollView = { kind: 'free' } | { kind: 'paid'; cost: number; canAfford: boolean };

export type DatingCardsView = {
  balance: number;
  candidates: readonly MatchCandidateView[];
  reroll: RerollView;
};
