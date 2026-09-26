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
// 한 번에 한 항목이다. 이미 연 항목은 차감 없이 값만 오고, 잔액이 모자라면 402 INSUFFICIENT_THREAD 다.
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
  field: DatingUnlockField,
): Promise<ApiOutcome<DatingUnlockResult>> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_UNLOCK_DELAY_MS));
  const key = mockKeyByField[field];
  const cost = readMockUnlockCost(candidateId, key);
  if (cost === null) {
    return {
      ok: false,
      error: {
        kind: 'api',
        code: 'DATING_PROFILE_NOT_FOUND',
        message: '지금 인연 카드에 없는 상대예요.',
      },
    };
  }
  // 이미 연 항목은 0 을 쓴다 — 차감 없이 잔액만 읽힌다.
  const balance = spendMockThread(cost);
  if (balance === null) {
    return {
      ok: false,
      error: { kind: 'api', code: 'INSUFFICIENT_THREAD', message: '운명의 실이 부족해요.' },
    };
  }
  return {
    ok: true,
    data: { field, value: openMockCandidateField(candidateId, key), balance },
  };
}

export async function unlockCandidateField(
  candidateId: string,
  field: DatingUnlockField,
): Promise<ApiOutcome<DatingUnlockResult>> {
  const body = { field: datingUnlockFieldSchema.parse(field) }; // 내부 호출 실수를 개발 중 바로 잡는다
  if (isMockEnabled()) return mockUnlock(candidateId, field);
  return request(
    {
      method: 'POST',
      path: `/dating/candidates/${encodeURIComponent(candidateId)}/unlock`,
      body,
    },
    datingUnlockResultSchema,
  );
}
