import { z } from 'zod';

// docs/api/openapi.yaml `#/components/schemas` 의 results 관련 스키마 — 이름·필드를 그대로 옮긴다.
// 화면(SajuInput 등)이 아니라 백엔드 계약 모양이 기준이다. 계약에 없는 값(세션 토큰 Q16 등)은
// 여기 넣지 않는다 — 답이 오면 이 파일과 openapi.yaml을 함께 갱신한다.
// 2026-09-13 r2: WKS-BE dev b61f849 대조로 다시 맞췄다 — calendarType·isLeapMonth 추가,
// birthRegion 삭제(서버가 서울 경도 기준으로 계산), 응답에 shareId·zodiac·compatibilities 추가,
// grade 6단계 확정.

export const genderSchema = z.enum(['MALE', 'FEMALE']);

export const calendarTypeSchema = z.enum(['SOLAR', 'LUNAR']);

// POST /results 요청 본문. birthDate 는 음력이면 양력에 없는 날짜(음력 30일 등)도 올 수 있어
// 달력 형식이 아니라 자릿수 패턴으로만 검증한다(openapi ResultRequest 설명).
export const resultRequestSchema = z.object({
  nickname: z.string().min(1).max(8),
  calendarType: calendarTypeSchema,
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'yyyy-MM-dd 형식이어야 한다'),
  isLeapMonth: z.boolean().nullable().optional(),
  birthTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable(),
  gender: genderSchema,
});

export type ResultRequestInput = z.infer<typeof resultRequestSchema>;

export const zodiacSchema = z.enum([
  'RAT',
  'OX',
  'TIGER',
  'RABBIT',
  'DRAGON',
  'SNAKE',
  'HORSE',
  'GOAT',
  'MONKEY',
  'ROOSTER',
  'DOG',
  'PIG',
]);

export const destinySchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const fortuneCategorySchema = z.enum(['MARRIAGE', 'CHILDREN', 'LOVE']);

// 문자 등급 6단계(높은 순) — 점수 구간은 백엔드가 계산해 화면은 값만 쓴다(openapi Grade).
export const gradeSchema = z.enum(['SS', 'S', 'A+', 'A', 'B+', 'B']);

export const fortuneSchema = z.object({
  category: fortuneCategorySchema,
  grade: gradeSchema,
  content: z.string(),
});

export const compatibilityTierSchema = z.enum(['GUIIN', 'CHALTTEOK', 'BEOT', 'SEUCHIM']);

export const compatibilitySummarySchema = z.object({
  nickname: z.string(),
  score: z.number().int().min(0).max(100),
  tier: compatibilityTierSchema,
  createdAt: z.string(),
});

export type CompatibilitySummary = z.infer<typeof compatibilitySummarySchema>;

// POST /results · GET /results/{resultId} 가 공통으로 쓰는 응답 모양(openapi Result).
// 생성 직후엔 compatibilities 가 빈 배열이고, 조회 시엔 누적된다(createdAt 내림차순).
export const resultSchema = z.object({
  resultId: z.string().uuid(),
  shareId: z.string().uuid(),
  nickname: z.string(),
  zodiac: zodiacSchema,
  destiny: destinySchema,
  fortunes: z.array(fortuneSchema).length(3),
  luckyItem: z.string(),
  luckyPlace: z.string(),
  compatibilities: z.array(compatibilitySummarySchema),
});

export type Result = z.infer<typeof resultSchema>;
