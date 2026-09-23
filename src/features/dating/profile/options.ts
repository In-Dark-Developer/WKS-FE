import type { SelectOption } from '@/ui/Select';

// 소개팅 프로필 입력 옵션. 사주 입력(features/saju)과 값이 같지만 feature 끼리 import 하지 않으므로 따로 둔다.
export type Gender = 'MALE' | 'FEMALE';
export type CalendarType = 'SOLAR' | 'LUNAR';
export type ContactMethod = 'PHONE' | 'INSTAGRAM';

export const genderOptions = [
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
] as const satisfies readonly [SelectOption<Gender>, SelectOption<Gender>];

export const calendarOptions = [
  { value: 'SOLAR', label: '양력' },
  { value: 'LUNAR', label: '음력' },
] as const satisfies readonly [SelectOption<CalendarType>, SelectOption<CalendarType>];

// 12시진 — 값은 칸의 가운데 시각(HH:mm), 자시는 두 칸(백엔드 api-spec §2 · PRD Q15). 사주 입력과 같은 값이다.
export const birthTimeOptions = [
  { value: '00:45', label: '자시(子時) 00:00 ~ 01:30' },
  { value: '02:30', label: '축시(丑時) 01:30 ~ 03:30' },
  { value: '04:30', label: '인시(寅時) 03:30 ~ 05:30' },
  { value: '06:30', label: '묘시(卯時) 05:30 ~ 07:30' },
  { value: '08:30', label: '진시(辰時) 07:30 ~ 09:30' },
  { value: '10:30', label: '사시(巳時) 09:30 ~ 11:30' },
  { value: '12:30', label: '오시(午時) 11:30 ~ 13:30' },
  { value: '14:30', label: '미시(未時) 13:30 ~ 15:30' },
  { value: '16:30', label: '신시(申時) 15:30 ~ 17:30' },
  { value: '18:30', label: '유시(酉時) 17:30 ~ 19:30' },
  { value: '20:30', label: '술시(戌時) 19:30 ~ 21:30' },
  { value: '22:30', label: '해시(亥時) 21:30 ~ 23:30' },
  { value: '23:45', label: '자시(子時) 23:30 ~ 24:00' },
] as const satisfies readonly SelectOption<string>[];

export type BirthTime = (typeof birthTimeOptions)[number]['value'];

// 연락 수단 택1 — Figma 사주입력폼 (2/2) 134:3639 의 세그먼트(FR-25).
export const contactMethodOptions = [
  { value: 'PHONE', label: '전화번호' },
  { value: 'INSTAGRAM', label: '인스타그램' },
] as const satisfies readonly [SelectOption<ContactMethod>, SelectOption<ContactMethod>];

export const mbtiTypes = [
  'ENTJ',
  'ENTP',
  'INTJ',
  'INTP',
  'ENFJ',
  'ENFP',
  'INFJ',
  'INFP',
  'ESTJ',
  'ESFJ',
  'ISTJ',
  'ISFJ',
  'ESTP',
  'ESFP',
  'ISTP',
  'ISFP',
] as const;

export type Mbti = (typeof mbtiTypes)[number];

export const mbtiOptions: readonly SelectOption<Mbti>[] = mbtiTypes.map((type) => ({
  value: type,
  label: type,
}));

export const NICKNAME_MAX = 8;
export const NAME_MAX = 20;
// 카드 뒷면 학과 칸 주석 '최대글자 14글자'(Figma 103:2549).
export const DEPARTMENT_MAX = 14;
// 카드 앞면 자기소개 칸 주석 '170자 정도'(Figma 101:2003).
export const BIO_MAX = 170;
