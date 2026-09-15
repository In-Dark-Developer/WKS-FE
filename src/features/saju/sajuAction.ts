import { redirect, type ActionFunctionArgs } from 'react-router-dom';

import { readPendingShare } from '@/api/pendingShare';
import { createResult, type ResultRequestInput } from '@/api/results';

function isGender(value: unknown): value is ResultRequestInput['gender'] {
  return value === 'MALE' || value === 'FEMALE';
}

function isCalendarType(value: unknown): value is ResultRequestInput['calendarType'] {
  return value === 'SOLAR' || value === 'LUNAR';
}

// SajuForm 이 `encType: 'application/json'` 으로 보내는 SajuInput(같은 feature, formSchema.ts)을
// 계약 모양(ResultRequestInput)으로 좁힌다. 같은 화면이 방금 만든 값이라 필드 존재는 신뢰하되,
// 요청 본문은 여전히 런타임 경계라 타입은 확인한다(CONVENTIONS 5장) — 실제 계약 검증은
// `createResult` 안 zod 가 한다.
function toResultRequestInput(value: unknown): ResultRequestInput {
  if (typeof value !== 'object' || value === null) throw new Error('요청 본문이 올바르지 않다');
  // 위에서 object 임을 확인했으니 필드별로 좁히기 위해 인덱스로 읽는다.
  const body = value as Record<string, unknown>;
  const { gender, calendarType, isLeapMonth, birthDate, birthTime, nickname } = body;

  if (
    !isGender(gender) ||
    !isCalendarType(calendarType) ||
    typeof isLeapMonth !== 'boolean' ||
    typeof birthDate !== 'string' ||
    (typeof birthTime !== 'string' && birthTime !== null) ||
    typeof nickname !== 'string'
  ) {
    throw new Error('요청 본문이 올바르지 않다');
  }

  return { gender, calendarType, isLeapMonth, birthDate, birthTime, nickname };
}

// SCR-02 `/` action — POST /results. 성공하면 `/reading/:resultId`로 이동한다. 공유 링크로 들어와 보관된
// shareId 가 있으면 대신 `/s/:shareId/join` 으로 가서 궁합을 만든 뒤 내 결과로 간다(FR-6, 05/T7). 실패는(연결·스키마·
// 백엔드 에러 모두) SajuForm 이 아는 유일한 모양 `{ formError: 'connection' }`으로 돌려줘 입력값을
// 유지한 채 안내한다(ARCHITECTURE Cross-cutting — 스키마 위반·네트워크 실패도 사용자에게는 같은 안내).
export async function sajuAction({ request }: ActionFunctionArgs) {
  const input = toResultRequestInput(await request.json());
  const outcome = await createResult(input);

  if (outcome.ok) {
    const pendingShareId = readPendingShare();
    if (pendingShareId) return redirect(`/s/${encodeURIComponent(pendingShareId)}/join`);
    return redirect(`/reading/${outcome.data.resultId}`);
  }

  console.error('POST /results 실패', outcome.error);
  return { formError: 'connection' as const };
}
