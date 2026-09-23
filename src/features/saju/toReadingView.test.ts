import { expect, test } from 'vitest';

import type { Result } from '@/api/schema/result';

import { toReadingView } from './toReadingView';

const marriage = { category: 'MARRIAGE', grade: 'SS', content: '결혼운 내용' } as const;
const children = { category: 'CHILDREN', grade: 'A+', content: '자녀운 내용' } as const;
const love = { category: 'LOVE', grade: 'B', content: '연애운 내용' } as const;

const result: Result = {
  resultId: 'r1',
  shareId: 's1',
  nickname: '달빛토끼',
  zodiac: 'PIG',
  destiny: { title: '꽃길만 걷는 인연', description: '설명' },
  fortunes: [marriage, children, love],
  luckyPlace: '만해광장',
  elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
  luckyItem: '책',
  compatibilities: [],
};

test('fortunes 배열을 카테고리별 key 로 바꾼다', () => {
  const view = toReadingView(result);

  expect(view).toEqual({
    nickname: '달빛토끼',
    zodiac: 'PIG',
    destiny: { title: '꽃길만 걷는 인연', description: '설명' },
    fortunes: {
      marriage: { grade: 'SS', content: '결혼운 내용' },
      children: { grade: 'A+', content: '자녀운 내용' },
      love: { grade: 'B', content: '연애운 내용' },
    },
    luckyPlace: '만해광장',
    elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
    luckyItem: '책',
    shareId: 's1',
    elementMatch: null,
    friends: [],
  });
});

test('잘 맞는 오행을 오행 key 로 바꾸고, 옛 결과(null·키 없음)는 null 로 둔다', () => {
  const withMatch: Result = {
    ...result,
    elementMatch: { element: 'EARTH', korean: '토', reason: '흙의 기운이 당신을 살려요.' },
  };

  expect(toReadingView(withMatch).elementMatch).toEqual({
    element: 'earth',
    korean: '토',
    reason: '흙의 기운이 당신을 살려요.',
  });
  expect(toReadingView({ ...result, elementMatch: null }).elementMatch).toBeNull();
  expect(toReadingView(result).elementMatch).toBeNull();
});

test('궁합을 상대 닉네임의 친구 목록으로 바꾸고 점수 높은 순으로 둔다', () => {
  const withFriends: Result = {
    ...result,
    compatibilities: [
      // 응답 순서는 createdAt 내림차순이고 nickname 은 백엔드가 고른 상대 닉네임이다.
      { nickname: '민수', score: 61, tier: 'BEOT', createdAt: '2026-09-15T03:00:00Z' },
      { nickname: '서연', score: 92, tier: 'GUIIN', createdAt: '2026-09-15T02:00:00Z' },
      { nickname: '지현', score: 75, tier: 'CHALTTEOK', createdAt: '2026-09-15T01:00:00Z' },
    ],
  };

  expect(toReadingView(withFriends).friends).toEqual([
    { nickname: '서연', score: 92, tier: 'GUIIN' },
    { nickname: '지현', score: 75, tier: 'CHALTTEOK' },
    { nickname: '민수', score: 61, tier: 'BEOT' },
  ]);
});

test('fortunes 순서가 바뀌어도 카테고리로 찾는다', () => {
  const reordered: Result = { ...result, fortunes: [love, marriage, children] };

  expect(toReadingView(reordered).fortunes.love.grade).toBe('B');
});

test('카테고리가 계약과 다르면(누락) 던진다', () => {
  const broken: Result = { ...result, fortunes: [marriage, marriage] };

  expect(() => toReadingView(broken)).toThrow();
});
