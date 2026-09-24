import { z } from 'zod';

// GET /me 응답 — 백엔드 api.md §6(V1 · 구현 전 초안, 2026-09-24). docs/api/openapi.yaml 에는 로그인 경로가
// 아직 없다(09/T2 가 넣는다). hasDatingProfile·threadBalance 는 소개팅·실 기능 전에는 false·0 으로 온다.
export const meSchema = z.object({
  memberId: z.number().int(),
  hasResult: z.boolean(),
  hasDatingProfile: z.boolean(),
  threadBalance: z.number().int().nonnegative(),
});

export type Me = z.infer<typeof meSchema>;
