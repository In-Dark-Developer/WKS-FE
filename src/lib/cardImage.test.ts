import { afterEach, expect, test, vi } from 'vitest';

import { buildStoryFrame, cardImageFileName, renderCardImage } from './cardImage';

// jsdom 에는 foreignObject 렌더·캔버스가 없다 — 라이브러리는 갈아 끼우고
// 프레임 조립·정리·실패 처리만 확인한다 (실물 확인은 T5·실기기).
const toBlob = vi.fn();
vi.mock('html-to-image', () => ({ toBlob: (...args: unknown[]) => toBlob(...args) }));

function makeCard(): HTMLElement {
  const card = document.createElement('section');
  card.dataset.destinyCard = '';
  card.style.width = '343px';
  card.textContent = '달빛토끼님의 인연카드';
  document.body.append(card);
  return card;
}

afterEach(() => {
  document.body.replaceChildren();
  toBlob.mockReset();
});

test('스토리 규격 프레임에 카드 사본을 넣는다', () => {
  const card = makeCard();

  const { frame, remove } = buildStoryFrame(card);

  expect(frame.style.width).toBe('1080px');
  expect(frame.style.height).toBe('1920px');
  expect(frame.textContent).toBe('달빛토끼님의 인연카드');
  // 화면 밖이어야 사용자에게 보이지 않는다.
  expect(Number.parseInt(frame.style.left, 10)).toBeLessThan(0);
  remove();
});

test('원본 카드는 건드리지 않는다', () => {
  const card = makeCard();

  const { remove } = buildStoryFrame(card);

  expect(card.style.width).toBe('343px');
  expect(card.isConnected).toBe(true);
  remove();
});

test('사본은 스토리 폭에 맞춰 넓힌다', () => {
  const card = makeCard();

  const { frame, remove } = buildStoryFrame(card);
  const clone = frame.firstElementChild;

  expect(clone).toBeInstanceOf(HTMLElement);
  expect(clone instanceof HTMLElement ? clone.style.width : null).toBe('864px');
  remove();
});

test('PNG Blob 을 돌려주고 프레임을 치운다', async () => {
  const card = makeCard();
  const png = new Blob(['png'], { type: 'image/png' });
  toBlob.mockResolvedValue(png);

  await expect(renderCardImage(card)).resolves.toBe(png);

  expect(toBlob).toHaveBeenCalledWith(
    expect.any(HTMLElement),
    expect.objectContaining({ width: 1080, height: 1920 }),
  );
  expect(document.querySelector('[data-story-frame]')).toBeNull();
});

test('라이브러리가 null 을 주면 실패로 알린다', async () => {
  const card = makeCard();
  toBlob.mockResolvedValue(null);

  await expect(renderCardImage(card)).rejects.toThrow('카드 이미지를 만들지 못했다');
  expect(document.querySelector('[data-story-frame]')).toBeNull();
});

test('만들다 실패해도 프레임을 남기지 않는다', async () => {
  const card = makeCard();
  toBlob.mockRejectedValue(new Error('boom'));

  await expect(renderCardImage(card)).rejects.toThrow('boom');
  expect(document.querySelector('[data-story-frame]')).toBeNull();
});

test('파일 이름에 닉네임을 쓰되 경로 문자는 지운다', () => {
  expect(cardImageFileName('달빛토끼')).toBe('달빛토끼-인연카드.png');
  expect(cardImageFileName('a/b:c')).toBe('abc-인연카드.png');
  expect(cardImageFileName('   ')).toBe('인연카드-인연카드.png');
});
