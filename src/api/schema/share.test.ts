import { expect, test } from 'vitest';

import { compatibilityRequestSchema, compatibilitySchema, sharedResultSchema } from './share';

// 운영 `GET /shares/{shareId}` 실제 응답 모양(2026-09-15 호출 대조).
const sharedResult = {
  nickname: '서연',
  zodiac: 'HORSE',
  destiny: { title: '사랑이 앞서 걷는 길', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'SS', content: '결혼운' },
    { category: 'CHILDREN', grade: 'A+', content: '자녀운' },
    { category: 'LOVE', grade: 'B', content: '연애운' },
  ],
  luckyItem: '파란 부채',
  luckyPlace: '팔정도 앞',
  compatibilities: [
    { nickname: '지현', score: 92, tier: 'GUIIN', createdAt: '2026-09-15T05:32:20.100339Z' },
  ],
};

const GUEST_ID = '3f2a9c1e-1234-4a1b-8c1a-abcdef123456';

test('공유 결과는 resultId·shareId 없이 통과한다', () => {
  expect(sharedResultSchema.safeParse(sharedResult).success).toBe(true);
});

test('공유 결과의 궁합 목록이 궁합 생성 응답 모양(닉네임 쌍)이면 실패한다', () => {
  const pairShape = {
    ...sharedResult,
    compatibilities: [{ score: 92, tier: 'GUIIN', originNickname: '서연', guestNickname: '지현' }],
  };
  expect(sharedResultSchema.safeParse(pairShape).success).toBe(false);
});

test('궁합 요청은 guestResultId UUID 가 있어야 한다', () => {
  expect(compatibilityRequestSchema.safeParse({ guestResultId: GUEST_ID }).success).toBe(true);
  expect(compatibilityRequestSchema.safeParse({ guestResultId: 'not-a-uuid' }).success).toBe(false);
  expect(compatibilityRequestSchema.safeParse({}).success).toBe(false);
});

test('궁합 응답은 점수·등급·두 닉네임 모양이다', () => {
  const valid = { score: 92, tier: 'GUIIN', originNickname: '도윤', guestNickname: '지현' };

  expect(compatibilitySchema.safeParse(valid).success).toBe(true);
  expect(compatibilitySchema.safeParse({ ...valid, score: 101 }).success).toBe(false);
  expect(compatibilitySchema.safeParse({ ...valid, tier: 'SOULMATE' }).success).toBe(false);
});
