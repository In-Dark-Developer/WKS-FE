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
      score: 92,
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

test('보낸 신청 줄은 궁합 점수 대신 요청 상태를 보인다 (Figma 390:2842)', () => {
  renderInbox();

  const pending = screen.getByRole('button', { name: /차은호/ });
  expect(pending).toHaveTextContent('신청중');
  expect(pending).not.toHaveTextContent('98');
  expect(screen.getByRole('button', { name: /김채원/ })).toHaveTextContent('거절됨');
});

test('받은 신청 줄은 요청 상태 대신 궁합 점수를 보인다 (Figma 109:2251)', () => {
  renderInbox();
  fireEvent.click(screen.getByRole('tab', { name: '받은 신청' }));

  const row = screen.getByRole('button', { name: /이도윤/ });
  expect(row).toHaveTextContent('궁합점수');
  expect(row).toHaveTextContent('92점');
  expect(row).not.toHaveTextContent('신청중');
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

// QA(2026-09-28): 카드 아래 버튼이 26px 로 납작했다 — Figma cardbutton 처럼 글줄 24px(높이 32px)이다.
test('받은 신청 카드의 두 버튼은 Figma cardbutton 글줄(24px)을 갖는다', () => {
  renderInbox();

  fireEvent.click(screen.getByRole('tab', { name: '받은 신청' }));
  fireEvent.click(screen.getByRole('button', { name: /이도윤/ }));

  for (const name of ['인연이 되고 싶어요', '다음 기회에...']) {
    expect(screen.getByRole('button', { name })).toHaveClass('py-4', 'leading-[24px]');
  }
});
