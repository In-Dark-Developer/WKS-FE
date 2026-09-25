import { z } from 'zod';

// 백엔드 공통 응답 봉투 — docs/api/openapi.yaml `ErrorResponse`·각 경로의 `success` 응답.
// 모든 응답은 `{ success: true, data }` 또는 `{ success: false, error }` 다.

export const errorCodeSchema = z.enum([
  'INVALID_INPUT',
  'RESULT_NOT_FOUND',
  'SELF_COMPATIBILITY',
  'COMPATIBILITY_NOT_FOUND',
  'DUPLICATE_SIGNUP',
  'INVALID_EMAIL_DOMAIN',
  'INVALID_TOKEN',
  'LLM_UNAVAILABLE',
  'UNAUTHENTICATED',
  'KAKAO_UNAVAILABLE',
  'DATING_PROFILE_NOT_FOUND',
  'DATING_PROFILE_CONFLICT',
  'DATING_NOT_VERIFIED',
  'DATING_REQUEST_NOT_FOUND',
  'DATING_REQUEST_CONFLICT',
  'INTERNAL_ERROR',
  'NOT_FOUND',
]);

export type ErrorCode = z.infer<typeof errorCodeSchema>;

// traceId 는 백엔드 미구현(2026-09-13)이라 optional (openapi ErrorResponse 설명).
export const errorEnvelopeSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
    traceId: z.string().optional(),
  }),
});

export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;

// data 스키마를 받아 그 경로의 성공/실패 봉투 전체를 검증하는 스키마를 만든다.
export function envelopeSchema<TData extends z.ZodTypeAny>(dataSchema: TData) {
  return z.discriminatedUnion('success', [
    z.object({ success: z.literal(true), data: dataSchema }),
    errorEnvelopeSchema,
  ]);
}
