import { request, type ApiFailure, type ApiOutcome } from './client';
import {
  datingRequestListSchema,
  datingRequestSchema,
  type DatingRequest,
  type DatingRequestBox,
  type DatingRequestListItem,
} from './schema/matchRequests';

export type {
  DatingRequest,
  DatingRequestBox,
  DatingRequestListItem,
  DatingRequestStatus,
} from './schema/matchRequests';

// 운명의 실 보내기·요청함(FR-29 · FR-30) — `/dating/requests`, 인증 필요(WKS-BE api-spec §11). 요청은 무료다.
// `VITE_API_MOCK=true` 면 이 파일 안의 목 요청함을 쓴다(받은 신청 하나가 미리 와 있다).
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const MOCK_DELAY_MS = 400;

// 목 요청함 — 새로고침하면 처음으로 돌아간다(목 추천과 같다).
let mockSent: DatingRequestListItem[] = [];
let mockReceived: DatingRequestListItem[] | null = null;

// 보낸 상대는 카드에서 연 항목을 목이 모르니 모두 잠근 채로 둔다.
const mockSentCounterpart: DatingRequestListItem['counterpart'] = {
  score: 88,
  mbti: 'ENFP',
  bio: '축제에서 만나요!',
  blurredPhotoUrl: null,
  fields: {
    photo: { locked: true, cost: 10 },
    name: { locked: true, cost: 7 },
    department: { locked: true, cost: 5 },
  },
};

function seedReceived(): DatingRequestListItem[] {
  return [
    {
      requestId: crypto.randomUUID(),
      candidateId: crypto.randomUUID(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      respondedAt: null,
      contactMethod: null,
      contactValue: null,
      counterpart: {
        score: 92,
        mbti: 'ISTJ',
        bio: '같이 부스 구경해요.',
        blurredPhotoUrl: null,
        fields: {
          photo: { locked: false, value: null },
          name: { locked: false, value: '김운명' },
          department: { locked: false, value: '국어국문학과' },
        },
      },
    },
  ];
}

// 목록 행에서 응답 모양만 떼어 낸다 — 보내기·수락·거절·취소 응답에는 counterpart 가 없다(zod 가 떨어낸다).
function toRequest(item: DatingRequestListItem): DatingRequest {
  return datingRequestSchema.parse(item);
}

// 테스트 전용.
export function resetMockRequests(): void {
  mockSent = [];
  mockReceived = null;
}

function apiError(code: 'DATING_REQUEST_CONFLICT' | 'DATING_REQUEST_NOT_FOUND'): {
  ok: false;
  error: ApiFailure;
} {
  const message =
    code === 'DATING_REQUEST_CONFLICT' ? '이미 처리된 요청이에요.' : '요청을 찾을 수 없어요.';
  return { ok: false, error: { kind: 'api', code, message } };
}

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

// POST /dating/requests — 지금 내 추천 카드의 상대에게 보낸다. 취소되지 않은 요청이 있는 두 사람(방향 무관)·카드에
// 없는 상대는 409 DATING_REQUEST_CONFLICT, 내 학교 메일 인증 전이면 403 이다. 취소한 상대에게는 다시 보낼 수 있다.
export async function sendDatingRequest(candidateId: string): Promise<ApiOutcome<DatingRequest>> {
  if (isMockEnabled()) {
    await wait();
    if (mockSent.some((each) => each.candidateId === candidateId && each.status !== 'CANCELLED')) {
      return apiError('DATING_REQUEST_CONFLICT');
    }
    const sent: DatingRequestListItem = {
      requestId: crypto.randomUUID(),
      candidateId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      respondedAt: null,
      contactMethod: null,
      contactValue: null,
      counterpart: mockSentCounterpart,
    };
    mockSent = [sent, ...mockSent];
    return { ok: true, data: toRequest(sent) };
  }
  return request(
    { method: 'POST', path: '/dating/requests', body: { candidateId } },
    datingRequestSchema,
  );
}

// GET /dating/requests?box= — 최신 요청부터, 행마다 상대 프로필(counterpart)이 붙는다. CANCELLED 는 보낸 목록에만
// 남는다. 내 프로필이 없으면 404 DATING_PROFILE_NOT_FOUND.
export async function listDatingRequests(
  box: DatingRequestBox,
): Promise<ApiOutcome<DatingRequestListItem[]>> {
  if (isMockEnabled()) {
    mockReceived ??= seedReceived();
    return { ok: true, data: box === 'sent' ? mockSent : mockReceived };
  }
  return request({ method: 'GET', path: `/dating/requests?box=${box}` }, datingRequestListSchema);
}

async function mockRespond(
  requestId: string,
  status: 'ACCEPTED' | 'REJECTED',
): Promise<ApiOutcome<DatingRequest>> {
  await wait();
  mockReceived ??= seedReceived();
  const target = mockReceived.find((each) => each.requestId === requestId);
  if (target === undefined) return apiError('DATING_REQUEST_NOT_FOUND');
  if (target.status !== 'PENDING') return apiError('DATING_REQUEST_CONFLICT');
  const accepted = status === 'ACCEPTED';
  const responded: DatingRequestListItem = {
    ...target,
    status,
    respondedAt: new Date().toISOString(),
    contactMethod: accepted ? 'INSTAGRAM' : null,
    contactValue: accepted ? 'unggwesa_fate' : null,
  };
  mockReceived = mockReceived.map((each) => (each.requestId === requestId ? responded : each));
  return { ok: true, data: toRequest(responded) };
}

// POST /dating/requests/{id}/accept — 받은 사람만, PENDING 일 때만. 응답에 상대(보낸 사람) 연락처가 온다.
export async function acceptDatingRequest(requestId: string): Promise<ApiOutcome<DatingRequest>> {
  if (isMockEnabled()) return mockRespond(requestId, 'ACCEPTED');
  return request(
    { method: 'POST', path: `/dating/requests/${encodeURIComponent(requestId)}/accept` },
    datingRequestSchema,
  );
}

// POST /dating/requests/{id}/reject — 받은 사람만, PENDING 일 때만. 연락처는 공개되지 않는다.
export async function rejectDatingRequest(requestId: string): Promise<ApiOutcome<DatingRequest>> {
  if (isMockEnabled()) return mockRespond(requestId, 'REJECTED');
  return request(
    { method: 'POST', path: `/dating/requests/${encodeURIComponent(requestId)}/reject` },
    datingRequestSchema,
  );
}

// POST /dating/requests/{id}/cancel — 보낸 사람만, PENDING 일 때만. 이미 수락·거절·취소됐으면 409 다.
// 취소된 요청은 상대의 받은 목록에서 빠지고, 상대가 지금 카드에 있으면 다시 보낼 수 있다(WKS-BE §11.2).
export async function cancelDatingRequest(requestId: string): Promise<ApiOutcome<DatingRequest>> {
  if (isMockEnabled()) {
    await wait();
    const target = mockSent.find((each) => each.requestId === requestId);
    if (target === undefined) return apiError('DATING_REQUEST_NOT_FOUND');
    if (target.status !== 'PENDING') return apiError('DATING_REQUEST_CONFLICT');
    const cancelled: DatingRequestListItem = {
      ...target,
      status: 'CANCELLED',
      respondedAt: new Date().toISOString(),
    };
    mockSent = mockSent.map((each) => (each.requestId === requestId ? cancelled : each));
    return { ok: true, data: toRequest(cancelled) };
  }
  return request(
    { method: 'POST', path: `/dating/requests/${encodeURIComponent(requestId)}/cancel` },
    datingRequestSchema,
  );
}
