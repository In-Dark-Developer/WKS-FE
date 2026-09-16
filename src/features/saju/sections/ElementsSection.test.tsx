import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { ElementsSection } from './ElementsSection';

afterEach(cleanup);

test('목·화·토·금·수 순서로 개수를 읽을 수 있게 보이고 막대를 개수만큼 채운다', () => {
  const { container } = render(
    <ElementsSection elements={{ wood: 3, fire: 2, earth: 0, metal: 1, water: 2 }} />,
  );

  expect(container.querySelector('dl')).toHaveAttribute('aria-label', '오행 분포');
  expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
    '목',
    '화',
    '토',
    '금',
    '수',
  ]);
  expect(screen.getAllByRole('definition').map((value) => value.textContent)).toEqual([
    '3개',
    '2개',
    '0개',
    '1개',
    '2개',
  ]);
  const wood = container.querySelector('[data-element="wood"]') as HTMLElement;
  expect(wood.querySelectorAll('[data-filled]')).toHaveLength(3);
  expect(within(wood).getByText('목').closest('dt')?.querySelector('img')).toBeInTheDocument();
});

test('막대는 8칸이고 8개를 넘는 값은 8칸까지만 채운다', () => {
  const { container } = render(
    <ElementsSection elements={{ wood: 9, fire: 0, earth: 0, metal: 0, water: 0 }} />,
  );

  const wood = container.querySelector('[data-element="wood"]') as HTMLElement;
  expect(wood.querySelectorAll('[data-reading-element-bars] > span')).toHaveLength(8);
  expect(wood.querySelectorAll('[data-filled]')).toHaveLength(8);
});
