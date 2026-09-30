import { cleanup, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

const { claimPartnerRewardMock, getWalletMock } = vi.hoisted(() => ({
  claimPartnerRewardMock: vi.fn(),
  getWalletMock: vi.fn(),
}));
vi.mock('@/api/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/wallet')>();
  return { ...actual, claimPartnerReward: claimPartnerRewardMock, getWallet: getWalletMock };
});

import { RootLayout } from './RootLayout';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  claimPartnerRewardMock.mockReset();
  getWalletMock.mockReset();
});

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <p>입력</p> },
          {
            path: 'reading/:id',
            handle: { backdrop: 'result' },
            element: <p>결과</p>,
            children: [
              { path: 'pre-register', handle: { backdrop: 'mist' }, element: <p>신청</p> },
            ],
          },
          { path: 'odd', handle: { backdrop: 'neon' }, element: <p>이상한 값</p> },
        ],
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
}

test.each([
  ['/', '입력', 'dawn'],
  ['/reading/abc', '결과', 'result'],
  ['/reading/abc/pre-register', '결과', 'mist'],
  ['/odd', '이상한 값', 'dawn'],
])('%s 는 가장 깊은 라우트 handle 의 배경을 쓴다', async (path, text, backdrop) => {
  renderAt(path);

  expect(await screen.findByText(text)).toBeInTheDocument();
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', backdrop);
});

test('로그인한 채 제휴 링크로 들어오면 첫 화면이 그려진 뒤 도착한 지급도 알린다 (FR-32)', async () => {
  sessionStorage.setItem('wks:partner-ref', 'FESTIVAL');
  const reward = { partnerName: '동국대 축제', amount: 10 };
  let resolveClaim: (value: unknown) => void = () => {};
  claimPartnerRewardMock.mockReturnValue(
    new Promise((resolve) => {
      resolveClaim = resolve;
    }),
  );
  getWalletMock.mockResolvedValue({ ok: true, data: { balance: 20, canCheckInToday: false } });

  renderAt('/');
  expect(await screen.findByText('입력')).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  resolveClaim({ ok: true, data: { rewardGranted: reward, balance: 20 } });

  expect(await screen.findByRole('dialog')).toHaveTextContent('운명의 실 10개를 드렸어요');
});
