import { expect, test } from 'vitest';

import { resultDetailSchema, resultRequestSchema, resultSchema } from './result';

const validRequest = {
  nickname: '보살',
  birthDate: '2002-01-01',
  birthTime: '06:30',
  birthRegion: null,
  gender: 'MALE',
};

test('유효한 요청은 그대로 통과한다', () => {
  expect(resultRequestSchema.safeParse(validRequest).success).toBe(true);
});

test("태어난 시간을 '몰라요'로 두면 null 이어도 통과한다", () => {
  expect(resultRequestSchema.safeParse({ ...validRequest, birthTime: null }).success).toBe(true);
});

test('닉네임이 9자면 실패한다', () => {
  expect(resultRequestSchema.safeParse({ ...validRequest, nickname: '123456789' }).success).toBe(
    false,
  );
});

test('birthRegion 이 null 이 아니면 실패한다 (2026-09-13 결정)', () => {
  expect(resultRequestSchema.safeParse({ ...validRequest, birthRegion: '서울' }).success).toBe(
    false,
  );
});

test('birthDate 형식이 아니면 실패한다', () => {
  expect(resultRequestSchema.safeParse({ ...validRequest, birthDate: '20020101' }).success).toBe(
    false,
  );
});

const validResult = {
  resultId: '11111111-1111-4111-8111-111111111111',
  nickname: '보살',
  destiny: { title: '점지된 인연', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'A0', content: '내용' },
    { category: 'CHILDREN', grade: 'B+', content: '내용' },
    { category: 'LOVE', grade: 'SS', content: '내용' },
  ],
  luckyItem: '팔찌',
  luckyPlace: '동국대',
};

test('계약대로의 Result 는 통과한다', () => {
  expect(resultSchema.safeParse(validResult).success).toBe(true);
});

test('fortunes 가 3개가 아니면 실패한다', () => {
  expect(
    resultSchema.safeParse({ ...validResult, fortunes: [validResult.fortunes[0]] }).success,
  ).toBe(false);
});

test('ResultDetail 은 compatibilities 를 더 요구한다', () => {
  expect(resultDetailSchema.safeParse(validResult).success).toBe(false);
  expect(resultDetailSchema.safeParse({ ...validResult, compatibilities: [] }).success).toBe(true);
});
