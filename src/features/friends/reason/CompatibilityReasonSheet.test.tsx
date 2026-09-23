import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { CompatibilityReasonSheet, ReasonAnswers } from './CompatibilityReasonSheet';

afterEach(cleanup);

const friend = { nickname: '달빛친구', score: 83, tier: 'GUIIN', compatibilityId: 12 } as const;

test('준비되면 고른 친구 줄과 세 질문의 답을 보인다 — 첫 질문은 등급 이름을 넣는다', () => {
  render(
    <CompatibilityReasonSheet friend={friend} onClose={() => {}} rank={2}>
      <ReasonAnswers
        state={{ status: 'ready', why: '왜 답', together: '함께 답', conflict: '다툼 답' }}
        tier="GUIIN"
      />
    </CompatibilityReasonSheet>,
  );

  const sheet = screen.getByRole('dialog', { name: '달빛친구님과의 궁합 이유' });
  expect(within(sheet).getByText('달빛친구')).toBeInTheDocument();
  expect(within(sheet).getByRole('heading', { name: '왜 나에게 귀인일까요?' })).toBeInTheDocument();
  expect(within(sheet).getByText('왜 답')).toBeInTheDocument();
  expect(within(sheet).getByText('함께 답')).toBeInTheDocument();
  expect(within(sheet).getByRole('heading', { name: '둘이 싸우게 된다면?' })).toBeInTheDocument();
  expect(within(sheet).getByText('다툼 답')).toBeInTheDocument();
});

test('생성 중에는 질문 제목과 로딩 안내를 보이고 답은 비워 둔다', () => {
  render(<ReasonAnswers state={{ status: 'loading' }} tier="GUIIN" />);

  expect(screen.getByRole('status')).toHaveTextContent('인연을 풀어보는 중');
  expect(screen.getByRole('heading', { name: '둘이 만나게 된다면?' })).toBeInTheDocument();
  expect(screen.queryByText('왜 답')).not.toBeInTheDocument();
});

test('실패하면 오류와 다시 시도를 보인다', () => {
  const onRetry = vi.fn();
  render(<ReasonAnswers onRetry={onRetry} state={{ status: 'error' }} tier="GUIIN" />);

  expect(screen.getByRole('alert')).toHaveTextContent('궁합 이유를 풀어내지 못했어요');
  fireEvent.click(screen.getByRole('button', { name: '다시 시도하기' }));
  expect(onRetry).toHaveBeenCalled();
});
