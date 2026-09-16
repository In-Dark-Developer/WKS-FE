# ADR-20260916: 제품 분석은 Amplitude SDK 로, 깔때기 이벤트는 손으로 건다

- Status: Accepted
- Date: 2026-09-16
- Deciders: @jjjung0921 (소유자, 지시) / 리뷰어는 PR 승인자

## Context

출시 전 축제 현장 유입·전환을 볼 수단이 `index.html` 의 GA4 태그(commit ca28bad) 하나뿐이다. GA4 는 페이지뷰·세션은 보지만 이 앱의 깔때기(사주 입력 → 결과 → 공유 → 친구 궁합 생성, FR-4·FR-6)를 단계별로 보기 어렵다. 소유자가 Amplitude 프로젝트를 만들고 브라우저 key 를 전달했다.

제약: 사용자는 축제 현장의 모바일 회선으로 들어오고(CONVENTIONS 4장 — 기준은 모바일), 현재 첫 화면 번들은 gzip 155.64 kB 다. 개인정보(닉네임·생년월일·연락처)는 프론트에 남기지 않는다(CONVENTIONS 9장).

## Problem

Amplitude 를 어떻게 붙이고, 무엇을 이벤트로 보낼 것인가. 그리고 브라우저 key 를 저장소에 둘 것인가.

## Alternatives

1. **SDK npm 의존성 + 정적 import** — 장점: 타입이 있고 autocapture 를 설정으로 켠다. 단점: 첫 화면 번들이 gzip 155.64 → 218.70 kB (+63 kB) 로 늘어 결과를 기다리는 첫 화면이 느려진다.
2. **SDK npm 의존성 + 동적 import** (선택) — 장점: 1 의 장점에 더해 SDK 가 별도 청크(gzip 63.93 kB)로 빠져 첫 화면 번들이 +0.6 kB 에 그친다. 단점: SDK 도착 전 이벤트를 잠깐 모아 두는 코드가 필요하다(`src/lib/analytics.ts`).
3. **`index.html` 스크립트 스니펫** (GA4 와 같은 방식) — 장점: 의존성이 없다. 단점: 이벤트 이름·속성에 타입이 없어 오타가 런타임까지 간다. 깔때기 이벤트를 손으로 걸 것이라 타입이 있는 쪽이 낫다.
4. **autocapture 의 element/form 추적으로만 본다** — 장점: 코드를 안 고친다. 단점: 폼 상호작용 추적은 사주 입력 화면의 필드까지 훑어 개인정보가 샐 위험이 있고, 이벤트 이름이 DOM 구조에 묶여 화면을 고치면 지표가 끊긴다.

## Decision

2 를 택한다.

- `@amplitude/analytics-browser` 를 의존성에 넣고, `src/lib/analytics.ts` 가 SDK 를 동적 import 로 감싼 유일한 창구다. `initAnalytics()` 는 `src/main.tsx` 에서 한 번 부른다.
- autocapture 는 `attribution`·`pageViews`·`sessions` 만 켜고 `formInteractions`·`fileDownloads` 는 끈다.
- 깔때기 이벤트는 타입이 고정된 목록으로 손수 보낸다: `saju_submitted` · `saju_failed` · `reading_viewed` · `map_viewed` · `share_clicked` · `compatibility_created`. 속성에는 개수·구분값만 넣고 개인정보는 넣지 않는다.
- 화면 도착 이벤트는 컴포넌트가 아니라 라우트 loader 에서 보낸다 — 이동마다 한 번이라 StrictMode 의 이중 마운트에 겹치지 않는다.
- 브라우저 key 는 `src/lib/analytics.ts` 의 상수로 저장소에 둔다.

## Rationale

- 번들: 첫 화면이 분석 SDK 를 기다리지 않아야 한다. 동적 import 로 +0.6 kB 에 그치는 값을 위해 이벤트 대기열 10여 줄은 싼 값이다.
- 개인정보: 폼 추적을 끄고 이벤트 속성을 타입으로 좁히면 무엇이 나가는지가 파일 하나에서 다 보인다(CONVENTIONS 9장).
- key: Amplitude 브라우저 key 는 번들에 실려 어차피 공개되는 식별자다 — GA4 측정 ID(`G-K458Q00SJ3`, `index.html`)와 같은 등급이며 서버 API key 가 아니다. 환경변수로 옮기면 Netlify 빌드 설정에 숨은 의존이 생기고 값이 빠진 빌드가 조용히 분석을 잃는다.

## Consequences

- 긍정: 깔때기를 단계별로 본다. 이벤트 이름·속성이 한 파일에 모여 타입으로 강제된다. 테스트는 `initAnalytics()` 를 부르지 않으므로 track 이 no-op 이라 mock 이 필요 없다.
- 부정 / 감수한 것: GA4 와 Amplitude 가 함께 돈다(둘 다 유지). 광고 차단기가 SDK 청크를 막으면 그 방문의 이벤트는 사라진다 — 앱 동작에는 영향이 없다. 새 화면을 붙일 때 이벤트를 손으로 걸어야 한다.
- 후속 작업: 배포 후 Amplitude 실시간 보고서로 이벤트 도착 확인. Phase 06 사전신청 모달이 붙으면 그 전환 이벤트를 목록에 추가한다.
