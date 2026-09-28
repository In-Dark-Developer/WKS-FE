import { z } from 'zod';

// GET /me 응답 — docs/api/openapi.yaml `Me`(백엔드 api-spec.md §9 초안, 인증은 세션 쿠키).
// `threadBalance` 는 진입 요약이다 — 화면에 보이는 잔액의 단일 출처는 `GET /wallet`(원장, §12)이다.
export const meSchema = z.object({
  memberId: z.number().int(),
  hasResult: z.boolean(),
  hasDatingProfile: z.boolean(),
  threadBalance: z.number().int().nonnegative(),
});

export type Me = z.infer<typeof meSchema>;
