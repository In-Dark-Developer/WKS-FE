import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

const { completeKakaoLoginMock } = vi.hoisted(() => ({ completeKakaoLoginMock: vi.fn() }));
vi.mock('@/features/auth', () => ({ completeKakaoLogin: completeKakaoLoginMock }));

import type { CompleteKakaoLoginResult } from '@/features/auth';

import { KakaoCallbackPage, kakaoCallbackLoader } from './KakaoCallbackPage';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderWithResult(result: CompleteKakaoLoginResult) {
  const router = createMemoryRouter(
    [{ path: '/dev/kakao-callback', element: <KakaoCallbackPage />, loader: () => result }],
    { initialEntries: ['/dev/kakao-callback'] },
  );
  return render(<RouterProvider router={router} />);
}

test('loader 는 쿼리를 뺀 origin+pathname 을 redirectUri 로 completeKakaoLogin 을 부른다', async () => {
  completeKakaoLoginMock.mockResolvedValue({ kind: 'missing-code' });
  const url = 'http://localhost:5173/dev/kakao-callback?code=abc&state=xyz';
  const request = new Request(url);

  await kakaoCallbackLoader({
    request,
    params: {},
    context: {},
    url: new URL(url),
    pattern: '/dev/kakao-callback',
  });

  expect(completeKakaoLoginMock).toHaveBeenCalledTimes(1);
  const [searchParams, redirectUri] = completeKakaoLoginMock.mock.calls[0] as [
    URLSearchParams,
    string,
  ];
  expect(redirectUri).toBe('http://localhost:5173/dev/kakao-callback');
  expect(searchParams.get('code')).toBe('abc');
});

test('성공하면 성공 화면을 보여준다', async () => {
  renderWithResult({
    kind: 'success',
    data: { token: 't', isNewUser: true, restoredResultId: null, rewardGranted: null },
  });

  expect(await screen.findByText('로그인 성공')).toBeInTheDocument();
});

test('카카오 에러면 원인 문구를 함께 보여준다', async () => {
  renderWithResult({ kind: 'kakao-error', error: 'access_denied' });

  expect(await screen.findByText('카카오 로그인 취소·실패')).toBeInTheDocument();
  expect(screen.getByText('access_denied')).toBeInTheDocument();
});

test('state 불일치면 안내를 보여준다', async () => {
  renderWithResult({ kind: 'state-mismatch' });

  expect(await screen.findByText('state 불일치')).toBeInTheDocument();
});

test('테스트 화면으로 돌아가는 링크가 있다', async () => {
  renderWithResult({ kind: 'missing-code' });

  const link = await screen.findByRole('link', { name: '테스트 화면으로 돌아가기' });
  expect(link).toHaveAttribute('href', '/dev/kakao');
});
