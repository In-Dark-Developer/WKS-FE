import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { ResendMail } from './ResendMail';

afterEach(cleanup);

function clickResend(result: unknown) {
  const action = vi.fn(async ({ request }: { request: Request }) => {
    await request.json();
    return result;
  });
  const router = createMemoryRouter(
    [{ path: '/', element: <ResendMail email="wks@dongguk.edu" />, action }],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
  fireEvent.click(screen.getByRole('button', { name: '인증 메일 다시 받기' }));
  return action;
}

test('재발송 요청을 route action 에 보내고 성공하면 버튼을 거둔다', async () => {
  const action = clickResend({ resend: 'sent' });

  expect(await screen.findByRole('status')).toHaveTextContent('인증 메일을 다시 보냈어요.');
  const request = action.mock.calls[0]![0].request;
  expect(action).toHaveBeenCalledOnce();
  expect(request.method).toBe('POST');
  expect(screen.queryByRole('button', { name: '인증 메일 다시 받기' })).not.toBeInTheDocument();
});

test('또 보내지 못하면 다시 시도하게 버튼을 남긴다', async () => {
  clickResend({ resend: 'failed' });

  expect(await screen.findByRole('status')).toHaveTextContent('지금은 메일을 보내지 못했어요.');
  expect(screen.getByRole('button', { name: '인증 메일 다시 받기' })).toBeEnabled();
});

test('이미 인증을 마친 이메일이면 그렇다고 알린다', async () => {
  clickResend({ resend: 'verified' });

  expect(await screen.findByRole('status')).toHaveTextContent('이미 인증을 마친 이메일이에요.');
  expect(screen.queryByRole('button', { name: '인증 메일 다시 받기' })).not.toBeInTheDocument();
});
