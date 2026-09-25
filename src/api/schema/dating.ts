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

// 추천 카드(§10.4) — 잠긴 항목은 값 없이 비용만 온다(FR-28 · NFR-4). 해금 API 가 아직 없어 `value` 가 실제로
// 어떤 모양으로 오는지는 확인 전이다 — locked=false 면 문자열 값으로 가정한다.
export const datingLockableFieldSchema = z.union([
  z.object({ locked: z.literal(true), cost: z.number().int().nonnegative() }),
  z.object({ locked: z.literal(false), value: z.string() }),
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
