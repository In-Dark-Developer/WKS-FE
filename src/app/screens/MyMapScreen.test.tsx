import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { MyMapScreen } from './MyMapScreen';

afterEach(cleanup);

const props = {
  nickname: '달빛토끼',
  shareId: 'b2c3d4e5-2222-4222-8222-222222222222',
  friends: [],
  onBack: () => undefined,
};

test('비로그인이면 저장 유도 카드가 궁합지도 저장 시트를 띄우고 카카오 로그인을 시작한다', () => {
  const onKakaoLogin = vi.fn();
  render(<MyMapScreen {...props} onKakaoLogin={onKakaoLogin} />);

  expect(screen.getByRole('heading', { name: '이 인연들을 계속 간직할까요?' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '로그인하고 저장하기 →' }));
  expect(screen.getByRole('heading', { name: '궁합지도 저장하기' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '카카오로 시작하기' }));
  expect(onKakaoLogin).toHaveBeenCalledOnce();
});

test('로그인 사용자에게는 저장 유도 카드가 없다', () => {
  render(<MyMapScreen {...props} />);

  expect(screen.queryByText('이 인연들을 계속 간직할까요?')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '로그인하고 저장하기 →' })).not.toBeInTheDocument();
});
