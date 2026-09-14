import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import type { Result } from '@/api/schema/result';

const { getResultMock } = vi.hoisted(() => ({ getResultMock: vi.fn() }));
vi.mock('@/api/results', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/results')>();
  return { ...actual, getResult: getResultMock };
});

import { cardLoader } from './cardLoader';

const stubResult: Result = {
  resultId: 'r1',
  shareId: 's1',
  nickname: '달빛토끼',
  zodiac: 'PIG',
  destiny: { title: '꽃길만 걷는 인연', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'SS', content: '결혼운 내용' },
    { category: 'CHILDREN', grade: 'A+', content: '자녀운 내용' },
    { category: 'LOVE', grade: 'B', content: '연애운 내용' },
  ],
  luckyPlace: '만해광장',
  luckyItem: '책',
  compatibilities: [],
};

afterEach(() => {
  getResultMock.mockReset();
  vi.restoreAllMocks();
});

function args(id: string): LoaderFunctionArgs {
  const url = `http://test/reading/${id}/card`;
  return {
    params: { id },
    request: new Request(url),
    context: {},
    url: new URL(url),
    pattern: '/reading/:id/card',
  };
}

test('결과를 인연카드 화면 props 로 바꾼다 — 등급은 결혼·자녀·연애 순이다', async () => {
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const view = await cardLoader(args('r1'));

  expect(view).toEqual({
    nickname: '달빛토끼',
    zodiac: 'PIG',
    title: '꽃길만 걷는 인연',
    description: '설명',
    grades: [
      { label: '결혼운', grade: 'SS' },
      { label: '자녀운', grade: 'A+' },
      { label: '연애운', grade: 'B' },
    ],
    shareId: 's1',
  });
});

test('응답 순서가 달라도 등급 순서는 결혼·자녀·연애로 고정된다', async () => {
  getResultMock.mockResolvedValue({
    ok: true,
    data: { ...stubResult, fortunes: [...stubResult.fortunes].reverse() },
  });

  const view = await cardLoader(args('r1'));

  expect(view.grades.map(({ label }) => label)).toEqual(['결혼운', '자녀운', '연애운']);
});

test('RESULT_NOT_FOUND 는 404 Response 를 던진다', async () => {
  getResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  try {
    await cardLoader(args('missing'));
    throw new Error('던져야 한다');
  } catch (error) {
    expect(error).toBeInstanceOf(Response);
    expect(error instanceof Response ? error.status : undefined).toBe(404);
  }
});

test('네트워크 실패는 503 Response 를 던진다(콘솔에 원인 남김)', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  getResultMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  try {
    await cardLoader(args('r1'));
    throw new Error('던져야 한다');
  } catch (error) {
    expect(error).toBeInstanceOf(Response);
    expect(error instanceof Response ? error.status : undefined).toBe(503);
  }
  expect(log).toHaveBeenCalled();
});

test('id 가 없으면 404 Response 를 던진다 — 호출하지 않는다', async () => {
  try {
    await cardLoader({ ...args('r1'), params: {} });
    throw new Error('던져야 한다');
  } catch (error) {
    expect(error).toBeInstanceOf(Response);
    expect(error instanceof Response ? error.status : undefined).toBe(404);
  }
  expect(getResultMock).not.toHaveBeenCalled();
});
