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

// QA(2026-09-28): 높이만 433px 로 고정돼 화면 폭이 바뀌면 비율이 깨졌다(360px 에서 328×433).
test('카드는 Figma 규격 비율(343:433)과 흰 테두리·radius 12 를 갖는다', () => {
  render(<ProfileCard background={<div />} front={<p>앞면</p>} />);

  const card = screen.getByText('앞면').closest('[data-face]');

  expect(card).toHaveClass('aspect-[343/433]', 'w-full', 'rounded-12', 'border-neutral-0');
  expect(card).not.toHaveClass('h-[433px]');
});
