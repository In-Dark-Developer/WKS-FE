import { getRecommendations, type DatingCandidate, type DatingLockableField } from '@/api/dating';
import { getWallet } from '@/api/wallet';

import {
  type CandidatePhoto,
  type CandidateRank,
  type DatingCardsView,
  type LockableField,
  type MatchCandidateView,
  type RerollView,
} from './cardsView';

// 리롤 비용(FR-27). 백엔드에 리롤 경로가 없어 무료 1회 여부도 응답으로 오지 않는다 —
// 지금은 '무료가 남아 있다'로 두고, 실제 판정(서버 자정 초기화)은 API 가 서면 그 값으로 바꾼다.
export const REROLL_COST = 3;

export type DatingCardsState =
  | { kind: 'ready'; view: DatingCardsView }
  // 학교 메일 인증 전에는 후보를 받을 수 없다(403 DATING_NOT_VERIFIED).
  | { kind: 'not-verified' };

// 열렸는데 값이 아직 없는 항목(궁합 까닭 생성 실패 등)은 비용 0 의 잠금으로 둔다 — 다시 열면 백엔드가 차감 없이
// 값만 다시 만든다(WKS-BE §10.4 · §10.5). 빈 값을 열린 것처럼 보이지 않는다.
function toLockable<T extends string>(field: DatingLockableField): LockableField<T> {
  if (field.locked) return { isLocked: true, cost: field.cost };
  if (field.value === null) return { isLocked: true, cost: 0 };
  // 이름·학과·까닭 문장은 백엔드가 준 문자열 그대로다 — T 는 부르는 쪽의 표시 타입이다.
  return { isLocked: false, value: field.value as T };
}

// 잠긴 사진은 흐린 썸네일만 받는다 — 원본 주소는 해금 뒤에만 온다(WKS-BE §10.4 `blurredPhotoUrl`).
function toPhoto(field: DatingLockableField, blurredPhotoUrl: string | null): CandidatePhoto {
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
    bio: candidate.bio,
    photo: toPhoto(candidate.fields.photo, candidate.blurredPhotoUrl ?? null),
    name: toLockable(candidate.fields.name),
    department: toLockable(candidate.fields.department),
    reason: toLockable(candidate.fields.reason),
  };
}

export function toRerollView(hasFreeReroll: boolean, balance: number): RerollView {
  if (hasFreeReroll) return { kind: 'free' };
  return { kind: 'paid', cost: REROLL_COST, canAfford: balance >= REROLL_COST };
}

// `/dating/cards` loader — 잔액과 후보를 함께 읽는다. 잔액의 단일 출처는 `GET /wallet`(원장)이고
// 화면은 계산하지 않는다(FR-31). `/me` 의 threadBalance 는 진입 게이트용 요약이라 여기서 쓰지 않는다.
// requireDatingProfile 이 먼저 로그인·프로필을 확인하므로 여기서는 인증을 다시 판단하지 않는다.
export async function datingCardsLoader(): Promise<DatingCardsState> {
  const [wallet, recommendations] = await Promise.all([getWallet(), getRecommendations()]);

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

  return {
    kind: 'ready',
    view: {
      balance,
      candidates: recommendations.data.candidates.map(toCandidateView),
      reroll: toRerollView(true, balance),
    },
  };
}
