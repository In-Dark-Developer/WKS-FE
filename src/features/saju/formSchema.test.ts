import { describe, expect, test } from 'vitest';

import {
  initialSajuFormValues,
  sajuErrorMessages,
  validateSajuForm,
  type SajuFormValues,
} from './formSchema';

const now = new Date(2026, 8, 13);
const valid: SajuFormValues = {
  ...initialSajuFormValues,
  gender: 'FEMALE',
  birthDate: '20020101',
  birthTime: '06:30',
  nickname: '보살',
};

describe('validateSajuForm', () => {
  test('올바른 입력은 백엔드 입력 모양으로 바꾼다', () => {
    expect(validateSajuForm(valid, now)).toEqual({
      success: true,
      data: {
        gender: 'FEMALE',
        calendarType: 'SOLAR',
        isLeapMonth: false,
        birthDate: '2002-01-01',
        birthTime: '06:30',
        nickname: '보살',
      },
    });
  });

  test("'몰라요'면 고른 시간이 있어도 birthTime 은 null 이다", () => {
    const result = validateSajuForm({ ...valid, birthTimeUnknown: true }, now);

    expect(result.success && result.data.birthTime).toBeNull();
  });

  test('시간을 고르지도 몰라요를 체크하지도 않으면 에러', () => {
    expect(validateSajuForm({ ...valid, birthTime: null }, now)).toEqual({
      success: false,
      fieldErrors: { birthTime: sajuErrorMessages.birthTime },
    });
  });

  test('윤달은 음력일 때만 보낸다', () => {
    const solar = validateSajuForm({ ...valid, isLeapMonth: true }, now);
    const lunar = validateSajuForm({ ...valid, calendarType: 'LUNAR', isLeapMonth: true }, now);

    expect(solar.success && solar.data.isLeapMonth).toBe(false);
    expect(lunar.success && lunar.data.isLeapMonth).toBe(true);
  });

  test.each([
    ['숫자 8자리가 아니면', '2002011', sajuErrorMessages.birthDateFormat],
    ['없는 날이면', '20020230', sajuErrorMessages.birthDateReal],
    ['1950년 이전이면', '19491231', sajuErrorMessages.birthDateRange],
    ['미래면', '20260914', sajuErrorMessages.birthDateRange],
  ])('생년월일이 %s 에러', (_, birthDate, message) => {
    const result = validateSajuForm({ ...valid, birthDate }, now);

    expect(result.success ? undefined : result.fieldErrors.birthDate).toBe(message);
  });

  test('음력은 30일까지 받는다', () => {
    expect(
      validateSajuForm({ ...valid, calendarType: 'LUNAR', birthDate: '20020230' }, now).success,
    ).toBe(true);
  });

  test.each([
    ['비어 있으면', ''],
    ['공백뿐이면', '   '],
    ['8자를 넘으면', '운명도꿰어야사랑이'],
  ])('닉네임이 %s 에러', (_, nickname) => {
    const result = validateSajuForm({ ...valid, nickname }, now);

    expect(result.success ? undefined : result.fieldErrors.nickname).toBe(
      sajuErrorMessages.nickname,
    );
  });

  test('닉네임 앞뒤 공백은 지우고 이모지는 한 글자로 센다', () => {
    const result = validateSajuForm({ ...valid, nickname: ' 보살🌙🌙🌙🌙🌙🌙 ' }, now);

    expect(result.success && result.data.nickname).toBe('보살🌙🌙🌙🌙🌙🌙');
  });

  test('여러 필드가 틀리면 에러를 함께 돌려준다', () => {
    const result = validateSajuForm(initialSajuFormValues, now);

    expect(result.success ? [] : Object.keys(result.fieldErrors).sort()).toEqual([
      'birthDate',
      'birthTime',
      'gender',
      'nickname',
    ]);
  });
});
