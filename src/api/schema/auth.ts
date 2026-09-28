import { z } from 'zod';

// POST /auth/kakao 응답 — docs/api/openapi.yaml `KakaoLoginResult`(WKS-BE #91 로 확정, 쿠키 `wks_token`). 세션 JWT 는 body 가 아니라
// HttpOnly 쿠키로만 온다. rewardGranted 는 실(재화) 기능 전에는 항상 null.
export const kakaoLoginResultSchema = z.object({
  isNewUser: z.boolean(),
  restoredResultId: z.string().uuid().nullable(),
  rewardGranted: z
    .object({ partnerName: z.string(), amount: z.number().int().nonnegative() })
    .nullable(),
});

export type KakaoLoginResult = z.infer<typeof kakaoLoginResultSchema>;
