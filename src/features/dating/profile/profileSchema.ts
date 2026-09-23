import { z } from 'zod';

import {
  BIO_MAX,
  DEPARTMENT_MAX,
  NAME_MAX,
  NICKNAME_MAX,
  type BirthTime,
  type CalendarType,
  type ContactMethod,
  type Gender,
  type Mbti,
  mbtiTypes,
} from './options';

// (1/2) 사주 정보 — 화면이 들고 있는 값. 아직 고르지 않은 값은 null 이다.
export type SajuStepValues = {
  gender: Gender | null;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  birthDate: string;
  birthTime: BirthTime | null;
  birthTimeUnknown: boolean;
  nickname: string;
};

// (2/2) 이름·학교 정보. 사진은 업로드 상태로만 판단한다 — 업로드는 연동 Task 가 한다(FR-25).
export type DetailsStepValues = {
  name: string;
  isPhotoReady: boolean;
  email: string;
  contactMethod: ContactMethod;
  contactValue: string;
  department: string;
  mbti: Mbti | null;
  bio: string;
};

export type SajuField = 'gender' | 'birthDate' | 'birthTime' | 'nickname';
export type DetailsField =
  'name' | 'photo' | 'email' | 'contactValue' | 'department' | 'mbti' | 'bio';

export const initialSajuStepValues: SajuStepValues = {
  gender: null,
  calendarType: 'SOLAR',
  isLeapMonth: false,
  birthDate: '',
  birthTime: null,
  birthTimeUnknown: false,
  nickname: '',
};

export const initialDetailsStepValues: DetailsStepValues = {
  name: '',
  isPhotoReady: false,
  email: '',
  contactMethod: 'PHONE',
  contactValue: '',
  department: '',
  mbti: null,
  bio: '',
};

export const profileErrorMessages = {
  gender: '성별을 선택해 주세요',
  birthDateFormat: '생년월일을 숫자 8자리로 작성해 주세요',
  birthDateReal: '실제로 있는 날짜로 작성해 주세요',
  birthDateRange: '1950년 1월 1일부터 오늘까지의 날짜로 작성해 주세요',
  birthTime: "태어난 시간을 선택하거나 '태어난 시간을 몰라요'를 체크해 주세요",
  nickname: `닉네임을 1~${NICKNAME_MAX}자로 작성해 주세요`,
  name: `이름을 1~${NAME_MAX}자로 입력해 주세요`,
  photo: '본인 사진을 한 장 올려 주세요',
  email: '이메일 주소를 확인해 주세요',
  phone: '전화번호를 숫자 10~11자리로 입력해 주세요',
  instagram: '인스타그램 아이디를 확인해 주세요',
  department: `학과를 1~${DEPARTMENT_MAX}자로 입력해 주세요`,
  mbti: 'MBTI 유형을 골라 주세요',
  bio: `자기소개를 1~${BIO_MAX}자로 적어 주세요`,
} as const;

const MIN_DATE = '1950-01-01';

// 글자 수는 코드 포인트로 센다 — 이모지 하나가 두 글자로 세지지 않게.
function length(value: string): number {
  return [...value].length;
}

function lengthBetween(max: number, message: string) {
  return z
    .string()
    .trim()
    .refine((value) => length(value) >= 1 && length(value) <= max, message);
}

function toIsoDate(digits: string): string {
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function isRealDate(digits: string, calendarType: CalendarType): boolean {
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  const day = Number(digits.slice(6, 8));
  if (month < 1 || month > 12 || day < 1) return false;
  // 음력 한 달은 29·30일이다. 그 해에 실제로 있는 날인지는 백엔드가 확인한다.
  if (calendarType === 'LUNAR') return day <= 30;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function todayIso(now: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// 형식(8자리)이 틀리면 형식 오류만 보인다 — 실재·범위 검사는 그 다음이다.
function birthDateError(
  values: Pick<SajuStepValues, 'birthDate' | 'calendarType'>,
  now: Date,
): string | undefined {
  if (!/^\d{8}$/.test(values.birthDate)) return undefined;
  if (!isRealDate(values.birthDate, values.calendarType)) return profileErrorMessages.birthDateReal;
  const iso = toIsoDate(values.birthDate);
  if (iso < MIN_DATE || iso > todayIso(now)) return profileErrorMessages.birthDateRange;
  return undefined;
}

const always = () => true;

function sajuStepSchema(now: Date) {
  return (
    z
      .object({
        gender: z.enum(['MALE', 'FEMALE'], { error: profileErrorMessages.gender }),
        calendarType: z.enum(['SOLAR', 'LUNAR']),
        birthDate: z.string().regex(/^\d{8}$/, profileErrorMessages.birthDateFormat),
        birthTime: z.string().nullable(),
        birthTimeUnknown: z.boolean(),
        nickname: lengthBetween(NICKNAME_MAX, profileErrorMessages.nickname),
      })
      // 교차 규칙은 다른 필드가 틀려도 함께 검사해 오류를 한 번에 보인다(zod 기본은 건너뛴다).
      .refine((values) => birthDateError(values, now) === undefined, {
        path: ['birthDate'],
        // issue.input 은 unknown 이지만 validateSajuStep 만 이 스키마에 SajuStepValues 를 넣는다.
        error: (issue) => birthDateError(issue.input as SajuStepValues, now),
        when: always,
      })
      .refine((values) => values.birthTimeUnknown || values.birthTime !== null, {
        path: ['birthTime'],
        error: profileErrorMessages.birthTime,
        when: always,
      })
  );
}

const detailsStepSchema = z
  .object({
    name: lengthBetween(NAME_MAX, profileErrorMessages.name),
    isPhotoReady: z.literal(true, { error: profileErrorMessages.photo }),
    email: z
      .string()
      .trim()
      .pipe(z.email({ error: profileErrorMessages.email })),
    contactMethod: z.enum(['PHONE', 'INSTAGRAM']),
    contactValue: z.string(),
    department: lengthBetween(DEPARTMENT_MAX, profileErrorMessages.department),
    mbti: z.enum(mbtiTypes, { error: profileErrorMessages.mbti }),
    bio: lengthBetween(BIO_MAX, profileErrorMessages.bio),
  })
  .refine((values) => contactError(values) === undefined, {
    path: ['contactValue'],
    // issue.input 은 unknown 이지만 validateDetailsStep 만 이 스키마에 DetailsStepValues 를 넣는다.
    error: (issue) => contactError(issue.input as DetailsStepValues),
    when: always,
  });

function contactError(values: Pick<DetailsStepValues, 'contactMethod' | 'contactValue'>) {
  const isPhone = values.contactMethod === 'PHONE';
  const pattern = isPhone ? /^01\d{8,9}$/ : /^[A-Za-z0-9._]{1,30}$/;
  if (pattern.test(normalizeContact(values.contactValue))) return undefined;
  return isPhone ? profileErrorMessages.phone : profileErrorMessages.instagram;
}

// 인스타그램 아이디 앞의 @ 는 떼고 받는다.
function normalizeContact(value: string): string {
  return value.trim().replace(/^@/, '');
}

// 검증을 통과해 onSubmit 으로 넘기는 값. 백엔드 요청 모양으로 바꾸는 일은 연동 Task(10/T1)가 한다.
export type DatingSajuInput = {
  gender: Gender;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  // YYYY-MM-DD
  birthDate: string;
  birthTime: BirthTime | null;
  nickname: string;
};

export type DatingDetailsInput = {
  name: string;
  email: string;
  contactMethod: ContactMethod;
  contactValue: string;
  department: string;
  mbti: Mbti;
  bio: string;
};

export type DatingProfileInput = { saju: DatingSajuInput; details: DatingDetailsInput };

export type Validation<Data, Field extends string> =
  { success: true; data: Data } | { success: false; fieldErrors: Partial<Record<Field, string>> };

// 필드마다 첫 번째 오류 문구만 남긴다. 사진은 값 이름(isPhotoReady)이 아니라 필드 이름(photo)으로 돌려준다.
function firstErrors(error: z.ZodError): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] === 'isPhotoReady' ? 'photo' : String(issue.path[0]);
    errors[key] ??= issue.message;
  }
  return errors;
}

// 입력값은 화면이 만든 상태라 런타임 경계가 아니지만, 규칙을 한곳에서 읽히게 zod 스키마로 적는다.
// 스키마는 검사만 하고, 넘길 값은 타입이 좁혀진 입력에서 만든다.
export function validateSajuStep(
  values: SajuStepValues,
  now = new Date(),
): Validation<DatingSajuInput, SajuField> {
  const result = sajuStepSchema(now).safeParse(values);
  if (!result.success) return { success: false, fieldErrors: firstErrors(result.error) };
  return {
    success: true,
    data: {
      gender: result.data.gender,
      calendarType: values.calendarType,
      isLeapMonth: values.calendarType === 'LUNAR' && values.isLeapMonth,
      birthDate: toIsoDate(values.birthDate),
      birthTime: values.birthTimeUnknown ? null : values.birthTime,
      nickname: values.nickname.trim(),
    },
  };
}

export function validateDetailsStep(
  values: DetailsStepValues,
): Validation<DatingDetailsInput, DetailsField> {
  const result = detailsStepSchema.safeParse(values);
  if (!result.success) return { success: false, fieldErrors: firstErrors(result.error) };
  return {
    success: true,
    data: {
      name: values.name.trim(),
      email: values.email.trim(),
      contactMethod: values.contactMethod,
      contactValue: normalizeContact(values.contactValue),
      department: values.department.trim(),
      mbti: result.data.mbti,
      bio: values.bio.trim(),
    },
  };
}
