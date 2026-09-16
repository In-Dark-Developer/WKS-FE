import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import type { Result } from '@/api/schema/result';
import type { SharedResult } from '@/api/schema/share';
import { writeSession } from '@/api/session';
import { routes } from '@/app/routes';

// getResult 는 src/api/ 경계 — 라우트 조립만 확인하니 실제 요청을 보내지 않는다 (CONVENTIONS 8장).
const { getResultMock, createResultMock } = vi.hoisted(() => ({
  getResultMock: vi.fn(),
  createResultMock: vi.fn(),
}));
vi.mock('@/api/results', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/results')>();
  return { ...actual, getResult: getResultMock, createResult: createResultMock };
});
const { getSharedResultMock, createCompatibilityMock } = vi.hoisted(() => ({
  getSharedResultMock: vi.fn(),
  createCompatibilityMock: vi.fn(),
}));
vi.mock('@/api/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/shares')>();
  return {
    ...actual,
    getSharedResult: getSharedResultMock,
    createCompatibility: createCompatibilityMock,
  };
});

// 보관된 resultId 는 UUID 로 파싱되므로 주소의 id 도 UUID 로 쓴다.
const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';
const OTHER_RESULT_ID = '7b91d26f-2222-4222-8222-222222222222';

const stubResult: Result = {
  resultId: RESULT_ID,
  shareId: '11111111-1111-4111-8111-111111111111',
  nickname: '달빛토끼',
  zodiac: 'PIG',
  destiny: { title: '꽃길만 걷는 인연', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'SS', content: '내용' },
    { category: 'CHILDREN', grade: 'A+', content: '내용' },
    { category: 'LOVE', grade: 'B', content: '내용' },
  ],
  luckyPlace: '만해광장',
  elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
  luckyItem: '작은 책 한 권',
  compatibilities: [],
};

// 인트로(FR-1)는 첫 방문에만 뜬다 — 입력 화면을 보는 테스트는 이미 본 방문자로 시작한다.
beforeEach(() => {
  localStorage.setItem('wks:intro-seen', '1');
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  getResultMock.mockReset();
  createResultMock.mockReset();
  getSharedResultMock.mockReset();
  createCompatibilityMock.mockReset();
});

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

test('루트 경로가 화면을 렌더한다', async () => {
  renderAt('/');

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
});

test('첫 방문이면 루트 경로에 인트로가 먼저 뜬다', () => {
  localStorage.clear();
  renderAt('/');

  expect(screen.getByLabelText('인트로 영상')).toBeInTheDocument();
});

test('첫 방문이라도 결과 화면으로 바로 들어오면 인트로가 없다', async () => {
  localStorage.clear();
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt(`/reading/${RESULT_ID}`);

  expect(
    await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' }),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText('인트로 영상')).not.toBeInTheDocument();
});

test('세션 없이 결과 화면에 들어오면 입력 화면으로 보낸다', async () => {
  const router = renderAt(`/reading/${RESULT_ID}`);

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
});

test('이 브라우저가 만든 결과면 결과 화면에 머문다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const router = renderAt(`/reading/${RESULT_ID}`);

  expect(
    await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/reading/${RESULT_ID}`);
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', 'result');
  // 친구 궁합 순위(05/T2 FriendRanking)가 ranking 슬롯에 조립돼 있다 — 인연이 없을 때 안내.
  expect(screen.getByText('아직 인연이 없어요')).toBeInTheDocument();
  // 뒤로가기는 친구의 궁합 지도에서 들어왔을 때만 있다 (FR-6).
  expect(screen.queryByRole('button', { name: '뒤로가기' })).not.toBeInTheDocument();
});

test('궁합 목록이 있으면 친구 궁합 순위에 보인다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({
    ok: true,
    data: {
      ...stubResult,
      compatibilities: [
        { nickname: '친구1', score: 92, tier: 'GUIIN', createdAt: '2026-09-15T02:00:00Z' },
      ],
    },
  });

  renderAt(`/reading/${RESULT_ID}`);

  expect(await screen.findByText('친구1')).toBeInTheDocument();
  expect(screen.getByText('92')).toBeInTheDocument();
});

// 05/T3 조립 — 궁합 지도(`/me/map`)와 결과 화면 순위의 '지도 보기'.

test('결과 화면 순위의 지도 보기를 누르면 궁합 지도로 가서 친구가 점수 높은 순으로 보인다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({
    ok: true,
    data: {
      ...stubResult,
      compatibilities: [
        { nickname: '민수', score: 61, tier: 'BEOT', createdAt: '2026-09-15T02:00:00Z' },
        { nickname: '서연', score: 92, tier: 'GUIIN', createdAt: '2026-09-15T01:00:00Z' },
      ],
    },
  });

  const router = renderAt(`/reading/${RESULT_ID}`);
  fireEvent.click(await screen.findByRole('link', { name: '지도 보기 >' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: '달빛토끼님의 궁합 지도' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/me/map');
  expect(getResultMock).toHaveBeenLastCalledWith(RESULT_ID);
  const ranking = screen.getByRole('region', { name: '친구 궁합 순위' });
  expect(
    within(ranking)
      .getAllByRole('listitem')
      .map((row) => row.textContent),
  ).toEqual([expect.stringContaining('서연'), expect.stringContaining('민수')]);
  expect(
    screen.getByRole('button', { name: '친구에게 공유하고 궁합 지도 넓히기' }),
  ).toBeInTheDocument();
});

test('궁합 지도의 뒤로가기는 내 사주 결과로 돌아간다 — 직접 주소로 들어와도 된다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const router = renderAt('/me/map');
  fireEvent.click(await screen.findByRole('button', { name: '뒤로가기' }));

  expect(
    await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/reading/${RESULT_ID}`);
});

test('보관된 결과 없이 궁합 지도에 들어오면 입력 화면으로 보낸다', async () => {
  const router = renderAt('/me/map');

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
  expect(getResultMock).not.toHaveBeenCalled();
});

// 공유 링크 첫 진입 대기 화면(Figma 1044:4150) — loader 가 끝나기 전까지 보인다.

test('공유 링크로 들어오면 궁합 지도를 만드는 중 안내가 먼저 보인다', async () => {
  writeSession(RESULT_ID);
  let release: (() => void) | undefined;
  createCompatibilityMock.mockReturnValue(
    new Promise((resolve) => {
      release = () =>
        resolve({
          ok: true,
          data: { score: 92, tier: 'GUIIN', originNickname: '서연', guestNickname: '달빛토끼' },
        });
    }),
  );

  renderAt('/s/11111111-1111-4111-8111-111111111111');

  expect(await screen.findByRole('status')).toHaveTextContent(
    '이전 정보로 궁합지도를 만들고 있어요',
  );
  release?.();
});

test('궁합이 금방 만들어져도 대기 화면이 바로 사라지지 않는다', async () => {
  writeSession(RESULT_ID);
  createCompatibilityMock.mockResolvedValue({
    ok: true,
    data: { score: 92, tier: 'GUIIN', originNickname: '서연', guestNickname: '달빛토끼' },
  });
  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });
  const startedAt = Date.now();

  renderAt('/s/11111111-1111-4111-8111-111111111111');

  expect(await screen.findByRole('status')).toHaveTextContent(
    '이전 정보로 궁합지도를 만들고 있어요',
  );
  // 궁합은 이미 끝났지만 화면은 남아 있다.
  await new Promise((resolve) => setTimeout(resolve, 200));
  expect(screen.getByRole('status')).toBeInTheDocument();

  expect(
    await screen.findByRole(
      'heading',
      { level: 1, name: '달빛토끼님의 궁합 지도' },
      { timeout: 3000 },
    ),
  ).toBeInTheDocument();
  expect(Date.now() - startedAt).toBeGreaterThanOrEqual(1400);
});

test('사주를 처음 보는 방문자에게는 궁합 지도를 만드는 중 안내가 뜨지 않는다', () => {
  let release: (() => void) | undefined;
  getSharedResultMock.mockReturnValue(
    new Promise((resolve) => {
      release = () => resolve({ ok: true, data: { nickname: '서연', compatibilities: [] } });
    }),
  );

  renderAt('/s/11111111-1111-4111-8111-111111111111');

  expect(screen.queryByText(/이전 정보로 궁합지도를 만들고 있어요/)).not.toBeInTheDocument();
  release?.();
});

// 04/T7 조립 — 인연카드 화면을 결과 화면에 합쳤다(카드 뒤집기·인스타 스토리 공유, 빈 순위의 친구에게 공유).

test('결과 화면은 카드 뒷면부터 보이고, 카드 뒤집기·인스타 스토리 공유를 갖고 인연카드 입구는 없다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt(`/reading/${RESULT_ID}`);

  // 들어오면 카드 뒷면부터 보인다 (PRD FR-5).
  expect(await screen.findByRole('img', { name: '운명도 꿰어야 사랑이다' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '인스타 스토리 공유하기' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '인연카드 보기' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '카드 뒤집기' }));
  expect(screen.getByRole('region', { name: '달빛토끼님의 운명 카드' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'SS 등급' })).toBeInTheDocument();
});

test('친구 궁합 순위가 비어 있으면 안내 아래에 친구에게 공유가 있다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt(`/reading/${RESULT_ID}`);

  const empty = (await screen.findByText('아직 인연이 없어요')).closest('[role="status"]');
  if (!(empty instanceof HTMLElement)) throw new Error('빈 상태 안내가 없다');
  expect(within(empty).getByRole('button', { name: '친구에게 공유' })).toBeInTheDocument();
});

test('친구 궁합 순위가 있으면 결과 화면에 친구에게 공유가 없다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({
    ok: true,
    data: {
      ...stubResult,
      compatibilities: [
        { nickname: '친구1', score: 92, tier: 'GUIIN', createdAt: '2026-09-15T02:00:00Z' },
      ],
    },
  });

  renderAt(`/reading/${RESULT_ID}`);

  expect(await screen.findByText('친구1')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '친구에게 공유' })).not.toBeInTheDocument();
});

test('없어진 인연카드 주소는 없는 경로 화면이다', async () => {
  writeSession(RESULT_ID);

  renderAt(`/reading/${RESULT_ID}/card`);

  expect(await screen.findByRole('alert')).toHaveTextContent('찾는 점지가 없어요');
  expect(getResultMock).not.toHaveBeenCalled();
});

test('다른 결과를 만든 브라우저로 결과 화면에 들어오면 입력 화면으로 보낸다', async () => {
  writeSession(OTHER_RESULT_ID);

  const router = renderAt(`/reading/${RESULT_ID}`);

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
  expect(getResultMock).not.toHaveBeenCalled();
});

test('백엔드가 모르는 결과면 사주 입력으로 돌아간다 — 죽은 resultId 로 오류 화면에 갇히지 않는다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  renderAt(`/reading/${RESULT_ID}`);

  expect(await screen.findByRole('button', { name: '점지 확인하기' })).toBeInTheDocument();
});

test('결과 조회가 연결 문제로 실패하면 오류 화면을 보인다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  renderAt(`/reading/${RESULT_ID}`);

  expect(await screen.findByRole('alert')).toHaveTextContent('보살님이 잠시 길을 잃었어요');
});

test('없는 경로는 오류 화면과 처음으로 가는 링크를 보인다', async () => {
  renderAt('/nowhere');

  expect(await screen.findByRole('alert')).toHaveTextContent('찾는 점지가 없어요');
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', 'dawn');
  expect(screen.getByRole('link', { name: '처음으로 돌아가기' })).toHaveAttribute('href', '/');
});

// 05/T10 조립 — 공유 링크를 받은 사람: 사주 입력 → 결과·궁합 → 링크 주인의 궁합 지도 ⇄ 내 사주(뒤로가기).

const SHARE_ID = '5a951b51-21d5-4601-91b9-560de47aaaca';

// 공유 조회 응답은 결과 응답에서 resultId·shareId 만 빠진 모양이다.
const sharedOwner: SharedResult = {
  nickname: stubResult.nickname,
  zodiac: stubResult.zodiac,
  destiny: stubResult.destiny,
  fortunes: stubResult.fortunes,
  elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
  luckyItem: stubResult.luckyItem,
  luckyPlace: stubResult.luckyPlace,
  compatibilities: [
    { nickname: '서연', score: 92, tier: 'GUIIN', createdAt: '2026-09-15T01:00:00Z' },
  ],
};

const compatibility = {
  ok: true,
  data: { score: 92, tier: 'GUIIN', originNickname: '달빛토끼', guestNickname: '보살' },
} as const;

function fillValidSaju() {
  fireEvent.click(screen.getByRole('radio', { name: '여자' }));
  fireEvent.change(screen.getByRole('textbox', { name: '생년월일' }), {
    target: { value: '2002-01-01' },
  });
  fireEvent.click(screen.getByRole('combobox', { name: '태어난 시간' }));
  fireEvent.click(screen.getByRole('option', { name: '묘시(卯時) 05:30 ~ 07:30' }));
  fireEvent.change(screen.getByRole('textbox', { name: '닉네임' }), { target: { value: '보살' } });
}

test('공유 링크로 들어오면 세션 없이 링크 주인 닉네임이 든 사주 입력이 보인다', async () => {
  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });

  renderAt(`/s/${SHARE_ID}`);

  expect(
    await screen.findByText(
      '아래 정보를 입력하고 나와 달빛토끼 님의 귀인 궁합을 관계로 확인해보아요.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '운명 지도 확인하기' })).toBeInTheDocument();
  // 주인의 사주 요약은 화면에 없다 (FR-15).
  expect(screen.queryByText('꽃길만 걷는 인연')).not.toBeInTheDocument();
});

test('입력을 마치면 결과·궁합을 만들고 주인의 궁합 지도로 가며, 지도에는 뒤로가기가 없다', async () => {
  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });
  // 실제 createResult 는 성공하면 내 resultId 를 보관한다.
  createResultMock.mockImplementation(() => {
    writeSession(RESULT_ID);
    return Promise.resolve({ ok: true, data: stubResult });
  });
  createCompatibilityMock.mockResolvedValue(compatibility);

  const router = renderAt(`/s/${SHARE_ID}`);
  await screen.findByRole('button', { name: '운명 지도 확인하기' });
  fillValidSaju();
  fireEvent.click(screen.getByRole('button', { name: '운명 지도 확인하기' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: '달빛토끼님의 궁합 지도' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/s/${SHARE_ID}/map`);
  expect(createCompatibilityMock).toHaveBeenCalledWith(SHARE_ID, RESULT_ID);
  expect(screen.getByText('달빛토끼님과의 궁합 지도예요.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '뒤로가기' })).not.toBeInTheDocument();
});

test('내 결과가 있으면 링크로 들어올 때 입력 없이 궁합을 만들고 지도로 가며, 내 사주의 뒤로가기는 지도로 돌아온다', async () => {
  writeSession(RESULT_ID);
  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });
  createCompatibilityMock.mockResolvedValue(compatibility);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const router = renderAt(`/s/${SHARE_ID}`);

  // 공유 링크 첫 진입은 대기 화면을 최소 1.5초 보여 준다 — RTL 기본 1초로는 모자라다.
  fireEvent.click(
    await screen.findByRole('button', { name: '내 사주 내용도 확인하기' }, { timeout: 3000 }),
  );

  expect(await screen.findByRole('button', { name: '카드 뒤집기' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/reading/${RESULT_ID}`);

  fireEvent.click(screen.getByRole('button', { name: '뒤로가기' }));

  expect(
    await screen.findByRole('button', { name: '내 사주 내용도 확인하기' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/s/${SHARE_ID}/map`);
  expect(createCompatibilityMock).toHaveBeenCalledTimes(1);
});

test('결과 없이 친구의 궁합 지도 주소로 오면 공유 링크 입력으로 보낸다', async () => {
  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });

  const router = renderAt(`/s/${SHARE_ID}/map`);

  expect(await screen.findByRole('button', { name: '운명 지도 확인하기' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/s/${SHARE_ID}`);
});

test('궁합 생성이 연결 문제로 실패하면 다시 시도할 수 있는 오류를 보인다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  writeSession(RESULT_ID);
  createCompatibilityMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  renderAt(`/s/${SHARE_ID}/join`);

  expect(await screen.findByRole('alert', {}, { timeout: 3000 })).toHaveTextContent(
    '인연을 잇지 못했어요',
  );
  expect(screen.getByRole('link', { name: '다시 시도하기' })).toHaveAttribute(
    'href',
    `/s/${SHARE_ID}/join`,
  );
});

test('없는 공유 링크는 없는 경로 화면이다', async () => {
  getSharedResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  renderAt(`/s/${SHARE_ID}`);

  expect(await screen.findByRole('alert')).toHaveTextContent('찾는 점지가 없어요');
});

// 06/T4 조립 — 결과 화면 사전신청 섹션 → 모달 → 완료, 그리고 매직링크가 돌아오는 /verify.
test('결과 화면의 사전 신청 버튼이 사전신청 모달을 연다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt(`/reading/${RESULT_ID}`);

  fireEvent.click(await screen.findByRole('button', { name: '사전 신청하고 알림 받기' }));

  expect(await screen.findByRole('dialog', { name: '사전신청' })).toBeInTheDocument();
  expect(screen.getByLabelText('이메일')).toBeInTheDocument();
});

test('매직링크가 보내는 /verify 는 인증 완료를 알린다', async () => {
  renderAt('/verify');

  expect(
    await screen.findByRole('heading', { name: '이메일 인증이 끝났어요' }),
  ).toBeInTheDocument();
});
