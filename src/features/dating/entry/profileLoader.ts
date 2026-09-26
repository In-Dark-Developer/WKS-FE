import { redirect } from 'react-router-dom';

import type { Me } from '@/api/me';
import { getMyResult, getResultInput, type ResultInput } from '@/api/results';
import { readSession } from '@/api/session';

import { birthTimeOptions, type BirthTime } from '../profile/options';
import type { SajuStepValues } from '../profile/profileSchema';
import { DATING_CARDS_PATH, resolveDatingEntry } from './datingEntry';

// 프로필 등록 화면이 시작할 상태. 사주가 이미 있으면 (2/2) 에서 시작하고 (1/2) 는 그 사주로 채워 둔다 —
// 이미 있는 단계는 다시 받지 않는다(FR-25). resultId 가 있으면 저장 때 새 사주를 만들지 않는다.
export type DatingProfileStart = {
  initialStep: 1 | 2;
  resultId: string | null;
  saju?: Partial<SajuStepValues>;
};

const birthTimes: readonly string[] = birthTimeOptions.map((option) => option.value);

function isBirthTime(value: string): value is BirthTime {
  return birthTimes.includes(value);
}

// 결과 입력값(yyyy-MM-dd · HH:mm) → 폼 값(숫자 8자리 · 시진 칸). 시진 칸에 없는 시각은 비워 다시 고르게 한다.
export function toSajuStepValues(input: ResultInput): Partial<SajuStepValues> {
  const birthTime =
    input.birthTime !== null && isBirthTime(input.birthTime) ? input.birthTime : null;
  return {
    gender: input.gender,
    calendarType: input.calendarType,
    isLeapMonth: input.isLeapMonth,
    birthDate: input.birthDate.replaceAll('-', ''),
    birthTime,
    birthTimeUnknown: input.birthTime === null,
    nickname: input.nickname,
  };
}

// 이미 넣은 사주의 resultId — 이 브라우저 세션이 먼저고, 없으면 계정에 연결된 결과를 불러온다(GET /me/result).
// 어느 쪽도 없으면 null 이라 (1/2) 부터 받는다.
async function findMyResultId(): Promise<string | null> {
  const stored = readSession()?.resultId;
  if (stored !== undefined) return stored;
  const mine = await getMyResult();
  if (mine.ok) return mine.data.resultId;
  console.error('GET /me/result 실패', mine.error);
  return null;
}

// 로그인 확인(requireAuth)을 마친 뒤 부른다. 이미 등록했으면 Top 3 로 보낸다.
export async function datingProfileLoader(me: Me): Promise<DatingProfileStart> {
  const entry = resolveDatingEntry(me);
  if (entry.kind === 'cards') throw redirect(DATING_CARDS_PATH);

  if (entry.step === 1) return { initialStep: 1, resultId: null };
  const resultId = await findMyResultId();
  if (resultId === null) return { initialStep: 1, resultId: null };

  const input = await getResultInput(resultId);
  if (!input.ok) {
    // 입력값을 못 읽으면 (1/2) 부터 다시 받는다 — 막는 것보다 한 단계 더 쓰게 하는 편이 낫다.
    console.error('GET /results/{id}/input 실패', input.error);
    return { initialStep: 1, resultId: null };
  }
  return { initialStep: 2, resultId, saju: toSajuStepValues(input.data) };
}
