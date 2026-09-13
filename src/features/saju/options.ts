import type { SelectOption } from '@/ui/Select';

export type Gender = 'MALE' | 'FEMALE';
export type CalendarType = 'SOLAR' | 'LUNAR';

export const genderOptions = [
  { value: 'MALE', label: '남자' },
  { value: 'FEMALE', label: '여자' },
] as const satisfies readonly [SelectOption<Gender>, SelectOption<Gender>];

export const calendarOptions = [
  { value: 'SOLAR', label: '양력' },
  { value: 'LUNAR', label: '음력' },
] as const satisfies readonly [SelectOption<CalendarType>, SelectOption<CalendarType>];

// 12시진 — 값은 칸의 가운데 시각(HH:mm)이다. 자시는 자정을 걸쳐 새벽·밤의 사주가 달라 두 칸으로 나눈다
// (백엔드 api-spec §2 · PRD Q15).
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

export const NICKNAME_MAX = 8;
