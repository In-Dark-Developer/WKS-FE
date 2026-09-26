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
const { getCompatibilityReasonMock } = vi.hoisted(() => ({
  getCompatibilityReasonMock: vi.fn(),
}));
vi.mock('@/api/compatibilities', () => ({ getCompatibilityReason: getCompatibilityReasonMock }));
const { getSharedResultMock, createCompatibilityMock } = vi.hoisted(() => ({
  getSharedResultMock: vi.fn(),
  createCompatibilityMock: vi.fn(),
}));
// GET /me 도 경계에서 대체한다 — 기본은 비로그인(401)이고 소개팅 테스트가 각자 바꾼다.
const { getMeMock } = vi.hoisted(() => ({ getMeMock: vi.fn() }));
vi.mock('@/api/me', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/me')>();
  return { ...actual, getMe: getMeMock };
});
const unauthenticated = {
  ok: false,
  error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요해요.' },
} as const;
// 추천도 경계에서 대체한다 — Top 3 라우트가 GET /dating/recommendations 를 부른다(10/T3).
// 잔액도 경계에서 대체한다 — 카드 화면은 원장(`GET /wallet`)에서 읽는다(10/T2 · FR-31).
const { getWalletMock } = vi.hoisted(() => ({ getWalletMock: vi.fn() }));
vi.mock('@/api/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/wallet')>();
  return { ...actual, getWallet: getWalletMock };
});
const { getRecommendationsMock } = vi.hoisted(() => ({ getRecommendationsMock: vi.fn() }));
vi.mock('@/api/dating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/dating')>();
  return { ...actual, getRecommendations: getRecommendationsMock };
});
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

// 인트로는 첫 방문에만, 메인 티저는 접속마다 뜬다(FR-1) — 입력 화면을 보는 테스트는 둘 다 지난 방문자로 시작한다.
beforeEach(() => {
  localStorage.setItem('wks:intro-seen', '1');
  getMeMock.mockResolvedValue(unauthenticated);
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [] } });
  getWalletMock.mockResolvedValue({ ok: true, data: { balance: 0, canCheckInToday: true } });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  getResultMock.mockReset();
  createResultMock.mockReset();
  getSharedResultMock.mockReset();
  createCompatibilityMock.mockReset();
  getCompatibilityReasonMock.mockReset();
  getMeMock.mockReset();
  getRecommendationsMock.mockReset();
  getWalletMock.mockReset();
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

test('첫 방문이면 루트 경로에 인트로가 먼저 뜬다', async () => {
  localStorage.clear();
  renderAt('/');

  expect(await screen.findByLabelText('인트로 영상')).toBeInTheDocument();
});

// 인트로를 본 방문자 — `/` 는 언제나 티저다. 티저 loader(GET /me)가 끝나 티저가 그려질 때까지 기다린다.
async function renderTeaser() {
  const router = renderAt('/');
  await screen.findByRole('button', { name: '내 사주 보기' });
  return router;
}

test('인트로 뒤에는 네비 없는 메인 티저가 뜬다', async () => {
  await renderTeaser();

  expect(screen.getByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '새로운 인연 찾기' })).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: '주요 메뉴' })).not.toBeInTheDocument();
});

test("티저의 '내 사주 보기'는 결과가 없으면 사주 입력(/saju)을 열고, 뒤로가기는 티저로 돌아온다", async () => {
  const router = await renderTeaser();
  fireEvent.click(screen.getByRole('button', { name: '내 사주 보기' }));

  expect(await screen.findByRole('button', { name: '점지 확인하기' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/saju');

  await router.navigate(-1);

  expect(await screen.findByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
});

test('결과가 없으면 소개팅에서 홈 탭을 눌러도 티저가 홈이다', async () => {
  const router = await renderTeaser();
  fireEvent.click(screen.getByRole('button', { name: '새로운 인연 찾기' }));
  const nav = await screen.findByRole('navigation', { name: '주요 메뉴' });

  fireEvent.click(within(nav).getByRole('button', { name: '홈' }));

  expect(await screen.findByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
});

test("티저의 '내 사주 보기'는 이 브라우저의 결과가 있으면 로그인 없이 홈(결과)으로 간다", async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });
  const router = await renderTeaser();
  fireEvent.click(screen.getByRole('button', { name: '내 사주 보기' }));

  await screen.findByRole('navigation', { name: '주요 메뉴' });
  expect(router.state.location.pathname).toBe(`/reading/${RESULT_ID}`);
});

test("티저의 '새로운 인연 찾기'는 소개팅 인트로로 간다", async () => {
  const router = await renderTeaser();
  fireEvent.click(screen.getByRole('button', { name: '새로운 인연 찾기' }));

  await screen.findByRole('navigation', { name: '주요 메뉴' });
  expect(router.state.location.pathname).toBe('/dating');
});

test("티저의 '이미 아이디가 있어요'는 로그인 시트를 띄우고 닫으면 티저에 남는다", async () => {
  await renderTeaser();
  fireEvent.click(screen.getByRole('button', { name: '이미 아이디가 있어요' }));

  const sheet = await screen.findByRole('dialog', { name: '내 운명 찾아 떠나기' });
  expect(within(sheet).getByRole('button', { name: '카카오로 시작하기' })).toBeInTheDocument();

  fireEvent.click(within(sheet).getByRole('button', { name: '나중에 할래요' }));

  expect(screen.getByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
});

test("로그인했으면 티저에 '이미 아이디가 있어요'가 없다", async () => {
  getMeMock.mockResolvedValue(member());
  await renderTeaser();

  expect(screen.queryByRole('button', { name: '이미 아이디가 있어요' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '새로운 인연 찾기' })).toBeInTheDocument();
});

test("로그인 여부를 확인하지 못하면 티저에 '이미 아이디가 있어요'를 둔다", async () => {
  getMeMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  await renderTeaser();

  expect(screen.getByRole('button', { name: '이미 아이디가 있어요' })).toBeInTheDocument();
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

// 공유 링크 궁합 대기 화면(Figma 1044:4150) — '이전 정보 불러오기'를 누르면 궁합이 만들어질 때까지 보인다(FR-23).

test('공유 링크 첫 진입은 궁합을 만들지 않아 궁합 지도를 만드는 중 안내가 뜨지 않는다', () => {
  writeSession(RESULT_ID);
  let release: (() => void) | undefined;
  getSharedResultMock.mockReturnValue(
    new Promise((resolve) => {
      release = () => resolve({ ok: true, data: { nickname: '서연', compatibilities: [] } });
    }),
  );

  renderAt('/s/11111111-1111-4111-8111-111111111111');

  expect(screen.queryByText(/이전 정보로 궁합지도를 만들고 있어요/)).not.toBeInTheDocument();
  expect(createCompatibilityMock).not.toHaveBeenCalled();
  release?.();
});

test(
  '이전 정보 불러오기를 누르면 대기 화면이 최소 3초 보인 뒤 궁합 지도로 간다',
  { timeout: 10000 },
  async () => {
    writeSession(RESULT_ID);
    getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });
    createCompatibilityMock.mockResolvedValue(compatibility);

    const router = renderAt('/s/11111111-1111-4111-8111-111111111111');
    fireEvent.click(await screen.findByRole('button', { name: '이전 정보 불러오기' }));
    const startedAt = Date.now();

    expect(await screen.findByRole('status')).toHaveTextContent(
      '이전 정보로 궁합지도를 만들고 있어요',
    );
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: '달빛토끼님의 궁합 지도' },
        { timeout: 4500 },
      ),
    ).toBeInTheDocument();
    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(2900);
    expect(createCompatibilityMock).toHaveBeenCalledWith(
      '11111111-1111-4111-8111-111111111111',
      RESULT_ID,
    );
    expect(router.state.location.pathname).toBe('/s/11111111-1111-4111-8111-111111111111/map');
  },
);

// 04/T7 조립 — 인연카드 화면을 결과 화면에 합쳤다(카드 뒤집기·카드 저장, 빈 순위의 친구에게 공유).

test('결과 화면은 카드 뒷면부터 보이고, 카드 뒤집기·카드 저장을 갖고 인연카드 입구는 없다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt(`/reading/${RESULT_ID}`);

  // 들어오면 카드 뒷면부터 보인다 (PRD FR-5).
  expect(await screen.findByRole('img', { name: '운명도 꿰어야 사랑이다' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '카드 저장하기' })).toBeInTheDocument();
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

test('친구 궁합 순위가 있어도 목록 아래에 친구에게 공유가 있다', async () => {
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
  const ranking = screen.getByRole('region', { name: '친구 궁합 순위' });
  expect(within(ranking).getByRole('button', { name: '친구에게 공유' })).toBeInTheDocument();
  expect(within(ranking).queryByRole('status')).not.toBeInTheDocument();
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

test('백엔드가 모르는 결과면 티저(홈)로 돌아간다 — 죽은 resultId 로 오류 화면에 갇히지 않는다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  renderAt(`/reading/${RESULT_ID}`);

  expect(await screen.findByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
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

  // 사주가 없는 방문자도 초대 머리와 주인의 궁합 지도 아래에서 입력한다 (FR-15 V1, Figma 30:5916).
  expect(
    await screen.findByRole('heading', { level: 1, name: '달빛토끼님의궁합지도에 초대됐어요' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: '사주를 입력해 인연을 확인하세요' }),
  ).toBeInTheDocument();
  expect(screen.getByText(/달빛토끼님과 나의 궁합을 확인할 수 있어요/)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '이전 정보 불러오기' })).not.toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: '내 운명을 친구 궁합 지도에 꿰기' }),
  ).toBeInTheDocument();
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
  await screen.findByRole('button', { name: '내 운명을 친구 궁합 지도에 꿰기' });
  fillValidSaju();
  fireEvent.click(screen.getByRole('button', { name: '내 운명을 친구 궁합 지도에 꿰기' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: '달빛토끼님의 궁합 지도' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/s/${SHARE_ID}/map`);
  expect(createCompatibilityMock).toHaveBeenCalledWith(SHARE_ID, RESULT_ID);
  expect(screen.getByText('달빛토끼님과의 궁합 지도예요.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '뒤로가기' })).not.toBeInTheDocument();
});

test(
  '내 결과가 있으면 링크로 들어올 때 이전 정보와 새로 작성을 고르게 하고, 이전 정보로 만든 지도에서 내 사주의 뒤로가기는 지도로 돌아온다',
  { timeout: 10000 },
  async () => {
    writeSession(RESULT_ID);
    getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });
    createCompatibilityMock.mockResolvedValue(compatibility);
    getResultMock.mockResolvedValue({ ok: true, data: stubResult });

    const router = renderAt(`/s/${SHARE_ID}`);

    expect(await screen.findByRole('button', { name: '새로 작성하기' })).toBeInTheDocument();
    expect(createCompatibilityMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '이전 정보 불러오기' }));

    // 궁합 대기 화면은 최소 3초다 — RTL 기본 1초로는 모자라다.
    fireEvent.click(
      await screen.findByRole('button', { name: '내 사주 내용도 확인하기' }, { timeout: 4500 }),
    );

    expect(await screen.findByRole('button', { name: '카드 뒤집기' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(`/reading/${RESULT_ID}`);

    fireEvent.click(screen.getByRole('button', { name: '뒤로가기' }));

    expect(
      await screen.findByRole('button', { name: '내 사주 내용도 확인하기' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(`/s/${SHARE_ID}/map`);
    expect(createCompatibilityMock).toHaveBeenCalledTimes(1);
  },
);

test('새로 작성하기를 고르면 보관된 내 결과를 두고 사주 입력 폼을 연다', async () => {
  writeSession(RESULT_ID);
  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });

  renderAt(`/s/${SHARE_ID}`);
  fireEvent.click(await screen.findByRole('button', { name: '새로 작성하기' }));

  expect(
    await screen.findByRole('button', { name: '내 운명을 친구 궁합 지도에 꿰기' }),
  ).toBeInTheDocument();
  // 기존 방문자의 '새로 작성하기' 폼도 신규 방문자와 같은 문구다 (Figma 30:6323).
  expect(
    screen.getByRole('heading', { name: '사주를 입력해 인연을 확인하세요' }),
  ).toBeInTheDocument();
  expect(createCompatibilityMock).not.toHaveBeenCalled();
  expect(localStorage.getItem('wks:session')).toContain(RESULT_ID);
});

test('결과 없이 친구의 궁합 지도 주소로 오면 공유 링크 입력으로 보낸다', async () => {
  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });

  const router = renderAt(`/s/${SHARE_ID}/map`);

  expect(
    await screen.findByRole('button', { name: '내 운명을 친구 궁합 지도에 꿰기' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/s/${SHARE_ID}`);
});

test(
  '궁합 생성이 연결 문제로 실패하면 다시 시도할 수 있는 오류를 보인다',
  { timeout: 10000 },
  async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    writeSession(RESULT_ID);
    createCompatibilityMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

    renderAt(`/s/${SHARE_ID}/join`);

    expect(await screen.findByRole('alert', {}, { timeout: 4500 })).toHaveTextContent(
      '인연을 잇지 못했어요',
    );
    expect(screen.getByRole('link', { name: '다시 시도하기' })).toHaveAttribute(
      'href',
      `/s/${SHARE_ID}/join`,
    );
  },
);

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

// 하단 네비(09/T1, FR-19) — 라우트 handle.nav 가 켠 화면에만 뜨고 그 탭이 선택된다.

function navTab(name: string) {
  return within(screen.getByRole('navigation', { name: '주요 메뉴' })).getByRole('button', {
    name,
  });
}

test('결과 화면(= 홈)에는 하단 네비가 뜨고 홈 탭이 선택돼 있다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt(`/reading/${RESULT_ID}`);

  await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' });
  expect(navTab('홈')).toHaveAttribute('aria-current', 'page');
  expect(navTab('궁합지도')).not.toHaveAttribute('aria-current');
});

test('궁합지도 탭은 내 궁합 지도로 가고 그 탭이 선택된다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const router = renderAt(`/reading/${RESULT_ID}`);
  await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' });
  fireEvent.click(navTab('궁합지도'));

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/me/map'));
  await vi.waitFor(() => expect(navTab('궁합지도')).toHaveAttribute('aria-current', 'page'));
});

test('홈 탭은 이 브라우저의 사주가 있으면 결과로 간다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const router = renderAt('/dating');
  await screen.findByRole('navigation', { name: '주요 메뉴' });
  fireEvent.click(navTab('홈'));

  expect(
    await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe(`/reading/${RESULT_ID}`);
});

test('홈 탭은 사주가 없으면 티저가 아니라 사주 입력으로 간다', async () => {
  const router = renderAt('/dating');
  await screen.findByRole('navigation', { name: '주요 메뉴' });
  expect(navTab('소개팅')).toHaveAttribute('aria-current', 'page');

  fireEvent.click(navTab('홈'));

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
  expect(screen.queryByRole('navigation', { name: '주요 메뉴' })).not.toBeInTheDocument();
});

test('사주 입력과 공유 Flow 에는 하단 네비가 없다', async () => {
  renderAt('/saju');
  await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' });
  expect(screen.queryByRole('navigation', { name: '주요 메뉴' })).not.toBeInTheDocument();
  cleanup();

  getSharedResultMock.mockResolvedValue({ ok: true, data: sharedOwner });
  renderAt(`/s/${SHARE_ID}`);
  await screen.findByRole('button', { name: '내 운명을 친구 궁합 지도에 꿰기' });
  expect(screen.queryByRole('navigation', { name: '주요 메뉴' })).not.toBeInTheDocument();
});

// 궁합 이유 상세(09/T4, FR-22) — 궁합 지도의 친구 줄을 누르면 지도 위에 시트가 뜨고, 이유는 시트 안에서 기다린다.

test('궁합 지도의 친구 줄을 누르면 시트가 먼저 뜨고, 이유가 오면 세 문단을 보인다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({
    ok: true,
    data: {
      ...stubResult,
      compatibilities: [
        {
          id: 12,
          nickname: '연꽃친구',
          score: 90,
          tier: 'GUIIN',
          createdAt: '2026-09-24T01:00:00Z',
        },
      ],
    },
  });
  let resolveReason: (value: unknown) => void = () => {};
  getCompatibilityReasonMock.mockReturnValue(new Promise((resolve) => (resolveReason = resolve)));

  const router = renderAt('/me/map');
  fireEvent.click(await screen.findByRole('button', { name: '연꽃친구님과의 궁합 이유 보기' }));

  const sheet = await screen.findByRole('dialog', { name: '연꽃친구님과의 궁합 이유' });
  expect(router.state.location.pathname).toBe('/me/map/12');
  expect(within(sheet).getByRole('status')).toHaveTextContent('인연을 풀어보는 중');
  expect(getCompatibilityReasonMock).toHaveBeenCalledWith(12);

  resolveReason({ ok: true, data: { why: '왜 답', together: '함께 답', conflict: '다툼 답' } });

  expect(await within(sheet).findByText('왜 답')).toBeInTheDocument();
  expect(within(sheet).getByRole('heading', { name: '왜 나에게 귀인일까요?' })).toBeInTheDocument();
  expect(within(sheet).getByText('다툼 답')).toBeInTheDocument();
});

test('궁합 이유를 못 받으면 시트 안에서 오류와 다시 시도를 보인다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({
    ok: true,
    data: {
      ...stubResult,
      compatibilities: [
        {
          id: 12,
          nickname: '연꽃친구',
          score: 90,
          tier: 'GUIIN',
          createdAt: '2026-09-24T01:00:00Z',
        },
      ],
    },
  });
  getCompatibilityReasonMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'LLM_UNAVAILABLE', message: '실패' },
  });

  renderAt('/me/map/12');

  expect(await screen.findByRole('alert')).toHaveTextContent('궁합 이유를 풀어내지 못했어요');
  expect(screen.getByRole('button', { name: '다시 시도하기' })).toBeInTheDocument();
});

test('목록에 없는 궁합 ID 로 들어오면 시트 없이 궁합 지도로 돌아간다', async () => {
  writeSession(RESULT_ID);
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });
  getCompatibilityReasonMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'COMPATIBILITY_NOT_FOUND', message: '없음' },
  });

  const router = renderAt('/me/map/999');

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/me/map'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

// 소개팅 진입 분기(10/T1, FR-24 · Phase 10 AC1) — 로그인 여부와 등록 상태는 GET /me 로만 판단한다.

function member(
  overrides: { hasResult?: boolean; hasDatingProfile?: boolean; threadBalance?: number } = {},
) {
  return {
    ok: true,
    data: {
      memberId: 1,
      hasResult: false,
      hasDatingProfile: false,
      threadBalance: 0,
      ...overrides,
    },
  } as const;
}

test('비로그인으로 소개팅 탭에 들어가면 로그인 안내가 뜬다', async () => {
  renderAt('/dating');

  fireEvent.click(await screen.findByRole('button', { name: '로그인하고 내 운명 찾아 떠나기' }));

  expect(await screen.findByRole('button', { name: '카카오로 시작하기' })).toBeInTheDocument();
});

test('사주 없는 로그인 사용자는 프로필 (1/2) 사주 정보부터 등록한다', async () => {
  getMeMock.mockResolvedValue(member());
  const router = renderAt('/dating');

  fireEvent.click(await screen.findByRole('button', { name: '내 운명 찾아 떠나기' }));

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/dating/profile'));
  expect(await screen.findByRole('button', { name: '다음으로' })).toBeInTheDocument();
});

test('프로필까지 등록한 사용자는 입력 없이 Top 3 로 간다', async () => {
  getMeMock.mockResolvedValue(member({ hasResult: true, hasDatingProfile: true }));
  const router = renderAt('/dating');

  fireEvent.click(await screen.findByRole('button', { name: '내 운명 찾아 떠나기' }));

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/dating/cards'));
});

test('비로그인으로 프로필 등록 주소에 오면 소개팅 인트로로 돌려보낸다', async () => {
  const router = renderAt('/dating/profile');

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/dating'));
});

test('프로필 없이 Top 3 주소에 오면 프로필 등록으로 보낸다', async () => {
  getMeMock.mockResolvedValue(member());
  const router = renderAt('/dating/cards');

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/dating/profile'));
});

test('내 정보 조회가 실패해도 인트로는 열리고 다시 누를 수 있게 안내한다', async () => {
  getMeMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  renderAt('/dating');

  fireEvent.click(await screen.findByRole('button', { name: '내 운명 찾아 떠나기' }));

  expect(await screen.findByRole('status')).toHaveTextContent('정보를 불러오지 못했어요');
});

test('프로필까지 등록했으면 Top 3 화면이 잔액과 카드를 그린다 (10/T3 · FR-26)', async () => {
  getMeMock.mockResolvedValue(member({ hasResult: true, hasDatingProfile: true }));
  getWalletMock.mockResolvedValue({ ok: true, data: { balance: 12, canCheckInToday: true } });
  getRecommendationsMock.mockResolvedValue({
    ok: true,
    data: {
      candidates: [
        {
          rank: 1,
          candidateId: '3f2a9c1e-0000-4000-8000-000000000001',
          score: 98,
          mbti: 'ENTP',
          bio: '영화 보러 다니는 걸 좋아해요.',
          blurredPhotoUrl: 'https://s3.example.com/blurred.jpg',
          fields: {
            photo: { locked: true, cost: 10 },
            name: { locked: true, cost: 7 },
            department: { locked: true, cost: 5 },
            reason: { locked: true, cost: 3 },
          },
        },
      ],
    },
  });

  renderAt('/dating/cards');

  expect(
    await screen.findByRole('heading', { name: '나와 잘 맞는 인연 TOP 3' }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('운명의 실 보유 12개')).toBeInTheDocument();
  expect(screen.getByText('영화 보러 다니는 걸 좋아해요.')).toBeInTheDocument();
});

test('학교 메일 인증 전에는 Top 3 대신 안내를 보인다 (10/T3)', async () => {
  getMeMock.mockResolvedValue(member({ hasResult: true, hasDatingProfile: true }));
  getRecommendationsMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'DATING_NOT_VERIFIED', message: '학교 메일 인증이 필요해요.' },
  });

  renderAt('/dating/cards');

  expect(
    await screen.findByRole('heading', { name: '학교 메일 인증이 필요해요' }),
  ).toBeInTheDocument();
});
