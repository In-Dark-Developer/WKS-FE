import { getMe, isUnauthenticated, type Me } from '@/api/me';

import type { DatingIntroView } from '../intro/DatingIntro';

// 소개팅 진입 분기(FR-24) — 로그인한 사용자가 어디서 시작하는지. 비로그인은 GET /me 가 401 로 알려
// 인트로(비로그인)에 남는다. 사주가 없으면 프로필 (1/2), 사주만 있으면 (2/2), 둘 다 있으면 Top 3.
export type DatingEntry = { kind: 'profile'; step: 1 | 2 } | { kind: 'cards' };

export const DATING_INTRO_PATH = '/dating';
export const DATING_PROFILE_PATH = '/dating/profile';
export const DATING_CARDS_PATH = '/dating/cards';

export function resolveDatingEntry(me: Pick<Me, 'hasResult' | 'hasDatingProfile'>): DatingEntry {
  if (me.hasDatingProfile) return { kind: 'cards' };
  return { kind: 'profile', step: me.hasResult ? 2 : 1 };
}

export function datingEntryPath(entry: DatingEntry): string {
  return entry.kind === 'cards' ? DATING_CARDS_PATH : DATING_PROFILE_PATH;
}

// 인트로 loader — 로그인 여부만 정한다. 조회가 실패해도 진입을 막지 않는다(FR-24): 로그인 인트로를 보이고
// '내 운명 찾아 떠나기'가 다시 조회한다. 비로그인으로 판명되면 그때 비로그인 인트로로 바뀐다.
export async function datingIntroLoader(): Promise<DatingIntroView> {
  const outcome = await getMe();
  if (isUnauthenticated(outcome)) return { viewer: 'guest' };
  if (!outcome.ok) console.error('GET /me 실패', outcome.error);
  return { viewer: 'member' };
}

// '내 운명 찾아 떠나기' — 최신 등록 상태로 갈 곳을 정한다.
export type DatingStart = { kind: 'go'; path: string } | { kind: 'guest' } | { kind: 'failed' };

export async function findDatingStart(): Promise<DatingStart> {
  const outcome = await getMe();
  if (outcome.ok) return { kind: 'go', path: datingEntryPath(resolveDatingEntry(outcome.data)) };
  if (isUnauthenticated(outcome)) return { kind: 'guest' };
  console.error('GET /me 실패', outcome.error);
  return { kind: 'failed' };
}
