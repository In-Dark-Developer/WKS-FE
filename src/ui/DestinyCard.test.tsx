import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { DestinyCard } from '@/ui/DestinyCard';

afterEach(cleanup);

function renderCard(title = '꽃길만 걷는 인연') {
  render(
    <DestinyCard
      description="설명 첫 줄"
      grades={[
        { label: '결혼운', grade: 'SS' },
        { label: '자녀운', grade: 'A+' },
        { label: '연애운', grade: 'B' },
      ]}
      nickname="달빛토끼"
      title={title}
      zodiac="PIG"
    />,
  );
}

test('닉네임·보살 이름·운명 제목·설명을 보인다', () => {
  renderCard();

  const card = screen.getByRole('region', { name: '달빛토끼님의 운명 카드' });
  expect(within(card).getByRole('heading', { name: '달빛토끼님의 운명 카드' })).toBeInTheDocument();
  expect(within(card).getByText('복복보살님이 당신의 운명을 점지했어요.')).toBeInTheDocument();
  expect(within(card).getByText('설명 첫 줄')).toBeInTheDocument();
  expect(within(card).getByRole('img', { name: '복복보살' })).toBeInTheDocument();
});

test('등급은 줄마다 이름과 스탬프 이미지로 읽힌다', () => {
  renderCard();

  expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
    '결혼운',
    '자녀운',
    '연애운',
  ]);
  expect(screen.getByRole('img', { name: 'SS 등급' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'A+ 등급' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'B 등급' })).toBeInTheDocument();
});

test('긴 운명 제목·설명도 말줄임 없이 전문을 그린다', () => {
  const longTitle = '깔깔깔깔깔깔깔깔깔깔깔깔';
  renderCard(longTitle);

  // 잘리지 않으므로 전체 문구를 따로 담을 title 속성도 없다 (PRD FR-3 — 합 120자 이내).
  expect(screen.getByText(longTitle)).not.toHaveAttribute('title');
});

test('제목 글자 수를 글자 크기 계산에 넘긴다', () => {
  renderCard('인연 하나에 뿌리내린 나무');

  // 긴 제목은 CSS 가 이 값으로 글자 크기를 줄여 한 줄에 둔다 (DestinyCard.css).
  expect(
    screen.getByText('인연 하나에 뿌리내린 나무').style.getPropertyValue('--title-chars'),
  ).toBe('14');
});
