import type { CandidatePhoto, LockableField } from '../recommendation/cardsView';

// 요청함(SCR-20) 뷰 모델 — 응답 → 뷰 모델 변환은 requestsLoader 가 한다.
// 상대 한 사람. 보낸 신청은 보내기 전에 연 항목만 열려 있고, 받은 신청은 해금 없이 전부 열려 온다(FR-30).
export type RequestProfileView = {
  id: string;
  // 추천 당시 순위 — 받은 신청은 null.
  rank: number | null;
  // 궁합 점수 — 보낸·받은 신청 모두 보인다(Figma 109:2251). 퍼블리싱 미리보기는 null 로 숨길 수 있다.
  score: number | null;
  relationLabel: string;
  mbti: string;
  bio: string;
  photo: CandidatePhoto;
  name: LockableField<string>;
  department: LockableField<string>;
  reason: LockableField<string>;
  // 매칭이 성립했을 때만 — 상대가 등록한 연락 수단 하나(FR-30 · NFR-4).
  contact?: ContactView | null;
};

export type ContactView = { method: 'PHONE' | 'INSTAGRAM'; value: string };

// 보낸 신청 — 기다리는 중이거나, 성립했거나, 거절돼 실패했다(FR-30).
export type SentRequestView = RequestProfileView & { status: 'PENDING' | 'MATCHED' | 'FAILED' };

// 받은 신청 — 응답 전이거나, 수락해 성립했거나, 거절했다. 퍼블리싱 미리보기는 상태 없이(응답 전) 넘긴다.
export type ReceivedRequestView = RequestProfileView & {
  status?: 'PENDING' | 'MATCHED' | 'DECLINED';
};

export type RequestInboxView = {
  sent: readonly SentRequestView[];
  received: readonly ReceivedRequestView[];
};

export type RequestTab = 'sent' | 'received';
