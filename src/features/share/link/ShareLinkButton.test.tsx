import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { ShareLinkButton } from './ShareLinkButton';

// jsdom 에는 navigator.share·clipboard 가 없다 — 분기마다 필요한 것만 심고 끝나면 지운다.
function setNavigator(key: 'share' | 'clipboard', value: unknown): void {
  Object.defineProperty(navigator, key, { value, configurable: true, writable: true });
}

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'clipboard');
  vi.restoreAllMocks();
});

test('버튼을 누르면 현재 origin 의 공유 링크를 시트로 넘긴다', async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', share);

  render(<ShareLinkButton nickname="달빛토끼" shareId="abc" />);
  fireEvent.click(screen.getByRole('button', { name: '친구에게 공유' }));

  await screen.findByRole('button', { name: '친구에게 공유' });
  expect(share).toHaveBeenCalledWith(
    expect.objectContaining({ url: `${window.location.origin}/s/abc` }),
  );
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('공유 시트가 없으면 복사하고 복사했다고 알린다', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('clipboard', { writeText });

  render(<ShareLinkButton nickname="달빛토끼" shareId="abc" />);
  fireEvent.click(screen.getByRole('button', { name: '친구에게 공유' }));

  expect(await screen.findByRole('status')).toHaveTextContent('링크를 복사했느니라');
  expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/s/abc`);
  expect(screen.queryByLabelText('공유 링크')).not.toBeInTheDocument();
});

test('복사까지 막히면 링크를 직접 고를 수 있게 보여준다', async () => {
  render(<ShareLinkButton nickname="달빛토끼" shareId="abc" />);
  fireEvent.click(screen.getByRole('button', { name: '친구에게 공유' }));

  expect(await screen.findByLabelText('공유 링크')).toHaveValue(`${window.location.origin}/s/abc`);
  expect(screen.getByRole('status')).toHaveTextContent('직접 가져가라');
});

test('공유하는 동안에는 버튼을 다시 누를 수 없다', async () => {
  let release: (() => void) | undefined;
  setNavigator(
    'share',
    vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    ),
  );

  render(<ShareLinkButton nickname="달빛토끼" shareId="abc" />);
  fireEvent.click(screen.getByRole('button', { name: '친구에게 공유' }));

  const button = await screen.findByRole('button', { name: '인연을 부르는 중' });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-busy', 'true');

  release?.();
  await screen.findByRole('button', { name: '친구에게 공유' });
});
