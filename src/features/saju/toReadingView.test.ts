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
    luckyItem: '책',
    shareId: 's1',
    compatibilities: [],
  });
});

test('compatibilities 를 그대로 전달한다(ranking 슬롯이 쓴다)', () => {
  const withFriends: Result = {
    ...result,
    compatibilities: [
      { nickname: '친구1', score: 92, tier: 'GUIIN', createdAt: '2026-09-13T00:00:00Z' },
    ],
  };

  expect(toReadingView(withFriends).compatibilities).toEqual(withFriends.compatibilities);
});

test('fortunes 순서가 바뀌어도 카테고리로 찾는다', () => {
  const reordered: Result = { ...result, fortunes: [love, marriage, children] };

  expect(toReadingView(reordered).fortunes.love.grade).toBe('B');
});

test('카테고리가 계약과 다르면(누락) 던진다', () => {
  const broken: Result = { ...result, fortunes: [marriage, marriage] };

  expect(() => toReadingView(broken)).toThrow();
});
