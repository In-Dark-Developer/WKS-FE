import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import type { Result } from '@/api/schema/result';

const { getResultMock } = vi.hoisted(() => ({ getResultMock: vi.fn() }));
vi.mock('@/api/results', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/results')>();
  return { ...actual, getResult: getResultMock };
});

import { readingLoader } from './readingLoader';

const stubResult: Result = {
  resultId: 'r1',
  shareId: 's1',
  nickname: '달빛토끼',
  zodiac: 'PIG',
  destiny: { title: '제목', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'SS', content: '내용' },
    { category: 'CHILDREN', grade: 'A+', content: '내용' },
    { category: 'LOVE', grade: 'B', content: '내용' },
  ],
  luckyPlace: '장소',
  elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
  luckyItem: '아이템',
  compatibilities: [],
};

afterEach(() => {
  getResultMock.mockReset();
  vi.restoreAllMocks();
});

function args(id: string): LoaderFunctionArgs {
  const url = `http://test/reading/${id}`;
  return {
    params: { id },
    request: new Request(url),
    context: {},
    url: new URL(url),
    pattern: '/reading/:id',
  };
}

test('결과를 ReadingView 로 바꿔 돌려준다', async () => {
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const view = await readingLoader(args('r1'));

  expect(view.nickname).toBe('달빛토끼');
  expect(view.fortunes.love.grade).toBe('B');
});

test('RESULT_NOT_FOUND 는 사주 입력으로 보낸다 — 보관된 내 결과는 getResult 가 이미 비웠다', async () => {
  getResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  try {
    await readingLoader(args('missing'));
    throw new Error('던져야 한다');
  } catch (error) {
    expect(error).toBeInstanceOf(Response);
    expect(error instanceof Response ? error.status : undefined).toBe(302);
    expect(error instanceof Response ? error.headers.get('Location') : undefined).toBe('/');
  }
});

test('네트워크 실패는 503 Response 를 던진다(콘솔에 원인 남김)', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  getResultMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  try {
    await readingLoader(args('r1'));
    throw new Error('던져야 한다');
  } catch (error) {
    expect(error).toBeInstanceOf(Response);
    expect(error instanceof Response ? error.status : undefined).toBe(503);
  }
  expect(log).toHaveBeenCalled();
});
