import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import { ContentState } from './ContentState';

afterEach(cleanup);

describe('ContentState', () => {
  test('로딩 상태를 진행 중인 status로 알린다', () => {
    render(<ContentState state="loading" />);

    const state = screen.getByRole('status');

    expect(state).toHaveAttribute('aria-busy', 'true');
    expect(state).toHaveTextContent('보살님이 살펴보고 있어요');
  });

  test('에러 상태는 보살 말투의 alert로 알린다', () => {
    render(<ContentState state="error" />);

    expect(screen.getByRole('alert')).toHaveTextContent('보살님이 잠시 길을 잃었어요');
  });

  test('빈 상태는 화면 맥락에 맞는 문구와 액션을 받는다', () => {
    render(
      <ContentState
        action={<button type="button">친구에게 공유하기</button>}
        description="친구를 초대하면 인연이 나타나요."
        state="empty"
        title="아직 인연이 없어요"
      />,
    );

    const state = screen.getByRole('status');

    expect(state).toHaveTextContent('아직 인연이 없어요');
    expect(state).toHaveTextContent('친구를 초대하면 인연이 나타나요.');
    expect(screen.getByRole('button', { name: '친구에게 공유하기' })).toBeInTheDocument();
  });
});
