import { z } from 'zod';

// docs/api/openapi.yaml `#/components/schemas` 의 results 관련 스키마 — 이름·필드를 그대로 옮긴다.
// 화면(SajuInput 등)이 아니라 백엔드 계약 모양이 기준이다. 계약에 없는 값(양·음력·12시진·십이간지 등,
// PRD Q3)은 여기 넣지 않는다 — 답이 오면 이 파일과 openapi.yaml을 함께 갱신한다.

export const genderSchema = z.enum(['MALE', 'FEMALE']);

// POST /results 요청 본문. birthRegion 은 화면이 지역을 받지 않아 항상 null 이다
// (2026-09-13 결정, docs/PRD.md FR-2 · announcements/2026-09-13-drop-birth-region).
export const resultRequestSchema = z.object({
  nickname: z.string().min(1).max(8),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'yyyy-MM-dd 형식이어야 한다'),
  birthTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable(),
  birthRegion: z.null(),
  gender: genderSchema,
});

export type ResultRequestInput = z.infer<typeof resultRequestSchema>;

export const destinySchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const fortuneCategorySchema = z.enum(['MARRIAGE', 'CHILDREN', 'LOVE']);

// 문자 등급 — 예시 SS+·A+·C+, 기획 피드백 기준 최저 B0 ~ 최고 SS. 중간 단계 표기는 [미확인](PRD Q7)이라
// 화면이 임의로 파싱하지 않고 문자열 그대로 보여준다.
export const fortuneSchema = z.object({
  category: fortuneCategorySchema,
  grade: z.string(),
  content: z.string(),
});

export const resultSchema = z.object({
  resultId: z.string().uuid(),
  nickname: z.string(),
  destiny: destinySchema,
  fortunes: z.array(fortuneSchema).length(3),
  luckyItem: z.string(),
  luckyPlace: z.string(),
});

export type Result = z.infer<typeof resultSchema>;

export const compatibilityTierSchema = z.enum(['GUIIN', 'CHALTTEOK', 'BEOT', 'SEUCHIM']);

export const compatibilitySummarySchema = z.object({
  nickname: z.string(),
  score: z.number().int().min(0).max(100),
  tier: compatibilityTierSchema,
  createdAt: z.string(),
});

// GET /results/{resultId} 응답 — Result + compatibilities(누적 궁합 목록, createdAt 내림차순).
export const resultDetailSchema = resultSchema.extend({
  compatibilities: z.array(compatibilitySummarySchema),
});

export type ResultDetail = z.infer<typeof resultDetailSchema>;
