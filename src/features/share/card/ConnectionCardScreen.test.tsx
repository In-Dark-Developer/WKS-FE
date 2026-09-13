import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { ConnectionCardScreen } from './ConnectionCardScreen';

const shareCardImage = vi.fn();
vi.mock('./shareCardImage', () => ({
  shareCardImage: (...args: unknown[]) => shareCardImage(...args),
}));

const card = {
  nickname: '달빛토끼',
  zodiac: 'PIG',
  title: '이런 운명',
  description: '설명',
  grades: [
    { label: '결혼운', grade: 'SS' },
    { label: '자녀운', grade: 'A+' },
    { label: '연애운', grade: 'B' },
  ],
  shareId: 'abc',
} as const;

beforeEach(() => {
  shareCardImage.mockResolvedValue('shared');
});

afterEach(() => {
  cleanup();
  shareCardImage.mockReset();
  vi.restoreAllMocks();
});

function storyButton() {
  return screen.getByRole('button', { name: '인스타 스토리 공유하기' });
}

test('카드와 공유 버튼 두 개를 보여준다', () => {
  render(<ConnectionCardScreen {...card} />);

  expect(storyButton()).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '친구에게 공유' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '카드 뒤집기' })).toBeInTheDocument();
});

test('스토리 공유는 카드 앞면만 넘긴다', async () => {
  render(<ConnectionCardScreen {...card} />);
  fireEvent.click(storyButton());

  await screen.findByRole('button', { name: '인스타 스토리 공유하기' });
  const [node, nickname] = shareCardImage.mock.calls[0] ?? [];
  expect(node).toBeInstanceOf(HTMLElement);
  expect(node instanceof HTMLElement ? node.dataset.destinyCard : null).toBe('');
  expect(nickname).toBe('달빛토끼');
});

test('만드는 동안 버튼이 잠긴다', async () => {
  let release: ((value: string) => void) | undefined;
  shareCardImage.mockImplementation(
    () =>
      new Promise<string>((resolve) => {
        release = resolve;
      }),
  );

  render(<ConnectionCardScreen {...card} />);
  fireEvent.click(storyButton());

  const busy = await screen.findByRole('button', { name: '카드를 그리는 중' });
  expect(busy).toBeDisabled();

  release?.('shared');
  await screen.findByRole('button', { name: '인스타 스토리 공유하기' });
});

test('저장으로 물러나면 담았다고 알린다', async () => {
  shareCardImage.mockResolvedValue('saved');

  render(<ConnectionCardScreen {...card} />);
  fireEvent.click(storyButton());

  expect(await screen.findByRole('status')).toHaveTextContent('기기에 담았느니라');
});

test('공유 시트로 넘어가면 안내를 띄우지 않는다', async () => {
  render(<ConnectionCardScreen {...card} />);
  fireEvent.click(storyButton());

  await screen.findByRole('button', { name: '인스타 스토리 공유하기' });
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('실패하면 재시도 안내가 뜨고 원인은 숨긴다', async () => {
  shareCardImage.mockRejectedValue(new Error('foreignObject 렌더 실패'));

  render(<ConnectionCardScreen {...card} />);
  fireEvent.click(storyButton());

  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent('다시 눌러 보아라');
  expect(alert).not.toHaveTextContent('foreignObject');
});
