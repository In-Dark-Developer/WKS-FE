import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { shareCardImage } from './shareCardImage';

const png = new Blob(['png'], { type: 'image/png' });
const renderCardImage = vi.fn();

vi.mock('@/lib/cardImage', () => ({
  renderCardImage: (...args: unknown[]) => renderCardImage(...args),
  cardImageFileName: (nickname: string) => `${nickname}-인연카드.png`,
}));

// jsdom 에는 navigator.share·canShare·URL.createObjectURL 이 없다 — 분기마다 심는다.
function setNavigator(key: 'share' | 'canShare', value: unknown): void {
  Object.defineProperty(navigator, key, { value, configurable: true, writable: true });
}

let clicked: HTMLAnchorElement[] = [];

beforeEach(() => {
  renderCardImage.mockResolvedValue(png);
  clicked = [];
  Object.defineProperty(URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:card'),
    configurable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), configurable: true });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(
    this: HTMLAnchorElement,
  ) {
    clicked.push(this);
  });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'canShare');
  vi.restoreAllMocks();
  renderCardImage.mockReset();
});

function card(): HTMLElement {
  const node = document.createElement('section');
  node.dataset.destinyCard = '';
  return node;
}

test('파일 공유를 지원하면 공유 시트로 PNG 를 넘긴다', async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  setNavigator('share', share);
  setNavigator('canShare', vi.fn().mockReturnValue(true));

  await expect(shareCardImage(card(), '달빛토끼')).resolves.toBe('shared');

  const passed = share.mock.calls[0]?.[0] as { files: File[] };
  expect(passed.files[0]?.name).toBe('달빛토끼-인연카드.png');
  expect(passed.files[0]?.type).toBe('image/png');
  expect(clicked).toHaveLength(0);
});

test('사용자가 공유 시트를 닫으면 저장하지 않는다', async () => {
  setNavigator('share', vi.fn().mockRejectedValue(new DOMException('cancel', 'AbortError')));
  setNavigator('canShare', vi.fn().mockReturnValue(true));

  await expect(shareCardImage(card(), '달빛토끼')).resolves.toBe('cancelled');
  expect(clicked).toHaveLength(0);
});

test('파일 공유를 지원하지 않으면 같은 PNG 를 내려받는다', async () => {
  await expect(shareCardImage(card(), '달빛토끼')).resolves.toBe('saved');

  expect(clicked).toHaveLength(1);
  expect(clicked[0]?.download).toBe('달빛토끼-인연카드.png');
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:card');
});

test('canShare 가 파일을 거절하면 저장으로 물러난다', async () => {
  const share = vi.fn();
  setNavigator('share', share);
  setNavigator('canShare', vi.fn().mockReturnValue(false));

  await expect(shareCardImage(card(), '달빛토끼')).resolves.toBe('saved');
  expect(share).not.toHaveBeenCalled();
  expect(clicked).toHaveLength(1);
});

test('공유 시트가 취소 말고 다른 이유로 실패하면 저장으로 물러난다', async () => {
  setNavigator('share', vi.fn().mockRejectedValue(new Error('boom')));
  setNavigator('canShare', vi.fn().mockReturnValue(true));

  await expect(shareCardImage(card(), '달빛토끼')).resolves.toBe('saved');
  expect(clicked).toHaveLength(1);
});

test('이미지 생성이 실패하면 그대로 알린다', async () => {
  renderCardImage.mockRejectedValue(new Error('카드 이미지를 만들지 못했다'));

  await expect(shareCardImage(card(), '달빛토끼')).rejects.toThrow('카드 이미지를 만들지 못했다');
  expect(clicked).toHaveLength(0);
});
