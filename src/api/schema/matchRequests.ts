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
// 카드에서 연 만큼만 열려 온다.
export const datingRequestCounterpartSchema = z.object({
  score: z.number().int().min(0).max(100),
  mbti: z.string(),
  // 나이 표시 문구 — 추천 카드와 같다(dating.ts `age`). 없을 수 있다.
  age: z.string().nullish(),
  bio: z.string(),
  blurredPhotoUrl: z.url().nullish(),
  fields: z.object({
    photo: datingLockableFieldSchema,
    name: datingLockableFieldSchema,
    department: datingLockableFieldSchema,
    // 궁합 까닭(§11.1, 2026-09-28 추가) — 받은 목록은 받은 사람 기준으로 새로 쓴 문장이라 늘 `locked: false` 이고,
    // 만들어지기 전 몇 초 동안은 `value` 가 null 이다. 보낸 목록은 카드와 같은 해금 상태로 온다.
    // 아직 이 필드를 주지 않는 백엔드도 파싱되도록 없어도 되는 값으로 받는다.
    reason: datingLockableFieldSchema.optional(),
  }),
});

// 목록 행 — 요청 한 건에 상대 프로필이 붙는다(목록에만).
export const datingRequestListItemSchema = datingRequestSchema.extend({
  counterpart: datingRequestCounterpartSchema,
});

export type DatingRequestListItem = z.infer<typeof datingRequestListItemSchema>;

export const datingRequestListSchema = z.array(datingRequestListItemSchema);

export type DatingRequestBox = 'sent' | 'received';
