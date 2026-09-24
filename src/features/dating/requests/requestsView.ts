import type { CandidatePhoto, LockableField } from '../recommendation/cardsView';

// 요청함(SCR-20) 뷰 모델 — 응답 → 뷰 모델 변환은 연동 Task(11/T2)가 한다.
// 상대 한 사람. 보낸 신청은 보내기 전에 연 항목만 열려 있고, 받은 신청은 해금 없이 전부 열려 온다(FR-30).
export type RequestProfileView = {
  id: string;
  // 추천 당시 순위 — 받은 신청은 null.
  rank: number | null;
  // 궁합 점수 — 받은 신청에 보일지는 미정(Q17)이라 그동안 null 로 둔다.
  score: number | null;
  relationLabel: string;
  mbti: string;
  bio: string;
  photo: CandidatePhoto;
  name: LockableField<string>;
  department: LockableField<string>;
  reason: LockableField<string>;
};

// 보낸 신청 — 기다리는 중이거나, 거절됐거나 상대가 다른 사람과 맺어져 실패했다(FR-30).
export type SentRequestView = RequestProfileView & { status: 'PENDING' | 'FAILED' };

export type RequestInboxView = {
  sent: readonly SentRequestView[];
  received: readonly RequestProfileView[];
};

export type RequestTab = 'sent' | 'received';
