import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { ConnectionCard } from './ConnectionCard';

afterEach(cleanup);

function renderCard(initialFace?: 'front' | 'back') {
  render(
    <ConnectionCard
      description="설명"
      grades={[
        { label: '결혼운', grade: 'SS' },
        { label: '자녀운', grade: 'A+' },
        { label: '연애운', grade: 'B' },
      ]}
      initialFace={initialFace}
      nickname="달빛토끼"
      title="이런 운명"
      zodiac="PIG"
    />,
  );
}

test('앞면이 먼저 보이고 카드 뒤집기로 뒷면과 오간다', () => {
  renderCard();

  expect(screen.getByRole('region', { name: '달빛토끼님의 인연카드' })).toBeInTheDocument();
  expect(screen.queryByRole('img', { name: '운명도 꿰어야 사랑이다' })).not.toBeInTheDocument();

  const flip = screen.getByRole('button', { name: '카드 뒤집기' });
  fireEvent.click(flip);

  expect(flip).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('img', { name: '운명도 꿰어야 사랑이다' })).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: '달빛토끼님의 인연카드' })).not.toBeInTheDocument();

  fireEvent.click(flip);
  expect(screen.getByRole('region', { name: '달빛토끼님의 인연카드' })).toBeInTheDocument();
});

test('뒷면부터 보여 줄 수 있다', () => {
  renderCard('back');

  expect(screen.getByRole('img', { name: '운명도 꿰어야 사랑이다' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '카드 뒤집기' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});
