import { z } from 'zod';

// 세션 보관은 이 파일만 한다 — ADR-20260913-server-state-and-session-storage.
const KEY = 'wks:session';

const sessionSchema = z.object({ v: z.literal(1), token: z.string().min(1) });

export type Session = { token: string };

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
  const parsed = sessionSchema.safeParse(value);
  if (!parsed.success) {
    clearSession();
    return null;
  }
  return { token: parsed.data.token };
}

export function writeSession(token: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, token }));
  } catch {
    // 저장하지 못하면 이번 방문 동안만 세션 없이 동작한다.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 지울 수 없는 스토리지는 읽기도 실패하므로 세션 없음과 같다.
  }
}
