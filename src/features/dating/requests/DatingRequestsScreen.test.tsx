import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

const { acceptMock, rejectMock } = vi.hoisted(() => ({ acceptMock: vi.fn(), rejectMock: vi.fn() }));
vi.mock('@/api/matchRequests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/matchRequests')>();
  return { ...actual, acceptDatingRequest: acceptMock, rejectDatingRequest: rejectMock };
});

import {
  ACCEPTED_MESSAGE,
  CANCEL_UNAVAILABLE_MESSAGE,
  DatingRequestsScreen,
} from './DatingRequestsScreen';
import type { ReceivedRequestView, RequestInboxView, SentRequestView } from './requestsView';

const hidden = {
  rank: null,
  score: null,
  mbti: '',
  bio: '',
  photo: { isLocked: true as const, thumbnailUrl: null, cost: 0 },
  name: { isLocked: true as const, cost: 0 },
  department: { isLocked: true as const, cost: 0 },
  reason: { isLocked: true as const, cost: 0 },
};

const received: ReceivedRequestView = {
  ...hidden,
  id: 'r1',
  relationLabel: '나를 찾아온 인연',
  status: 'PENDING',
};

const sentPending: SentRequestView = {
  ...hidden,
  id: 's1',
  relationLabel: '보낸 인연',
  status: 'PENDING',
};

function renderScreen(view: RequestInboxView, initialTab: 'sent' | 'received') {
  const router = createMemoryRouter(
    [
      {
        path: '/dating/requests',
        element: <DatingRequestsScreen initialTab={initialTab} view={view} />,
      },
    ],
    { initialEntries: ['/dating/requests'] },
  );
  render(<RouterProvider router={router} />);
}

afterEach(() => {
  cleanup();
  acceptMock.mockReset();
  rejectMock.mockReset();
  vi.restoreAllMocks();
});

test('받은 신청을 수락하면 성립을 알린다 (FR-30)', async () => {
  acceptMock.mockResolvedValue({ ok: true, data: { requestId: 'r1', status: 'ACCEPTED' } });
  renderScreen({ sent: [], received: [received] }, 'received');

  fireEvent.click(screen.getByRole('button', { name: /이름을 열지 않은 인연/ }));
  fireEvent.click(await screen.findByRole('button', { name: '인연이 되고 싶어요' }));

  expect(await screen.findByRole('status')).toHaveTextContent(ACCEPTED_MESSAGE);
  expect(acceptMock).toHaveBeenCalledWith('r1');
});

test('받은 신청을 거절하면 거절 요청만 보낸다', async () => {
  rejectMock.mockResolvedValue({ ok: true, data: { requestId: 'r1', status: 'REJECTED' } });
  renderScreen({ sent: [], received: [received] }, 'received');

  fireEvent.click(screen.getByRole('button', { name: /이름을 열지 않은 인연/ }));
  fireEvent.click(await screen.findByRole('button', { name: '다음 기회에...' }));

  await vi.waitFor(() => expect(rejectMock).toHaveBeenCalledWith('r1'));
  expect(acceptMock).not.toHaveBeenCalled();
});

test('성립한 신청은 카드에 상대 연락처를 보인다', async () => {
  renderScreen(
    {
      sent: [
        { ...sentPending, status: 'MATCHED', contact: { method: 'PHONE', value: '010-3333-3333' } },
      ],
      received: [],
    },
    'sent',
  );

  fireEvent.click(screen.getByRole('button', { name: /이름을 열지 않은 인연/ }));

  expect(await screen.findByText('전화번호 010-3333-3333')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '요청 취소' })).not.toBeInTheDocument();
});

test('요청 취소는 백엔드 경로가 없어 안내만 한다', async () => {
  renderScreen({ sent: [sentPending], received: [] }, 'sent');

  fireEvent.click(screen.getByRole('button', { name: /이름을 열지 않은 인연/ }));
  fireEvent.click(await screen.findByRole('button', { name: '요청 취소' }));

  expect(await screen.findByRole('status')).toHaveTextContent(CANCEL_UNAVAILABLE_MESSAGE);
});
