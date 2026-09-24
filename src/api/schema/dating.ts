import { z } from 'zod';

import { contactMethodSchema } from './signups';

// 소개팅 프로필 저장 요청 — [미확인] 백엔드 `/api/dating/**` 명세 전(2026-09-24)이라 FR-25 항목과
// 사전등록(`/signups`) 필드 이름·길이를 빌려 둔 가안이다. 명세가 오면 이 파일과 openapi.yaml 을 함께 맞춘다.
export const datingProfileRequestSchema = z.object({
  // 프로필 (1/2) 의 사주 결과 — 계정에 연결된 결과가 있으면 그 값이다.
  resultId: z.string().uuid(),
  name: z.string().min(1).max(50),
  photoKey: z.string().min(1),
  email: z.email(),
  contactMethod: contactMethodSchema,
  contactValue: z.string().min(1).max(100),
  department: z.string().min(1).max(100),
  mbti: z.string().regex(/^[EI][SN][TF][JP]$/),
  bio: z.string().min(1).max(500),
});

export type DatingProfileRequest = z.infer<typeof datingProfileRequestSchema>;
