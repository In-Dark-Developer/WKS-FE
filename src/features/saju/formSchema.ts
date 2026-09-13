import { z } from 'zod';

import { NICKNAME_MAX, type BirthTime, type CalendarType, type Gender } from './options';

// 화면이 들고 있는 입력값. 아직 고르지 않은 값은 null 이다.
export type SajuFormValues = {
  gender: Gender | null;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  birthDate: string;
  birthTime: BirthTime | null;
  birthTimeUnknown: boolean;
  nickname: string;
};

// 검증을 통과해 제출하는 값 — 백엔드 POST /results 의 사주 입력 필드와 같은 모양 (api-spec §2).
export type SajuInput = {
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  birthDate: string;
  birthTime: BirthTime | null;
  nickname: string;
};

export type SajuField = 'gender' | 'calendarType' | 'birthDate' | 'birthTime' | 'nickname';

export const initialSajuFormValues: SajuFormValues = {
  gender: null,
  calendarType: 'SOLAR',
  isLeapMonth: false,
  birthDate: '',
  birthTime: null,
  birthTimeUnknown: false,
  nickname: '',
};

const MIN_DATE = '1950-01-01';

function toIsoDate(digits: string): string {
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function isRealDate(digits: string, calendarType: CalendarType): boolean {
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  if (month < 1 || month > 12 || day < 1) return false;
  // 음력 한 달은 29·30일이다. 그 해에 실제로 있는 날인지는 백엔드가 확인한다 (INVALID_INPUT).
  if (calendarType === 'LUNAR') return day <= 30;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function todayIso(now: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export const sajuErrorMessages = {
  gender: '성별을 선택해 주세요',
  birthDateFormat: '생년월일을 숫자 8자리로 작성해 주세요',
  birthDateReal: '실제로 있는 날짜로 작성해 주세요',
  birthDateRange: '1950년 1월 1일부터 오늘까지의 날짜로 작성해 주세요',
  birthTime: "태어난 시간을 선택하거나 '태어난 시간을 몰라요'를 체크해 주세요",
  nickname: `닉네임을 1~${NICKNAME_MAX}자로 작성해 주세요`,
} as const;

function birthDateError(values: SajuFormValues, now: Date): string | undefined {
  if (!/^\d{8}$/.test(values.birthDate)) return sajuErrorMessages.birthDateFormat;
  if (!isRealDate(values.birthDate, values.calendarType)) return sajuErrorMessages.birthDateReal;
  const iso = toIsoDate(values.birthDate);
  if (iso < MIN_DATE || iso > todayIso(now)) return sajuErrorMessages.birthDateRange;
  return undefined;
}

export type SajuValidation =
  | { success: true; data: SajuInput }
  | { success: false; fieldErrors: Partial<Record<SajuField, string>> };

// 입력값은 화면이 만든 상태라 런타임 경계가 아니다 — 필드마다 모든 규칙을 한 번에 검사해 에러를 함께 보인다.
export function validateSajuForm(values: SajuFormValues, now = new Date()): SajuValidation {
  const nickname = values.nickname.trim();
  const fieldErrors: Partial<Record<SajuField, string>> = {
    gender: values.gender === null ? sajuErrorMessages.gender : undefined,
    birthDate: birthDateError(values, now),
    birthTime:
      !values.birthTimeUnknown && values.birthTime === null
        ? sajuErrorMessages.birthTime
        : undefined,
    // 글자 수는 코드 포인트로 센다 — 이모지 하나가 두 글자로 세지지 않게.
    nickname:
      nickname.length === 0 || [...nickname].length > NICKNAME_MAX
        ? sajuErrorMessages.nickname
        : undefined,
  };

  if (values.gender === null || Object.values(fieldErrors).some(Boolean)) {
    return {
      success: false,
      fieldErrors: Object.fromEntries(Object.entries(fieldErrors).filter(([, message]) => message)),
    };
  }

  return {
    success: true,
    data: {
      gender: values.gender,
      calendarType: values.calendarType,
      isLeapMonth: values.calendarType === 'LUNAR' && values.isLeapMonth,
      birthDate: toIsoDate(values.birthDate),
      birthTime: values.birthTimeUnknown ? null : values.birthTime,
      nickname,
    },
  };
}

// 라우트 action 이 돌려주는 값 — 연결에 실패하면 폼은 입력값을 그대로 두고 안내만 띄운다.
export const sajuActionDataSchema = z.object({ formError: z.literal('connection') });
