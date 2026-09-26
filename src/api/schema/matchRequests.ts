import { z } from 'zod';

import { contactMethodSchema } from './signups';

// 매칭 요청 상태 — 백엔드 `DatingRequestStatus` 와 1:1. 취소·실패 상태는 없다(WKS-BE api-spec §11).
export const datingRequestStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED']);

export type DatingRequestStatus = z.infer<typeof datingRequestStatusSchema>;

// 요청 한 건 — 보내기·목록·수락·거절이 같은 모양이다. `candidateId` 는 조회한 사람 기준 상대의 프로필 id 이고,
// 연락처는 ACCEPTED 일 때만 상대의 것이 온다(NFR-4). 상대 이름·사진 같은 프로필은 오지 않는다.
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

export const datingRequestListSchema = z.array(datingRequestSchema);

export type DatingRequestBox = 'sent' | 'received';
