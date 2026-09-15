import { z } from 'zod';

import { compatibilitySummarySchema, resultSchema } from './result';

// docs/api/openapi.yaml `/shares` 경로의 스키마 — 운영 Swagger(`/v3/api-docs`, 2026-09-15)와 대조했다.

// GET /shares/{shareId} — 링크 주인의 공개 결과(SharedResultResponse). 결과 조회와 같은 모양에서
// `resultId`·`shareId` 만 빠진다. 주인의 사주 요약도 오지만 화면은 보여주지 않는다(FR-15) — 그 판단은
// 이 스키마가 아니라 화면 뷰 모델이 한다.
export const sharedResultSchema = resultSchema.omit({ resultId: true, shareId: true });

export type SharedResult = z.infer<typeof sharedResultSchema>;

// POST /shares/{shareId}/compatibility 요청 — `guestResultId` 는 방문자가 방금 만든(이 브라우저가
// 보관한) resultId 다(공지 2026-09-14-result-ownership).
export const compatibilityRequestSchema = z.object({
  guestResultId: z.string().uuid(),
});

// 같은 요청의 응답(CompatibilityResponse). 결과 조회의 `compatibilities[]` 항목과 백엔드가 같은 타입을 쓴다.
export const compatibilitySchema = compatibilitySummarySchema;

export type Compatibility = z.infer<typeof compatibilitySchema>;
