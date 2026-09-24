import { z } from 'zod';

// 인트로를 봤는지, 메인 티저를 지났는지만 기억한다 (FR-1). 세션 토큰(`src/api/session.ts`)과는 다른 키다.
const KEY = 'wks:intro-seen';
const TEASER_KEY = 'wks:teaser-passed';

const seenSchema = z.literal('1');

export function hasSeenIntro(): boolean {
  return readFlag(KEY);
}

export function markIntroSeen(): void {
  writeFlag(KEY);
}

// 티저의 '내 사주 보기'·'새로운 인연 찾기'를 고르면 지난 것이다 — 로그인만 하고 돌아온 티저는 아직 지나지 않았다.
export function hasPassedTeaser(): boolean {
  return readFlag(TEASER_KEY);
}

export function markTeaserPassed(): void {
  writeFlag(TEASER_KEY);
}

function readFlag(key: string): boolean {
  try {
    return seenSchema.safeParse(localStorage.getItem(key)).success;
  } catch {
    // 스토리지가 막힌 브라우저는 기억할 수 없으니 매번 처음 방문으로 본다.
    return false;
  }
}

function writeFlag(key: string): void {
  try {
    localStorage.setItem(key, '1');
  } catch {
    // 저장하지 못하면 다음 방문에 인트로·티저가 다시 나온다.
  }
}
