import { afterEach, expect, test, vi } from 'vitest';

import { shareLink } from './shareLink';

const url = 'https://example.test/s/abc';
const meta = { title: '운명도 꿰어야 사랑이다', text: '달빛토끼님의 인연을 보았느니라.' };

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

  await expect(shareLink(url, meta)).resolves.toBe('shared');
  expect(share).toHaveBeenCalledWith({ title: meta.title, text: `${meta.text}\n${url}` });
  expect(writeText).not.toHaveBeenCalled();
});

test('링크는 문구 뒤 줄바꿈 다음에 두어 받는 앱이 문구를 링크에 이어 붙이지 않게 한다', async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', share);

  await shareLink(url, meta);

  const [data] = share.mock.calls[0] as [ShareData];
  expect(data).not.toHaveProperty('url');
  expect(data.text?.split('\n')).toEqual([meta.text, url]);
});

test('사용자가 공유 시트를 닫으면 아무것도 하지 않는다', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', vi.fn().mockRejectedValue(new DOMException('cancel', 'AbortError')));
  setNavigator('clipboard', { writeText });

  await expect(shareLink(url, meta)).resolves.toBe('cancelled');
  expect(writeText).not.toHaveBeenCalled();
});

test('공유 시트가 취소 말고 다른 이유로 실패하면 복사로 물러난다', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', vi.fn().mockRejectedValue(new Error('unsupported')));
  setNavigator('clipboard', { writeText });

  await expect(shareLink(url, meta)).resolves.toBe('copied');
  expect(writeText).toHaveBeenCalledWith(url);
});

test('공유 시트가 없으면 클립보드에 복사한다', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setNavigator('clipboard', { writeText });

  await expect(shareLink(url, meta)).resolves.toBe('copied');
  expect(writeText).toHaveBeenCalledWith(url);
});

test('클립보드가 거부하면 링크를 직접 보여줘야 한다고 알린다', async () => {
  setNavigator('clipboard', { writeText: vi.fn().mockRejectedValue(new Error('denied')) });

  await expect(shareLink(url, meta)).resolves.toBe('manual');
});

test('공유 시트도 클립보드도 없으면 링크를 직접 보여줘야 한다고 알린다', async () => {
  await expect(shareLink(url, meta)).resolves.toBe('manual');
});
