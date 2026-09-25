import { z } from 'zod';

// GET /me 응답 — docs/api/openapi.yaml `Me`(백엔드 api-spec.md §9 초안, 인증은 세션 쿠키).
// hasDatingProfile·threadBalance 는 소개팅·실 기능 전에는 false·0 으로 온다.
export const meSchema = z.object({
  memberId: z.number().int(),
  hasResult: z.boolean(),
  hasDatingProfile: z.boolean(),
  threadBalance: z.number().int().nonnegative(),
});

export type Me = z.infer<typeof meSchema>;
