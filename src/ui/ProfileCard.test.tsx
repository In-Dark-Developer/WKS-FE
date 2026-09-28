import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { ProfileCard } from './ProfileCard';

afterEach(cleanup);

function renderCard(initialFace?: 'front' | 'back') {
  return render(
    <ProfileCard
      back={<p>뒷면 내용</p>}
      background={<span />}
      front={<p>앞면 내용</p>}
      initialFace={initialFace}
    />,
  );
}

test('처음에는 앞면만 보이고, 뒤집으면 뒷면만 보인다', () => {
  renderCard();

  expect(screen.getByText('앞면 내용')).toBeVisible();
  expect(screen.getByText('뒷면 내용')).not.toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: '카드 뒤집기' }));

  expect(screen.getByRole('button', { name: '카드 뒤집기' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(screen.getByText('뒷면 내용')).toBeVisible();
  expect(screen.getByText('앞면 내용')).not.toBeVisible();
});

test('initialFace 로 뒷면부터 보일 수 있다', () => {
  renderCard('back');

  expect(screen.getByText('뒷면 내용')).toBeVisible();
});

test('뒷면이 없으면 뒤집기 버튼이 없다', () => {
  render(<ProfileCard background={<span />} front={<p>빈 카드</p>} />);

  expect(screen.queryByRole('button', { name: '카드 뒤집기' })).not.toBeInTheDocument();
});

// QA(2026-09-28): 사진 위 '카드 뒤집기' 칩에 채움이 없어 밝은 사진에서 글자가 묻혔다(Figma 134:2275 흰색 18%).
test('카드 뒤집기 칩은 반투명 채움과 테두리를 갖는다', () => {
  render(<ProfileCard back={<p>뒷면</p>} background={<div />} front={<p>앞면</p>} />);

  expect(screen.getByRole('button', { name: '카드 뒤집기' })).toHaveClass(
    'bg-opacity-card-neutral-0-18',
    'border-neutral-100',
    'backdrop-blur-sm',
  );
});
