// 오늘의 인연 Top 3 화면 뷰 모델 — 응답 → 뷰 모델 변환은 연동 Task(10/T2·T3)가 한다.
// 잠긴 항목은 값 대신 잠금 상태와 비용만 갖는다 — 값이 이 모양에 들어올 자리가 없다(FR-26 · FR-28 · NFR-4).
export type LockableField<T> = { isLocked: true; cost: number } | { isLocked: false; value: T };

// 잠긴 사진은 썸네일(흐리게 보일 것)만 받는다. 원본 주소는 해금된 뒤에만 온다.
// 썸네일은 추천 응답의 `blurredPhotoUrl` 이다(WKS-BE api-spec §10.4). 사진이 없는 후보는 null 이다.
export type CandidatePhoto =
  { isLocked: true; thumbnailUrl: string | null; cost: number } | { isLocked: false; url: string };

export type CandidateRank = 1 | 2 | 3;

// 관계 유형 문구는 순위에 고정한다 — 백엔드 추천 응답에 등급(tier)이 없다(WKS-BE api-spec §10.4).
export const relationLabelByRank: Record<CandidateRank, string> = {
  1: '천생연분',
  2: '찰떡궁합',
  3: '귀한인연',
};

export type MatchCandidateView = {
  id: string;
  // 궁합 점수 순위. 정렬은 백엔드가 한다.
  rank: CandidateRank;
  score: number;
  // 프로필 등록에서 필수라 항상 온다(WKS-BE DatingProfileRequest).
  mbti: string;
  // 나이 — '02년생'. 생년월일이 오지 않은 카드는 칸을 숨긴다.
  birthYear?: string | null;
  bio: string;
  photo: CandidatePhoto;
  name: LockableField<string>;
  department: LockableField<string>;
  reason: LockableField<string>;
  // 이미 운명의 실을 보낸 상대 — 더 열 수도, 다시 보낼 수도 없다(FR-29). 요청함 `box=sent` 에서 온다.
  isThreadSent?: boolean;
  // 상대가 먼저 운명의 실을 보낸 사람 — 백엔드가 방향과 무관하게 두 번째 요청을 막으므로(409) 보내기 대신 받은
  // 신청으로 안내한다. 받은 신청은 이름·사진·학과가 실 없이 열려 오므로 해금도 거둔다. 요청함 `box=received` 에서 온다.
  isThreadReceived?: boolean;
};

// 다른 인연 만나보기 — 오늘 무료가 남았는지, 아니면 비용과 잔액으로 가능한지. 판단은 백엔드 값을 옮긴 것이다(FR-27 · FR-31).
export type RerollView = { kind: 'free' } | { kind: 'paid'; cost: number; canAfford: boolean };

export type DatingCardsView = {
  balance: number;
  // 오늘 출석 지급을 받았는지(`GET /wallet` canCheckInToday 의 반대) — 재화 안내 모달이 '지급 완료'로 보인다.
  checkedInToday: boolean;
  // 축제 사이트 유입 보상(FESTIVAL)을 받았는지(`GET /wallet` partnerRewards) — 재화 안내 모달이 '지급 완료'로 보인다.
  festivalRewarded: boolean;
  candidates: readonly MatchCandidateView[];
  reroll: RerollView;
};
