import { z } from 'zod';

import { genderSchema } from './result';

export type Gender = z.infer<typeof genderSchema>;

// docs/api/openapi.yaml `/signups` 경로의 스키마 — 백엔드 `CreateSignupRequest`(WKS-BE 981b487)와 대조했다.
// 사진은 받지 않기로 했다(2026-09-17, PRD FR-10).

// 연락 수단은 택1 이다 — 전화번호 또는 인스타그램 아이디 하나를 `contactValue` 로 보낸다.
export const contactMethodSchema = z.enum(['PHONE', 'INSTAGRAM']);

export type ContactMethod = z.infer<typeof contactMethodSchema>;

// 길이 제한은 백엔드 @Size 와 같은 값이다 — 여기서 먼저 걸러 400 왕복을 줄인다.
export const signupRequestSchema = z.object({
  email: z.email(),
  // 사주 없이 신청하는 경로는 null 이다.
  resultId: z.string().uuid().nullable(),
  gender: genderSchema,
  preferGender: genderSchema,
  name: z.string().max(50).nullable(),
  contactMethod: contactMethodSchema.nullable(),
  contactValue: z.string().max(100).nullable(),
  department: z.string().max(100).nullable(),
  mbti: z
    .string()
    .regex(/^[EI][SN][TF][JP]$/)
    .nullable(),
  bio: z.string().max(500).nullable(),
});

export type SignupRequestInput = z.infer<typeof signupRequestSchema>;

// 응답(SignupResponse). `couponIssued` 는 쿠폰 안내(FR-11)가 MVP 제외라 화면이 쓰지 않는다.
export const signupSchema = z.object({
  signupId: z.number().int(),
  couponIssued: z.boolean(),
  // false 면 인증 메일이 안 갔다 — 재발송 안내를 띄운다.
  mailSent: z.boolean(),
  message: z.string(),
});

export type Signup = z.infer<typeof signupSchema>;

// POST /signups/resend 응답(ResendSignupResponse).
export const resendSignupSchema = z.object({
  mailSent: z.boolean(),
  message: z.string(),
});

export type ResendSignup = z.infer<typeof resendSignupSchema>;
