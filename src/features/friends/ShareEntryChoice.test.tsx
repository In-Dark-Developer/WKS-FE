import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { ShareEntryChoice } from './ShareEntryChoice';
import { ShareInvite } from './ShareInvite';

afterEach(cleanup);

test('초대 머리는 링크 주인 닉네임의 제목과 주인의 궁합 지도를 보인다 (FR-15)', () => {
  render(
    <ShareInvite
      ownerFriends={[{ nickname: '민지', score: 95, tier: 'GUIIN' }]}
      ownerNickname="서연"
    />,
  );

  expect(
    screen.getByRole('heading', { level: 1, name: '서연님의궁합지도에 초대됐어요' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('region', { name: '서연님의 궁합 지도' })).toHaveTextContent('민지');
});

test('선택 영역은 안내와 두 선택지를 보이고 누른 쪽의 콜백만 부른다 (FR-23)', () => {
  const onReusePrevious = vi.fn();
  const onWriteNew = vi.fn();
  render(<ShareEntryChoice onReusePrevious={onReusePrevious} onWriteNew={onWriteNew} />);

  expect(screen.getByText(/이미 작성된 데이터가 남아있어요/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '새로 작성하기' }));
  expect(onWriteNew).toHaveBeenCalledOnce();
  expect(onReusePrevious).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: '이전 정보 불러오기' }));
  expect(onReusePrevious).toHaveBeenCalledOnce();
});
