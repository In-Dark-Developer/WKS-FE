import { afterEach, expect, test, vi } from 'vitest';

import { shareLink } from './shareLink';

const url = 'https://example.test/s/abc';
const text = '달빛토끼님의 인연을 보았느니라.';

// jsdom 에는 navigator.share·clipboard 가 없다 — 분기마다 필요한 것만 심고 끝나면 지운다.
function setNavigator(key: 'share' | 'clipboard', value: unknown): void {
  Object.defineProperty(navigator, key, { value, configurable: true, writable: true });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'clipboard');
  vi.restoreAllMocks();
});

test('공유 시트를 지원하면 시트로 넘기고 복사하지 않는다', async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', share);
  setNavigator('clipboard', { writeText });

  await expect(shareLink(url, text)).resolves.toBe('shared');
  expect(share).toHaveBeenCalledWith({ text: `${text}\n${url}` });
  expect(writeText).not.toHaveBeenCalled();
});

test('문구·링크를 줄바꿈으로 나눠 text 한 곳에 넣고 제목은 보내지 않는다 — 받는 앱이 이어 붙이지 않게 한다', async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', share);

  await shareLink(url, text);

  const [data] = share.mock.calls[0] as [ShareData];
  expect(data).not.toHaveProperty('url');
  expect(data).not.toHaveProperty('title');
  expect(data.text?.split('\n')).toEqual([text, url]);
});

test('사용자가 공유 시트를 닫으면 아무것도 하지 않는다', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', vi.fn().mockRejectedValue(new DOMException('cancel', 'AbortError')));
  setNavigator('clipboard', { writeText });

  await expect(shareLink(url, text)).resolves.toBe('cancelled');
  expect(writeText).not.toHaveBeenCalled();
});

test('공유 시트가 취소 말고 다른 이유로 실패하면 복사로 물러난다', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', vi.fn().mockRejectedValue(new Error('unsupported')));
  setNavigator('clipboard', { writeText });

  await expect(shareLink(url, text)).resolves.toBe('copied');
  expect(writeText).toHaveBeenCalledWith(url);
});

test('공유 시트가 없으면 클립보드에 복사한다', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('clipboard', { writeText });

  await expect(shareLink(url, text)).resolves.toBe('copied');
  expect(writeText).toHaveBeenCalledWith(url);
});

test('클립보드가 거부하면 링크를 직접 보여줘야 한다고 알린다', async () => {
  setNavigator('clipboard', { writeText: vi.fn().mockRejectedValue(new Error('denied')) });

  await expect(shareLink(url, text)).resolves.toBe('manual');
});

test('공유 시트도 클립보드도 없으면 링크를 직접 보여줘야 한다고 알린다', async () => {
  await expect(shareLink(url, text)).resolves.toBe('manual');
});
