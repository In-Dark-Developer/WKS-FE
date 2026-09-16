// Amplitude 브라우저 key — 번들에 실려 공개되는 값이다(GA4 측정 ID 와 같은 등급, index.html).
// 서버 API key 가 아니라 비밀값이 아니다 — ADR-20260916-amplitude-product-analytics.
const API_KEY = '0829db3a91ddacee78bef8e460503e0a';

// 사주 입력으로 들어온 입구: '/'(direct) · 공유 링크(share).
export type SajuEntry = 'direct' | 'share';

// '친구에게 공유' 3단 폴백이 어디까지 갔는지(features/share/link/shareLink.ts 의 ShareOutcome).
// lib 은 features 를 import 하지 않으므로(ARCHITECTURE 의존 방향) 이벤트 속성 쪽 목록을 여기 둔다.
type ShareOutcome = 'shared' | 'cancelled' | 'copied' | 'manual';

// 화면·행동 이벤트 한 벌. 속성에 개인정보(닉네임·생년월일·연락처)를 넣지 않는다 — 개수·구분값만 보낸다
// (CONVENTIONS 9장).
type EventProps = {
  // 사주 입력 제출과 그 실패(연결·스키마·백엔드 모두).
  saju_submitted: { entry: SajuEntry };
  saju_failed: { entry: SajuEntry };
  // SCR-04 사주 결과 도착.
  reading_viewed: { friendCount: number };
  // SCR-08 내 궁합 지도 · SCR-13 친구의 궁합 지도.
  map_viewed: { variant: 'own' | 'visitor'; friendCount: number };
  // '친구에게 공유' 누름.
  share_clicked: { surface: 'reading' | 'map'; outcome: ShareOutcome };
  // 공유 링크로 들어온 사람의 궁합이 만들어졌다(FR-6).
  compatibility_created: Record<string, never>;
  // 사전신청(FR-9·FR-10) — 모달을 열었다 · 접수됐다(`mailSent` 는 인증 메일 발송 여부) · 실패했다.
  pre_register_opened: Record<string, never>;
  pre_register_submitted: { mailSent: boolean };
  pre_register_failed: { reason: 'duplicate' | 'domain' | 'connection' };
};

type Amplitude = typeof import('@amplitude/analytics-browser');

// 'off' 에서는 아무것도 보내지 않는다 — 테스트(jsdom)는 init 을 부르지 않으므로 track 이 no-op 이다.
let state: 'off' | 'loading' | 'ready' | 'failed' = 'off';
let client: Amplitude | null = null;
// SDK 가 도착하기 전의 이벤트(첫 화면의 reading_viewed 등)를 잃지 않으려고 잠깐 모은다.
const pending: { name: string; props: Record<string, unknown> }[] = [];

// 앱 진입점에서 한 번 부른다. SDK 는 동적 import 로 첫 화면 번들 밖에 두고 뒤따라 받는다 — 축제 현장의
// 모바일 회선에서 첫 화면이 분석 SDK 를 기다리지 않게 한다(ADR-20260916-amplitude-product-analytics).
// 페이지뷰·세션·유입 경로는 SDK 의 autocapture 가 맡고(SPA 경로 전환 포함), 폼 상호작용·파일 다운로드는
// 끈다 — 깔때기 단계는 track 이벤트로 직접 보낸다.
export function initAnalytics(): void {
  if (state !== 'off') return;
  state = 'loading';
  void import('@amplitude/analytics-browser')
    .then((amplitude) => {
      amplitude.init(API_KEY, {
        autocapture: {
          attribution: true,
          pageViews: true,
          sessions: true,
          formInteractions: false,
          fileDownloads: false,
        },
      });
      client = amplitude;
      state = 'ready';
      for (const event of pending) amplitude.track(event.name, event.props);
      pending.length = 0;
    })
    .catch(() => {
      // 광고 차단기·오프라인으로 SDK 를 못 받는 경우 — 분석은 포기하고 앱은 그대로 간다.
      state = 'failed';
      pending.length = 0;
    });
}

export function track<Name extends keyof EventProps>(name: Name, props: EventProps[Name]): void {
  if (state === 'ready' && client) {
    client.track(name, props);
    return;
  }
  if (state === 'loading') pending.push({ name, props });
}
