import { z } from 'zod';

import { contactMethodSchema } from './signups';

// 소개팅 프로필 — docs/api/openapi.yaml `DatingProfileRequest`·`DatingProfile`
// (WKS-BE api-spec.md §10.2, dev 5ec80d2). 사주는 계정에 연결된 결과를 서버가 쓰므로 resultId 를 보내지 않는다.
export const datingProfileRequestSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  contactMethod: contactMethodSchema,
  contactValue: z.string().min(1),
  department: z.string().min(1),
  mbti: z.string().regex(/^[EI][SN][TF][JP]$/),
  bio: z.string().min(1),
  photoId: z.string().uuid(),
});

export type DatingProfileRequest = z.infer<typeof datingProfileRequestSchema>;

// `candidateId` 는 소개팅 프로필 id 로 상대의 추천 카드에서도 이 값으로 가리킨다 — 사진 id(`photoId`)와 다르다.
// `emailVerified` 가 false 인 동안에는 추천 조회가 403 DATING_NOT_VERIFIED 다.
export const datingProfileSchema = datingProfileRequestSchema.extend({
  candidateId: z.string().uuid(),
  emailVerified: z.boolean(),
});

export type DatingProfile = z.infer<typeof datingProfileSchema>;

// 사진 업로드 준비(§10.1) — uploadUrl 은 만료되는 업로드 전용 주소이고 조회 URL 이 아니다.
export const datingPhotoContentTypeSchema = z.enum(['image/jpeg', 'image/png', 'image/webp']);

export type DatingPhotoContentType = z.infer<typeof datingPhotoContentTypeSchema>;

export const datingPhotoUploadSchema = z.object({
  uploadUrl: z.url(),
  photoId: z.string().uuid(),
  expiresInSeconds: z.number().int().positive(),
});

export type DatingPhotoUpload = z.infer<typeof datingPhotoUploadSchema>;

// 추천 카드(§10.4) — 잠겨 있으면 `cost` 만, 열렸으면 `value` 만 오고 반대쪽은 null 이다(FR-28 · NFR-4, WKS-BE
// dev adf54ab). 열렸는데 `value` 가 null 이면 값 생성(궁합 까닭 LLM)이 늦거나 실패한 것이라 해금을 다시 부른다.
// 반대쪽 null 키는 zod 가 떨어낸다.
export const datingLockableFieldSchema = z.union([
  z.object({ locked: z.literal(true), cost: z.number().int().nonnegative() }),
  z.object({ locked: z.literal(false), value: z.string().nullable() }),
]);

export type DatingLockableField = z.infer<typeof datingLockableFieldSchema>;

export const datingCandidateSchema = z.object({
  rank: z.number().int().min(1).max(3),
  candidateId: z.string().uuid(),
  score: z.number().int().min(0).max(100),
  mbti: z.string(),
  bio: z.string(),
  // 흐리게 보여줄 썸네일의 임시 조회 주소 — 원본 사진 권한은 주지 않는다(WKS-BE §10.4, dev 51d5ec2).
  // 사진이 없는 후보를 위해 없을 수도 있는 값으로 받는다.
  blurredPhotoUrl: z.url().nullish(),
  fields: z.object({
    photo: datingLockableFieldSchema,
    name: datingLockableFieldSchema,
    department: datingLockableFieldSchema,
    reason: datingLockableFieldSchema,
  }),
});

export type DatingCandidate = z.infer<typeof datingCandidateSchema>;

// 최대 3명. 후보가 없으면 빈 배열이다.
export const datingRecommendationsSchema = z.object({
  candidates: z.array(datingCandidateSchema).max(3),
});

export type DatingRecommendations = z.infer<typeof datingRecommendationsSchema>;

// 해금 항목(§10.5) — 비용 PHOTO 10 · NAME 7 · DEPARTMENT 5 · REASON 3.
export const datingUnlockFieldSchema = z.enum(['PHOTO', 'NAME', 'DEPARTMENT', 'REASON']);

export type DatingUnlockField = z.infer<typeof datingUnlockFieldSchema>;

// 해금 응답 — 열린 값과 차감 뒤 잔액. 사진은 원본의 서명된 임시 URL 이다.
export const datingUnlockResultSchema = z.object({
  field: datingUnlockFieldSchema,
  value: z.string().nullable(),
  balance: z.number().int().nonnegative(),
});

export type DatingUnlockResult = z.infer<typeof datingUnlockResultSchema>;
