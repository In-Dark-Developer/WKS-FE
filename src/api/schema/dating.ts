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
