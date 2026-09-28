import { afterEach, expect, test, vi } from 'vitest';

const init = vi.fn();
const amplitudeTrack = vi.fn();

vi.mock('@amplitude/analytics-browser', () => ({ init, track: amplitudeTrack }));

// SDK 상태가 모듈 안에 있어 시험마다 새 모듈로 부른다. init 은 동적 import 라 한 틱 뒤에 준비된다.
async function freshModule() {
  vi.resetModules();
  return import('./analytics');
}

afterEach(() => {
  vi.clearAllMocks();
  // 'load 전' 시험이 덮어쓴 readyState 를 jsdom 원래 값으로 돌린다.
  Reflect.deleteProperty(document, 'readyState');
});

test('init 전에는 아무것도 보내지 않는다 — 테스트·SDK 없는 환경에서 no-op 이다', async () => {
  const { track } = await freshModule();

  track('saju_submitted', { entry: 'direct' });
  await Promise.resolve();

  expect(amplitudeTrack).not.toHaveBeenCalled();
});

test('init 뒤에는 이름과 속성을 그대로 보낸다', async () => {
  const { initAnalytics, track } = await freshModule();

  initAnalytics();
  await vi.waitFor(() => expect(init).toHaveBeenCalled());
  track('map_viewed', { variant: 'visitor', friendCount: 3 });

  expect(amplitudeTrack).toHaveBeenCalledWith('map_viewed', { variant: 'visitor', friendCount: 3 });
});

test('SDK 가 도착하기 전의 이벤트도 도착한 뒤 보낸다', async () => {
  const { initAnalytics, track } = await freshModule();

  initAnalytics();
  track('reading_viewed', { friendCount: 0 });
  expect(amplitudeTrack).not.toHaveBeenCalled();

  await vi.waitFor(() =>
    expect(amplitudeTrack).toHaveBeenCalledWith('reading_viewed', { friendCount: 0 }),
  );
});

test('autocapture 는 페이지뷰·세션·유입만 켜고 폼 입력은 끈다 — 입력값이 새지 않는다', async () => {
  const { initAnalytics } = await freshModule();

  initAnalytics();

  await vi.waitFor(() =>
    expect(init).toHaveBeenCalledWith(expect.any(String), {
      autocapture: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: false,
        fileDownloads: false,
      },
    }),
  );
});

test('페이지 load 전에는 SDK 를 받지 않고, load 뒤에 받아 그 사이 이벤트도 보낸다 — 첫 화면 대역폭을 나누지 않는다', async () => {
  Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
  const { initAnalytics, track } = await freshModule();

  initAnalytics();
  track('saju_submitted', { entry: 'direct' });
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(init).not.toHaveBeenCalled();

  window.dispatchEvent(new Event('load'));

  await vi.waitFor(() =>
    expect(amplitudeTrack).toHaveBeenCalledWith('saju_submitted', { entry: 'direct' }),
  );
});
