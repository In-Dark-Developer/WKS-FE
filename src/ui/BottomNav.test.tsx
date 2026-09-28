import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { BottomNav } from './BottomNav';

const items = [
  { id: 'home', label: '홈', icon: 'home.svg' },
  { id: 'map', label: '궁합지도', icon: 'map.svg' },
  { id: 'dating', label: '소개팅', icon: 'heart.svg' },
] as const;

afterEach(cleanup);

test('탭을 모두 버튼으로 보이고 선택한 탭만 현재 위치로 알린다', () => {
  render(<BottomNav activeId="map" items={items} onSelect={() => {}} />);

  const nav = screen.getByRole('navigation', { name: '주요 메뉴' });
  expect(nav).toBeInTheDocument();
  expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
    '홈',
    '궁합지도',
    '소개팅',
  ]);
  expect(screen.getByRole('button', { name: '궁합지도' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('button', { name: '홈' })).not.toHaveAttribute('aria-current');
});

test('누른 탭의 id 를 알린다', () => {
  const onSelect = vi.fn();
  render(<BottomNav items={items} onSelect={onSelect} />);

  fireEvent.click(screen.getByRole('button', { name: '소개팅' }));

  expect(onSelect).toHaveBeenCalledWith('dating');
});
