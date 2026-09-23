import { z } from 'zod';

// docs/api/openapi.yaml `/auth/kakao`·`/me` 경로의 스키마 — 백엔드 api-spec.md §9(구현 전 초안)를 옮긴다.
// ADR-20260922-kakao-login-and-jwt-session.

// POST /auth/kakao 응답(KakaoLoginResponse). rewardGranted 는 실(재화)·소개팅이 구현되기 전이라 항상 null.
export const kakaoLoginResponseSchema = z.object({
  token: z.string().min(1),
  isNewUser: z.boolean(),
  restoredResultId: z.string().uuid().nullable(),
  rewardGranted: z.object({ partnerName: z.string(), amount: z.number().int() }).nullable(),
});

export type KakaoLoginResponse = z.infer<typeof kakaoLoginResponseSchema>;

// GET /me 응답(MeResponse). hasDatingProfile·threadBalance 는 소개팅·실 기능이 없는 동안 false·0 고정.
export const meSchema = z.object({
  memberId: z.number().int(),
  hasResult: z.boolean(),
  hasDatingProfile: z.boolean(),
  threadBalance: z.number().int(),
});

export type Me = z.infer<typeof meSchema>;
