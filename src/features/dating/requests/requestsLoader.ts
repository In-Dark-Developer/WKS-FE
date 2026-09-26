import { getRecommendations, type DatingCandidate } from '@/api/dating';
import { listDatingRequests, type DatingRequestListItem } from '@/api/matchRequests';

import { relationLabelByRank, type CandidateRank } from '../recommendation/cardsView';
import { toLockable, toPhoto } from '../recommendation/recommendationsLoader';
import type {
  ContactView,
  ReceivedRequestView,
  RequestInboxView,
  RequestProfileView,
  SentRequestView,
} from './requestsView';

type ListedRequest = DatingRequestListItem & { status: 'PENDING' | 'ACCEPTED' | 'REJECTED' };

// 상대 프로필은 목록 행의 `counterpart` 에서 온다(WKS-BE §11.1). 받은 신청은 사진·이름·학과가 실 없이 열려 오고,
// 보낸 신청은 카드에서 연 만큼만 열려 온다. 궁합 까닭은 목록에 없어 지금 카드에 있는 상대만 그 카드 값을 쓴다.
function toProfile(
  request: ListedRequest,
  relationLabel: string,
  candidate: DatingCandidate | undefined,
): RequestProfileView {
  const { counterpart } = request;
  const rank = candidate === undefined ? null : (candidate.rank as CandidateRank);
  return {
    id: request.requestId,
    rank,
    score: counterpart.score,
    relationLabel: rank === null ? relationLabel : relationLabelByRank[rank],
    mbti: counterpart.mbti,
    bio: counterpart.bio,
    photo: toPhoto(counterpart.fields.photo, counterpart.blurredPhotoUrl ?? null),
    name: toLockable(counterpart.fields.name),
    department: toLockable(counterpart.fields.department),
    reason:
      candidate === undefined ? { isLocked: true, cost: 0 } : toLockable(candidate.fields.reason),
  };
}

function toContact(request: ListedRequest): ContactView | null {
  return request.contactMethod !== null && request.contactValue !== null
    ? { method: request.contactMethod, value: request.contactValue }
    : null;
}

// 취소한 신청은 요청함에 보이지 않는다 — 백엔드는 보낸 목록에 이력으로 남기지만 화면은 뺀다.
function isListed(request: DatingRequestListItem): request is ListedRequest {
  return request.status !== 'CANCELLED';
}

// 보낸 신청 — 거절은 '매칭 실패'다. 지금 Top 3 카드에 있는 상대면 순위와 궁합 까닭을 그 카드에서 가져온다.
export function toSentRequestView(
  request: ListedRequest,
  candidate: DatingCandidate | undefined,
): SentRequestView {
  const status =
    request.status === 'ACCEPTED'
      ? 'MATCHED'
      : request.status === 'REJECTED'
        ? 'FAILED'
        : 'PENDING';
  return { ...toProfile(request, '보낸 인연', candidate), status, contact: toContact(request) };
}

// 받은 신청 — 궁합 점수도 보인다(Figma 보관함/나에게보낸사람 109:2251 · 109:2498).
export function toReceivedRequestView(request: ListedRequest): ReceivedRequestView {
  const status =
    request.status === 'ACCEPTED'
      ? 'MATCHED'
      : request.status === 'REJECTED'
        ? 'DECLINED'
        : 'PENDING';
  return {
    ...toProfile(request, '나를 찾아온 인연', undefined),
    status,
    contact: toContact(request),
  };
}

// `/dating/requests` loader — 보낸·받은 신청과, 보낸 상대의 순위·까닭을 채우려고 지금 추천을 함께 읽는다.
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
  // 추천을 못 읽어도 요청함은 연다 — 보낸 상대의 순위·까닭이 빠질 뿐이다.
  const candidates = recommendations.ok ? recommendations.data.candidates : [];
  return {
    sent: sent.data.filter(isListed).map((request) =>
      toSentRequestView(
        request,
        candidates.find((candidate) => candidate.candidateId === request.candidateId),
      ),
    ),
    received: received.data.filter(isListed).map(toReceivedRequestView),
  };
}
