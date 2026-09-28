import { z } from 'zod';

// 인트로를 봤는지만 기억한다 (FR-1). 메인 티저는 `/` 에 올 때마다 보이므로 기록이 없다. 세션(`src/api/session.ts`)과는 다른 키다.
const KEY = 'wks:intro-seen';

const seenSchema = z.literal('1');

export function hasSeenIntro(): boolean {
  return readFlag(KEY);
}

export function markIntroSeen(): void {
  writeFlag(KEY);
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
