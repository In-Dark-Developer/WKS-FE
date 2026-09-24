import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { ShareEntryChoice } from './ShareEntryChoice';

afterEach(cleanup);

function renderChoice(handlers: { onReusePrevious?: () => void; onWriteNew?: () => void } = {}) {
  render(
    <ShareEntryChoice
      onReusePrevious={handlers.onReusePrevious ?? vi.fn()}
      onWriteNew={handlers.onWriteNew ?? vi.fn()}
      ownerFriends={[{ nickname: '민지', score: 95, tier: 'GUIIN' }]}
      ownerNickname="서연"
    />,
  );
}

test('초대 제목과 링크 주인의 궁합 지도, 두 선택지를 보인다', () => {
  renderChoice();

  expect(
    screen.getByRole('heading', { level: 1, name: '서연님의궁합지도에 초대됐어요' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('region', { name: '서연님의 궁합 지도' })).toHaveTextContent('민지');
  expect(screen.getByText(/이미 작성된 데이터가 남아있어요/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '이전 정보 불러오기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '새로 작성하기' })).toBeInTheDocument();
});

test('누른 선택지의 콜백만 부른다', () => {
  const onReusePrevious = vi.fn();
  const onWriteNew = vi.fn();
  renderChoice({ onReusePrevious, onWriteNew });

  fireEvent.click(screen.getByRole('button', { name: '새로 작성하기' }));
  expect(onWriteNew).toHaveBeenCalledOnce();
  expect(onReusePrevious).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: '이전 정보 불러오기' }));
  expect(onReusePrevious).toHaveBeenCalledOnce();
});
