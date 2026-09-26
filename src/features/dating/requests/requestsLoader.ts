import { getRecommendations, type DatingCandidate } from '@/api/dating';
import { listDatingRequests, type DatingRequest } from '@/api/matchRequests';

import { relationLabelByRank } from '../recommendation/cardsView';
import { toCandidateView } from '../recommendation/recommendationsLoader';
import type {
  ContactView,
  ReceivedRequestView,
  RequestInboxView,
  RequestProfileView,
  SentRequestView,
} from './requestsView';

// 백엔드 요청 목록에는 상대 프로필이 없다(WKS-BE api-spec §11 — `candidateId`·상태·연락처뿐). 프로필을 모르는
// 상대는 모두 가린 채 그린다 — 받은 신청은 '해금 없이 전부 공개'(FR-30)가 목표지만 값이 오지 않는다(백엔드 문의 중).
function hiddenProfile(id: string, relationLabel: string): RequestProfileView {
  return {
    id,
    rank: null,
    score: null,
    relationLabel,
    mbti: '',
    bio: '',
    photo: { isLocked: true, thumbnailUrl: null, cost: 0 },
    name: { isLocked: true, cost: 0 },
    department: { isLocked: true, cost: 0 },
    reason: { isLocked: true, cost: 0 },
  };
}

function toContact(request: DatingRequest): ContactView | null {
  return request.contactMethod !== null && request.contactValue !== null
    ? { method: request.contactMethod, value: request.contactValue }
    : null;
}

// 보낸 신청 — 지금 Top 3 카드에 있는 상대면 그 카드의 값(보내기 전에 연 항목만 열림)을 쓴다. 거절은 '매칭 실패'다.
export function toSentRequestView(
  request: DatingRequest,
  candidate: DatingCandidate | undefined,
): SentRequestView {
  const status =
    request.status === 'ACCEPTED'
      ? 'MATCHED'
      : request.status === 'REJECTED'
        ? 'FAILED'
        : 'PENDING';
  const base: RequestProfileView =
    candidate === undefined
      ? hiddenProfile(request.requestId, '보낸 인연')
      : {
          ...toCandidateView(candidate),
          id: request.requestId,
          relationLabel: relationLabelByRank[candidate.rank as 1 | 2 | 3],
        };
  return { ...base, status, contact: toContact(request) };
}

export function toReceivedRequestView(request: DatingRequest): ReceivedRequestView {
  const status =
    request.status === 'ACCEPTED'
      ? 'MATCHED'
      : request.status === 'REJECTED'
        ? 'DECLINED'
        : 'PENDING';
  return {
    ...hiddenProfile(request.requestId, '나를 찾아온 인연'),
    status,
    contact: toContact(request),
  };
}

// `/dating/requests` loader — 보낸·받은 신청과, 보낸 상대의 카드를 채우려고 지금 추천을 함께 읽는다.
// requireDatingProfile 이 로그인·프로필을 먼저 확인한다.
export async function datingRequestsLoader(): Promise<RequestInboxView> {
  const [sent, received, recommendations] = await Promise.all([
    listDatingRequests('sent'),
    listDatingRequests('received'),
    getRecommendations(),
  ]);
  if (!sent.ok || !received.ok) {
    console.error(
      'GET /dating/requests 실패',
      sent.ok ? null : sent.error,
      received.ok ? null : received.error,
    );
    throw new Response('요청함을 불러오지 못했다', { status: 503 });
  }
  // 추천을 못 읽어도 요청함은 연다 — 보낸 상대가 가려져 보일 뿐이다.
  const candidates = recommendations.ok ? recommendations.data.candidates : [];
  return {
    sent: sent.data.map((request) =>
      toSentRequestView(
        request,
        candidates.find((candidate) => candidate.candidateId === request.candidateId),
      ),
    ),
    received: received.data.map(toReceivedRequestView),
  };
}
