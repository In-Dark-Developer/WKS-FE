import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';

import { Card } from './Card';

test('header, media, body, footer 슬롯을 한 카드 안에 렌더한다', () => {
  render(
    <Card
      aria-label="운명 카드"
      header={<h2>나의 운명</h2>}
      media={<img alt="양 보살" src="/sheep.png" />}
      footer={<button type="button">공유하기</button>}
    >
      인연의 흐름이 맑아요.
    </Card>,
  );

  const card = screen.getByRole('region', { name: '운명 카드' });

  expect(within(card).getByRole('heading', { name: '나의 운명' })).toBeInTheDocument();
  expect(within(card).getByRole('img', { name: '양 보살' })).toBeInTheDocument();
  expect(within(card).getByText('인연의 흐름이 맑아요.')).toBeInTheDocument();
  expect(within(card).getByRole('button', { name: '공유하기' })).toBeInTheDocument();
});

test('선택 슬롯 없이 children만 렌더한다', () => {
  render(<Card aria-label="간단한 카드">카드 내용</Card>);

  expect(screen.getByRole('region', { name: '간단한 카드' })).toHaveTextContent('카드 내용');
});
