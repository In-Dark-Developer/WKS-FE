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

// 이 브라우저가 로그인 전에 만든 결과 id 들 — 로그인 요청이 `resultIds` 로 싣는다(WKS-BE §9, 2026-09-30).
// 세션(`wks:session`)은 마지막 결과 하나라 '새로 작성하기'를 여러 번 하면 앞 결과로 남긴 별의 친구 보상이
// 빠진다(QA 2026-09-30). 최근 것부터 20개(백엔드가 앞에서부터 20개만 본다)를 중복 없이 둔다.
const MY_RESULTS_KEY = 'wks:my-results';
const MY_RESULTS_MAX = 20;

const myResultsSchema = z.array(z.string().uuid()).max(MY_RESULTS_MAX);

export function readMyResults(): string[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(MY_RESULTS_KEY);
  } catch {
    return [];
  }
  if (raw === null) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = null;
  }
  const parsed = myResultsSchema.safeParse(value);
  if (!parsed.success) {
    clearMyResults();
    return [];
  }
  return parsed.data;
}

export function rememberMyResult(resultId: string): void {
  const next = [resultId, ...readMyResults().filter((id) => id !== resultId)].slice(
    0,
    MY_RESULTS_MAX,
  );
  try {
    localStorage.setItem(MY_RESULTS_KEY, JSON.stringify(next));
  } catch {
    // 저장하지 못하면 마지막 결과(세션)만 로그인 때 연결된다.
  }
}

// 로그인 성공(백엔드가 소급을 마쳤다)·로그아웃(다음 사람에게 실려 가지 않게) 때 비운다.
export function clearMyResults(): void {
  try {
    localStorage.removeItem(MY_RESULTS_KEY);
  } catch {
    // 지울 수 없는 스토리지는 읽기도 실패하므로 빈 목록과 같다.
  }
}
