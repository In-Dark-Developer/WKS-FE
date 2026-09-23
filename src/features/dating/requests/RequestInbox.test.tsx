import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { RequestInbox } from './RequestInbox';
import type { RequestInboxView, RequestProfileView } from './requestsView';

afterEach(cleanup);

const profile: RequestProfileView = {
  id: 'p',
  rank: 1,
  score: 98,
  relationLabel: '천생연분',
  mbti: 'ENTP',
  bio: '영화를 좋아해요.',
  photo: { isLocked: true, thumbnailUrl: '/thumb.webp', cost: 10 },
  name: { isLocked: false, value: '차은호' },
  department: { isLocked: true, cost: 5 },
  reason: { isLocked: true, cost: 3 },
};

const view: RequestInboxView = {
  sent: [
    { ...profile, id: 's1', status: 'PENDING' },
    { ...profile, id: 's2', status: 'FAILED', name: { isLocked: false, value: '김채원' } },
  ],
  received: [
    {
      ...profile,
      id: 'r1',
      rank: null,
      score: null,
      name: { isLocked: false, value: '이도윤' },
      photo: { isLocked: false, url: '/photo.webp' },
      department: { isLocked: false, value: '경영학과' },
      reason: { isLocked: false, value: '서로를 채워 줘요.' },
    },
  ],
};

function renderInbox() {
  const handlers = { onCancel: vi.fn(), onAccept: vi.fn(), onDecline: vi.fn() };
  render(<RequestInbox onBack={vi.fn()} view={view} {...handlers} />);
  return handlers;
}

test('보낸 신청 목록이 먼저 보이고, 받은 신청 탭에는 궁합 점수가 없다', () => {
  renderInbox();

  expect(screen.getByRole('button', { name: /차은호/ })).toHaveTextContent('98점');
  fireEvent.click(screen.getByRole('tab', { name: '받은 신청' }));

  expect(screen.getByRole('button', { name: /이도윤/ })).not.toHaveTextContent('점');
});

test('기다리는 보낸 신청은 카드에서 취소하고, 뒷면에서 더 열 수 없다', () => {
  const { onCancel } = renderInbox();

  fireEvent.click(screen.getByRole('button', { name: /차은호/ }));
  const card = screen.getByRole('dialog', { name: '신청한 인연 카드' });
  expect(within(card).queryByRole('button', { name: /개로 열기/ })).toBeNull();
  expect(within(card).queryByRole('button', { name: '열람하기' })).toBeNull();
  fireEvent.click(within(card).getByRole('button', { name: '요청 취소' }));

  expect(onCancel).toHaveBeenCalledWith('s1');
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('실패한 보낸 신청은 버튼 없이 매칭에 실패했어요를 보인다', () => {
  renderInbox();

  fireEvent.click(screen.getByRole('button', { name: /김채원/ }));
  const card = screen.getByRole('dialog', { name: '신청한 인연 카드' });

  expect(within(card).getByText('매칭에 실패했어요')).toBeVisible();
  expect(within(card).queryByRole('button', { name: '요청 취소' })).toBeNull();
});

test('받은 신청은 수락·거절을 그 신청 id 로 넘긴다', () => {
  const { onAccept, onDecline } = renderInbox();

  fireEvent.click(screen.getByRole('tab', { name: '받은 신청' }));
  fireEvent.click(screen.getByRole('button', { name: /이도윤/ }));
  fireEvent.click(screen.getByRole('button', { name: '인연이 되고 싶어요' }));
  expect(onAccept).toHaveBeenCalledWith('r1');

  fireEvent.click(screen.getByRole('button', { name: /이도윤/ }));
  fireEvent.click(screen.getByRole('button', { name: '다음 기회에...' }));
  expect(onDecline).toHaveBeenCalledWith('r1');
});
