import { expect, test } from 'vitest';

import { resultRequestSchema, resultSchema } from './result';

const validRequest = {
  nickname: '보살',
  calendarType: 'SOLAR',
  birthDate: '2002-01-01',
  birthTime: '06:30',
  gender: 'MALE',
};

test('유효한 요청은 그대로 통과한다', () => {
  expect(resultRequestSchema.safeParse(validRequest).success).toBe(true);
});

test("태어난 시간을 '몰라요'로 두면 null 이어도 통과한다", () => {
  expect(resultRequestSchema.safeParse({ ...validRequest, birthTime: null }).success).toBe(true);
});

test('음력이면 isLeapMonth 를 함께 보낼 수 있다', () => {
  expect(
    resultRequestSchema.safeParse({ ...validRequest, calendarType: 'LUNAR', isLeapMonth: true })
      .success,
  ).toBe(true);
});

test('닉네임이 9자면 실패한다', () => {
  expect(resultRequestSchema.safeParse({ ...validRequest, nickname: '123456789' }).success).toBe(
    false,
  );
});

test('calendarType 이 없으면 실패한다 (2026-09-13 r2 계약)', () => {
  const withoutCalendarType: Partial<typeof validRequest> = { ...validRequest };
  delete withoutCalendarType.calendarType;
  expect(resultRequestSchema.safeParse(withoutCalendarType).success).toBe(false);
});

test('birthDate 형식이 아니면 실패한다', () => {
  expect(resultRequestSchema.safeParse({ ...validRequest, birthDate: '20020101' }).success).toBe(
    false,
  );
});

const validResult = {
  resultId: '11111111-1111-4111-8111-111111111111',
  shareId: '22222222-2222-4222-8222-222222222222',
  nickname: '보살',
  zodiac: 'DRAGON',
  destiny: { title: '점지된 인연', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'A', content: '내용' },
    { category: 'CHILDREN', grade: 'B+', content: '내용' },
    { category: 'LOVE', grade: 'SS', content: '내용' },
  ],
  luckyItem: '팔찌',
  luckyPlace: '동국대',
  compatibilities: [],
};

test('계약대로의 Result 는 통과한다', () => {
  expect(resultSchema.safeParse(validResult).success).toBe(true);
});

test('fortunes 가 3개가 아니면 실패한다', () => {
  expect(
    resultSchema.safeParse({ ...validResult, fortunes: [validResult.fortunes[0]] }).success,
  ).toBe(false);
});

test('grade 가 6단계 밖이면 실패한다 (2026-09-13 r2 계약)', () => {
  const invalidFortunes = [
    { ...validResult.fortunes[0], grade: 'A0' },
    ...validResult.fortunes.slice(1),
  ];
  expect(resultSchema.safeParse({ ...validResult, fortunes: invalidFortunes }).success).toBe(false);
});

test('compatibilities 가 없으면 실패한다', () => {
  const withoutCompatibilities: Partial<typeof validResult> = { ...validResult };
  delete withoutCompatibilities.compatibilities;
  expect(resultSchema.safeParse(withoutCompatibilities).success).toBe(false);
});
