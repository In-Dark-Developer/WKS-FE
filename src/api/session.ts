import { z } from 'zod';

// 세션 보관은 이 파일만 한다 — ADR-20260914-result-ownership-in-browser.
// 세션은 이 브라우저가 만든 '내 결과'의 resultId 하나다(백엔드 세션 토큰은 없다). 새 결과가 덮어쓴다.
const KEY = 'wks:session';

const sessionSchema = z.object({ v: z.literal(2), resultId: z.string().uuid() });

export type Session = { resultId: string };

export function readSession(): Session | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // 스토리지가 막힌 브라우저(사생활 보호 모드 등)는 세션 없음으로 본다.
    return null;
  }
  if (raw === null) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = null;
  }
  // 예전 토큰 값(`{ v: 1, token }`)도 여기서 걸러져 지워진다.
  const parsed = sessionSchema.safeParse(value);
  if (!parsed.success) {
    clearSession();
    return null;
  }
  return { resultId: parsed.data.resultId };
}

export function writeSession(resultId: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 2, resultId }));
  } catch {
    // 저장하지 못하면 이번 방문 동안만 세션 없이 동작한다.
  }
}

// 백엔드가 이 resultId 를 모른다고 답했을 때(RESULT_NOT_FOUND) 부른다 — 보관된 '내 결과'가 그 id 일
// 때만 비운다. 남겨 두면 결과·지도·사전신청이 죽은 id 로 계속 404 를 받는다.
export function forgetSession(resultId: string): void {
  if (readSession()?.resultId === resultId) clearSession();
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 지울 수 없는 스토리지는 읽기도 실패하므로 세션 없음과 같다.
  }
}
