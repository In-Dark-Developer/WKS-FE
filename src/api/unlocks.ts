import { z } from 'zod';

import { request, type ApiOutcome } from './client';
import { openMockCandidateField, readMockUnlockCost, type MockUnlockKey } from './dating';
import { spendMockThread } from './me';
import {
  datingUnlockFieldSchema,
  datingUnlockResultSchema,
  type DatingUnlockField,
  type DatingUnlockResult,
} from './schema/dating';

export type { DatingUnlockField, DatingUnlockResult } from './schema/dating';

// 카드 정보 해금(FR-28) — `POST /dating/candidates/{candidateId}/unlock`, 인증 필요(WKS-BE api-spec §10.5).
// 고른 항목을 한 번에 연다(2026-09-27 `field` → `fields` 배열). 비용은 아직 잠긴 항목의 합이고, 이미 연 항목은
// 차감 없이 값만 온다. 잔액이 모자라면 402 INSUFFICIENT_THREAD 이고 아무것도 열리지 않는다(전부 아니면 전무).
// `VITE_API_MOCK=true` 면 목 추천(dating.ts)과 목 잔액(me.ts)을 바꾼다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const MOCK_UNLOCK_DELAY_MS = 400;

const mockKeyByField: Record<DatingUnlockField, MockUnlockKey> = {
  PHOTO: 'photo',
  NAME: 'name',
  DEPARTMENT: 'department',
  REASON: 'reason',
};

async function mockUnlock(
  candidateId: string,
  fields: readonly DatingUnlockField[],
): Promise<ApiOutcome<DatingUnlockResult>> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_UNLOCK_DELAY_MS));
  const unique = [...new Set(fields)];
  const costs = unique.map((field) => readMockUnlockCost(candidateId, mockKeyByField[field]));
  if (costs.some((cost) => cost === null)) {
    return {
      ok: false,
      error: {
        kind: 'api',
        code: 'DATING_PROFILE_NOT_FOUND',
        message: '지금 인연 카드에 없는 상대예요.',
      },
    };
  }
  // 이미 연 항목은 0 이다 — 모두 열려 있으면 차감 없이 잔액만 읽힌다.
  const total = costs.reduce<number>((sum, cost) => sum + (cost ?? 0), 0);
  const balance = spendMockThread(total);
  if (balance === null) {
    return {
      ok: false,
      error: { kind: 'api', code: 'INSUFFICIENT_THREAD', message: '운명의 실이 부족해요.' },
    };
  }
  const values: DatingUnlockResult['values'] = {};
  for (const field of unique) {
    values[field] = openMockCandidateField(candidateId, mockKeyByField[field]);
  }
  return { ok: true, data: { values, balance } };
}

export async function unlockCandidateFields(
  candidateId: string,
  fields: readonly DatingUnlockField[],
): Promise<ApiOutcome<DatingUnlockResult>> {
  // 내부 호출 실수(빈 배열·모르는 항목)를 개발 중 바로 잡는다 — 백엔드는 400 INVALID_INPUT 이다.
  const body = { fields: z.array(datingUnlockFieldSchema).nonempty().parse(fields) };
  if (isMockEnabled()) return mockUnlock(candidateId, fields);
  return request(
    {
      method: 'POST',
      path: `/dating/candidates/${encodeURIComponent(candidateId)}/unlock`,
      body,
    },
    datingUnlockResultSchema,
  );
}
