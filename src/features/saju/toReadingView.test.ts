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
    friends: [],
  });
});

test('궁합을 상대 닉네임의 친구 목록으로 바꾸고 점수 높은 순으로 둔다', () => {
  const withFriends: Result = {
    ...result,
    compatibilities: [
      // 내가 링크 주인이면 상대는 방문자, 내가 방문자면 상대는 링크 주인이다.
      { score: 61, tier: 'BEOT', originNickname: result.nickname, guestNickname: '민수' },
      { score: 92, tier: 'GUIIN', originNickname: '서연', guestNickname: result.nickname },
      { score: 75, tier: 'CHALTTEOK', originNickname: result.nickname, guestNickname: '지현' },
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
