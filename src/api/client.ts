import type { z } from 'zod';

import { envelopeSchema, type ErrorCode } from './schema/envelope';

// 백엔드 호출 한 곳 — GET 재시도·응답 봉투 검증을 여기서만 한다. 인증 헤더는 싣지 않는다 — 로그인 세션은 백엔드가 심는
// HttpOnly 쿠키이고, 모든 요청을 `credentials: 'include'` 로 보내 브라우저가 싣게 한다. 사주·궁합 API 는 쿠키를 무시한다
// (ADR-20260914-result-ownership-in-browser · ADR-20260923-v1-account-and-kakao-login · openapi cookieAuth).
// Base URL 은 `VITE_` 접두 환경변수로만 주입한다. 로컬 dev 백엔드 CORS 는 프론트 localhost:3000 만
// 허용하므로 vite.config.ts server.port 를 3000 으로 맞춘다(같은 Task Touches).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export type ApiFailure =
  | { kind: 'network' } // fetch 실패 · 응답이 JSON 이 아님(연결 문제로 본다)
  | { kind: 'schema' } // JSON 은 받았지만 봉투 모양이 계약과 다름(스키마 위반)
  | { kind: 'api'; code: ErrorCode; message: string; traceId?: string }; // 백엔드가 success:false 로 응답

export type ApiOutcome<TData> = { ok: true; data: TData } | { ok: false; error: ApiFailure };

type RequestInput = {
  method: 'GET' | 'POST';
  path: string; // '/results' 처럼 BASE_URL 뒤에 붙는 경로
  body?: unknown;
};

async function requestOnce<TData>(
  input: RequestInput,
  dataSchema: z.ZodType<TData>,
): Promise<ApiOutcome<TData>> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${input.path}`, {
      method: input.method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: input.body === undefined ? undefined : JSON.stringify(input.body),
    });
  } catch {
    return { ok: false, error: { kind: 'network' } };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    // 상태 코드와 무관하게 JSON 이 아닌 응답(프록시 오류 페이지 등)은 연결 문제로 본다.
    return { ok: false, error: { kind: 'network' } };
  }

  const envelope = envelopeSchema(dataSchema).safeParse(json);
  if (!envelope.success) return { ok: false, error: { kind: 'schema' } };

  if (!envelope.data.success) {
    const { code, message, traceId } = envelope.data.error;
    return { ok: false, error: { kind: 'api', code, message, traceId } };
  }

  return { ok: true, data: envelope.data.data };
}

// GET 은 네트워크 실패에 한해 1회 재시도한다. POST 는 호출마다 새 LLM 호출·새 결과를 만들므로
// 재시도하지 않는다(ADR-20260913-server-state-and-session-storage).
export async function request<TData>(
  input: RequestInput,
  dataSchema: z.ZodType<TData>,
): Promise<ApiOutcome<TData>> {
  const first = await requestOnce(input, dataSchema);
  if (first.ok || input.method !== 'GET' || first.error.kind !== 'network') return first;
  return requestOnce(input, dataSchema);
}
