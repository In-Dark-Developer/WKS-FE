import { z } from 'zod';

// 인트로를 봤는지만 기억한다 (FR-1). 세션 토큰(`src/api/session.ts`)과는 다른 키다.
const KEY = 'wks:intro-seen';

const seenSchema = z.literal('1');

export function hasSeenIntro(): boolean {
  try {
    return seenSchema.safeParse(localStorage.getItem(KEY)).success;
  } catch {
    // 스토리지가 막힌 브라우저는 기억할 수 없으니 매번 처음 방문으로 본다.
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // 저장하지 못하면 다음 방문에 인트로가 다시 나온다.
  }
}
