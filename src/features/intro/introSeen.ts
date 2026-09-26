import { z } from 'zod';

// 인트로를 봤는지(방문을 넘어), 메인 티저를 지났는지(이번 접속 안에서만) 기억한다 (FR-1). 세션(`src/api/session.ts`)과는 다른 키다.
const KEY = 'wks:intro-seen';

const seenSchema = z.literal('1');

export function hasSeenIntro(): boolean {
  return readFlag(KEY);
}

export function markIntroSeen(): void {
  writeFlag(KEY);
}

// 티저는 접속(페이지 로드)마다 먼저 뜬다(FR-1, 2026-09-26 소유자 확정) — 그래서 저장소가 아니라 이 페이지의 메모리에만 둔다.
// '내 사주 보기'·'새로운 인연 찾기'를 고르면 지난 것이고, 같은 접속 안에서 앱 안 이동으로 `/` 에 돌아오면 다시 뜨지 않는다.
// 로그인만 하고 돌아온 티저는 카카오 왕복이 새 접속이라 다시 뜬다.
let teaserPassed = false;

export function hasPassedTeaser(): boolean {
  return teaserPassed;
}

export function markTeaserPassed(): void {
  teaserPassed = true;
}

// 지난 기록을 지운다 — 사주가 없는 채로 `/` 를 떠나면 IntroGate 가 부른다(다음에 오면 티저부터). 테스트는 새 접속을 흉내 낼 때 쓴다.
export function resetTeaserPassed(): void {
  teaserPassed = false;
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
