import { getRecommendations, type DatingCandidate, type DatingLockableField } from '@/api/dating';
import type { ApiOutcome } from '@/api/client';
import { listDatingRequests, type DatingRequestListItem } from '@/api/matchRequests';
import { ensureDailyCheckIn, getWallet } from '@/api/wallet';

import { REASON_PENDING } from '../requests/messages';

import {
  type CandidatePhoto,
  type CandidateRank,
  type DatingCardsView,
  type LockableField,
  type MatchCandidateView,
  type RerollView,
} from './cardsView';

// 리롤 비용(FR-27)은 서버가 판정한다 — 추천 응답의 `rerollCost` 가 0 이면 오늘 무료가 남은 것이고,
// 아니면 그 값만큼 든다(WKS-BE §10.4, 하루 1회 무료 뒤 20실). 화면은 이 값을 옮기기만 한다.

export type DatingCardsState =
  | { kind: 'ready'; view: DatingCardsView }
  // 학교 메일 인증 전에는 후보를 받을 수 없다(403 DATING_NOT_VERIFIED).
  | { kind: 'not-verified' };

// 열렸는데 값이 아직 없는 항목(궁합 까닭 생성 실패 등)은 비용 0 의 잠금으로 둔다 — 다시 열면 백엔드가 차감 없이
// 값만 다시 만든다(WKS-BE §10.4 · §10.5). 빈 값을 열린 것처럼 보이지 않는다.
export function toLockable<T extends string>(field: DatingLockableField): LockableField<T> {
  if (field.locked) return { isLocked: true, cost: field.cost };
  if (field.value === null) return { isLocked: true, cost: 0 };
  // 이름·학과·까닭 문장은 백엔드가 준 문자열 그대로다 — T 는 부르는 쪽의 표시 타입이다.
  return { isLocked: false, value: field.value as T };
}

// 잠긴 사진은 흐린 썸네일만 받는다 — 원본 주소는 해금 뒤에만 온다(WKS-BE §10.4 `blurredPhotoUrl`).
export function toPhoto(
  field: DatingLockableField,
  blurredPhotoUrl: string | null,
): CandidatePhoto {
  if (field.locked) return { isLocked: true, thumbnailUrl: blurredPhotoUrl, cost: field.cost };
  if (field.value === null) return { isLocked: true, thumbnailUrl: blurredPhotoUrl, cost: 0 };
  return { isLocked: false, url: field.value };
}

export function toCandidateView(candidate: DatingCandidate): MatchCandidateView {
  return {
    id: candidate.candidateId,
    rank: candidate.rank as CandidateRank,
    score: candidate.score,
    mbti: candidate.mbti,
    // 나이 칸(Figma 448:2786) — 서버 문구 그대로. 없으면 칸을 숨긴다.
    birthYear: candidate.age ?? null,
    bio: candidate.bio,
    photo: toPhoto(candidate.fields.photo, candidate.blurredPhotoUrl ?? null),
    name: toLockable(candidate.fields.name),
    department: toLockable(candidate.fields.department),
    reason: toLockable(candidate.fields.reason),
  };
}

export function toRerollView(rerollCost: number, balance: number): RerollView {
  if (rerollCost === 0) return { kind: 'free' };
  return { kind: 'paid', cost: rerollCost, canAfford: balance >= rerollCost };
}

// 축제 사이트 제휴 코드 — 배너 링크 `?ref=FESTIVAL`(WKS-BE §12).
const FESTIVAL_PARTNER_CODE = 'FESTIVAL';

// `/dating/cards` loader — 잔액과 후보를 함께 읽는다. 잔액의 단일 출처는 `GET /wallet`(원장)이고
// 화면은 계산하지 않는다(FR-31). `/me` 의 threadBalance 는 진입 게이트용 요약이라 여기서 쓰지 않는다.
// requireDatingProfile 이 먼저 로그인·프로필을 확인하므로 여기서는 인증을 다시 판단하지 않는다.
export async function datingCardsLoader(): Promise<DatingCardsState> {
  const [wallet, recommendations, sent, received] = await Promise.all([
    // 접속 출석이 끝난 뒤 읽어야 잔액과 '지급 완료'가 맞는다.
    ensureDailyCheckIn().then(getWallet),
    getRecommendations(),
    listDatingRequests('sent'),
    listDatingRequests('received'),
  ]);

  if (!recommendations.ok) {
    if (
      recommendations.error.kind === 'api' &&
      recommendations.error.code === 'DATING_NOT_VERIFIED'
    ) {
      return { kind: 'not-verified' };
    }
    console.error('GET /dating/recommendations 실패', recommendations.error);
    throw new Response('추천을 불러오지 못했다', { status: 503 });
  }

  // 잔액을 못 읽어도 카드는 보인다 — 0 으로 두면 소모 동작이 막히고 안내가 뜬다(FR-31).
  const balance = wallet.ok ? wallet.data.balance : 0;
  if (!wallet.ok) console.error('GET /wallet 실패', wallet.error);
  // 보낸 신청을 못 읽으면 모두 안 보낸 것으로 둔다 — 다시 보내면 백엔드가 409 로 막는다.
  // 취소한 신청은 보내지 않은 것으로 본다 — 카드에 있는 상대면 다시 보낼 수 있다(WKS-BE §11.2).
  if (!sent.ok) console.error('GET /dating/requests?box=sent 실패', sent.error);
  const sentIds = activeCounterpartIds(sent);
  // 받은 신청도 같은 규칙이다 — 취소되지 않은 요청이 있으면 백엔드가 방향과 무관하게 다시 보내기를 막는다(WKS-BE §11.2).
  // 못 읽으면 받은 것이 없는 것으로 두고, 보내면 409 로 막힌다.
  if (!received.ok) console.error('GET /dating/requests?box=received 실패', received.error);
  const receivedByCandidate = activeCounterparts(received);

  return {
    kind: 'ready',
    view: {
      balance,
      checkedInToday: wallet.ok && !wallet.data.canCheckInToday,
      festivalRewarded: wallet.ok && wallet.data.partnerRewards.includes(FESTIVAL_PARTNER_CODE),
      candidates: recommendations.data.candidates.map((candidate) => {
        const fromReceived = receivedByCandidate.get(candidate.candidateId);
        return {
          ...toCandidateView(candidate),
          // 상대가 먼저 실을 보냈으면 그 요청 행의 열린 프로필로 덮는다 — 받은 신청의 상대 정보는 해금 없이
          // 보이므로(FR-30), 추천 카드에서만 잠긴 채 남아 열 수도 없는 상태를 두지 않는다(11/T10).
          ...(fromReceived === undefined ? {} : openedByReceivedRequest(fromReceived)),
          isThreadSent: sentIds.has(candidate.candidateId),
          isThreadReceived: fromReceived !== undefined,
        };
      }),
      reroll: toRerollView(recommendations.data.rerollCost, balance),
    },
  };
}

// 받은 신청이 열어 준 프로필 — 사진·이름·학과는 실 없이 열려 오고, 궁합 까닭은 받은 사람 기준 문장이 따로 온다
// (WKS-BE §11.1). 아직 만들어지지 않았으면 잠긴 것처럼 보이지 않게 만드는 중임을 알린다(11/T9 과 같은 규칙).
function openedByReceivedRequest(
  request: DatingRequestListItem,
): Pick<MatchCandidateView, 'photo' | 'name' | 'department' | 'reason'> {
  const { counterpart } = request;
  const reason = counterpart.fields.reason;
  return {
    photo: toPhoto(counterpart.fields.photo, counterpart.blurredPhotoUrl ?? null),
    name: toLockable(counterpart.fields.name),
    department: toLockable(counterpart.fields.department),
    reason:
      reason === undefined
        ? { isLocked: true, cost: 0 }
        : !reason.locked && reason.value === null
          ? { isLocked: false, value: REASON_PENDING }
          : toLockable(reason),
  };
}

// 취소되지 않은 요청 — `candidateId` 는 조회한 사람 기준 상대라 추천 후보 id 와 같다.
function activeCounterparts(
  outcome: ApiOutcome<DatingRequestListItem[]>,
): Map<string, DatingRequestListItem> {
  if (!outcome.ok) return new Map();
  return new Map(
    outcome.data
      .filter((request) => request.status !== 'CANCELLED')
      .map((request) => [request.candidateId, request]),
  );
}

// 취소되지 않은 요청의 상대 프로필 id — `candidateId` 는 조회한 사람 기준 상대라 추천 후보 id 와 같다.
function activeCounterpartIds(outcome: ApiOutcome<DatingRequestListItem[]>): Set<string> {
  if (!outcome.ok) return new Set();
  return new Set(
    outcome.data
      .filter((request) => request.status !== 'CANCELLED')
      .map((request) => request.candidateId),
  );
}
