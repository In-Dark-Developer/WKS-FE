import { z } from 'zod';

import { datingLockableFieldSchema } from './dating';
import { contactMethodSchema } from './signups';

// 매칭 요청 상태 — 백엔드 `DatingRequestStatus` 와 1:1. CANCELLED 는 보낸 사람이 취소한 것이라 보낸 목록에만 온다.
// 실패 상태는 없다(WKS-BE api-spec §11, dev 4d2e534).
export const datingRequestStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED']);

export type DatingRequestStatus = z.infer<typeof datingRequestStatusSchema>;

// 요청 한 건 — 보내기·수락·거절·취소 응답의 모양이다. `candidateId` 는 조회한 사람 기준 상대의 프로필 id 이고,
// 연락처는 ACCEPTED 일 때만 상대의 것이 온다(NFR-4).
export const datingRequestSchema = z.object({
  requestId: z.string().uuid(),
  candidateId: z.string().uuid(),
  status: datingRequestStatusSchema,
  createdAt: z.string(),
  respondedAt: z.string().nullable(),
  contactMethod: contactMethodSchema.nullable(),
  contactValue: z.string().nullable(),
});

export type DatingRequest = z.infer<typeof datingRequestSchema>;

// 목록 행의 상대 프로필(§11.1) — 받은 목록은 보낸 사람의 사진·이름·학과가 실 없이 열려 오고, 보낸 목록은 내가
// 카드에서 연 만큼만 열려 온다. 궁합 까닭은 오지 않는다.
export const datingRequestCounterpartSchema = z.object({
  score: z.number().int().min(0).max(100),
  mbti: z.string(),
  bio: z.string(),
  blurredPhotoUrl: z.url().nullish(),
  fields: z.object({
    photo: datingLockableFieldSchema,
    name: datingLockableFieldSchema,
    department: datingLockableFieldSchema,
  }),
});

// 목록 행 — 요청 한 건에 상대 프로필이 붙는다(목록에만).
export const datingRequestListItemSchema = datingRequestSchema.extend({
  counterpart: datingRequestCounterpartSchema,
});

export type DatingRequestListItem = z.infer<typeof datingRequestListItemSchema>;

export const datingRequestListSchema = z.array(datingRequestListItemSchema);

export type DatingRequestBox = 'sent' | 'received';
