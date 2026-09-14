# ADR-20260913: 서버 상태는 React Router 데이터 API로 읽고, 세션은 `api`가 localStorage 한 키에 보관한다

- Status: Accepted — 세션 보관 절은 Superseded by ADR-20260914-result-ownership-in-browser (서버 상태 절은 유효)
- Date: 2026-09-13
- Deciders: @jjjung0921 (제안) / 리뷰어는 PR 승인자

## Context

Phase 03 부터 화면이 백엔드를 부른다. `docs/ARCHITECTURE.md` State Management 는 두 가지를 TBD 로 남겼다 — 서버 상태 캐시/요청 방식, 세션 토큰의 브라우저 보관 방식과 만료 처리.

- 서버 상태: 결과(`GET /results/{id}`)는 생성 뒤 바뀌지 않고 LLM 재호출 없이 DB 에서 온다. 바뀌는 것은 `compatibilities`(친구가 궁합을 볼 때마다 늘어남)뿐이다. 생성(`POST /results`)은 LLM 을 거쳐 수 초 걸리고 호출마다 새 결과를 만든다. 엔드포인트는 7개다.
- 라우팅은 이미 React Router 7 데이터 라우터(`createBrowserRouter`)다. 의존성에 요청/캐시 라이브러리는 없다.
- 세션: 로그인은 없다. 백엔드가 보내 주는 세션 토큰만으로 내 데이터를 찾고 세션을 유지한다(PRD 2026-09-13 결정, 소유자 재확인). `resultId` 는 공유 링크 재료이지 내 데이터의 식별자가 아니다. 백엔드 계약(`api-spec.md`, 2026-09-13 18:31)과 `openapi.yaml` 참조본에는 아직 토큰이 없다(1차 범위에서 "로그인·세션" 제외, `security: []`) — 발급 시점·전달 방식·만료 코드·토큰으로 조회하는 엔드포인트는 PRD Q16 으로 백엔드에 요청 중이다.
- FR-18: 세션이 없거나 만료되면 궁합 지도·소개팅 화면에서 사주 입력으로 안내한다. 축제는 3일(2026-09-29~10-01)이라 재방문 사이에 세션이 살아 있어야 한다.
- NFR-2: 초기 JS < 250KB(gzip), NFR-6: iOS Safari·Android Chrome. 링크는 카카오톡·인스타그램 인앱 브라우저로도 열린다.
- CONVENTIONS: 네트워크 호출은 `src/api/` 에서만, 응답은 zod 로 파싱한 뒤 화면으로.

## Problem

1. 화면은 서버 데이터를 어떻게 불러오고, 로딩·에러·재요청·캐시를 어디서 다루는가.
2. 세션 토큰을 브라우저 어디에 두고, 누가 읽고 쓰며, 만료를 어떻게 알아채는가 — Q16 답이 오기 전에도 T1(목 응답)·T3(라우트 가드)가 시작할 수 있어야 한다.

## Alternatives

서버 상태

1. **TanStack Query** — 키 기반 캐시·중복 제거·재시도·포커스 재요청이 기본이다. 의존성이 하나 늘고, 라우터의 로딩 상태와 쿼리 로딩 상태가 두 곳에 생긴다. 바뀌지 않는 결과가 대부분인 이 앱에서 캐시 무효화 기능은 거의 쓰지 않는다.
2. **React Router 데이터 API(loader · action · fetcher)** — 이미 쓰는 라우터에 들어 있다. 화면이 그려지기 전에 데이터를 받아 워터폴이 없고, 로딩은 `useNavigation`·`fetcher.state` 한 곳에서 나온다. 라우트 사이 캐시는 부모 loader 공유(`useRouteLoaderData`)와 `shouldRevalidate` 로만 한다.
3. **컴포넌트 훅(`useEffect` + api 함수)** — 도구가 없다. 화면마다 로딩·에러·경쟁 상태 처리를 다시 짜고, 렌더 뒤에 요청이 시작된다.

세션 보관

4. **localStorage** — 탭·브라우저를 닫아도 남아 축제 기간 재방문에 맞는다. JS 가 읽을 수 있어 XSS 에 노출된다. 인앱 브라우저와 기본 브라우저는 저장소가 따로다.
5. **sessionStorage** — 탭을 닫으면 사라져 재방문 요구와 맞지 않는다.
6. **프론트가 쓰는 쿠키** — localStorage 와 노출은 같고, 모든 요청에 실려 가며 크기 제한만 늘어난다.
7. **백엔드가 심는 HttpOnly 쿠키** — JS 가 토큰을 못 읽어 XSS 에 강하다. 백엔드의 쿠키 발급·CORS credentials·SameSite 설정과 배포 도메인이 필요하고, 프론트가 세션 유무를 스스로 알 수 없어 가드마다 백엔드 조회가 필요하다.

## Decision

서버 상태 — 대안 2.

- `src/api/` 는 fetch·zod 파싱·에러 분류만 하는 함수를 export 한다(Phase 03 T1). 라우터를 모른다.
- 읽기는 route `loader`, 쓰기는 route `action` 또는 `useFetcher` 가 api 함수를 부른다. loader·action 은 그 화면의 feature 가 export 하고 `src/app/routes.tsx` 가 등록한다(등록은 T3 소유 그대로).
- `/reading/:id` 는 부모 라우트 loader 가 `GET /results/{id}` 를 한 번 부르고, 하위 화면(`card` 등)은 `useRouteLoaderData` 로 같은 데이터를 쓴다. 결과 본문은 바뀌지 않으므로 하위 이동에서는 `shouldRevalidate` 로 다시 부르지 않는다. `compatibilities` 를 보여 주는 화면(`/me/map`)은 진입할 때마다 다시 부른다.
- 결과 생성(`POST /results`)은 action 에서 부르고, 성공하면 세션을 쓴 뒤 `redirect('/reading/:id')`. 결과 대기(FortuneLoading)는 `useNavigation().state === 'submitting'` 으로 보인다.
- 자동 재시도는 GET 만 1회다. POST 는 호출마다 새 결과·새 LLM 호출이 생기므로 재시도하지 않는다.
- loader·action 이 던진 에러는 라우트 `errorElement` 가 받아 공통 상태 화면(SCR-12)을 그린다.

세션 — 대안 4, 보관 위치를 한 모듈에 가둔다.

- 세션은 백엔드가 보낸 토큰 하나다. `src/api/session.ts` 만 저장소를 읽고 쓴다: `readSession()` · `writeSession()` · `clearSession()`. 키는 `wks:session` 하나, 값은 `{ v: 1, token }` JSON 이고 읽을 때 zod 로 파싱한다. 파싱 실패·스토리지 접근 예외(차단된 스토리지)는 세션 없음으로 보고, 파싱 실패면 키를 지운다.
- `resultId` 는 세션에 넣지 않는다. 내 결과·신청·실은 토큰으로 조회하고, `resultId` 는 그 응답에서 받아 공유 링크에만 쓴다.
- 쓰는 곳은 토큰을 받는 응답 한 곳이다(Q16 — `POST /results` 응답으로 예상). 토큰은 `src/api/client.ts` 한 곳에서만 요청에 싣는다. 헤더(`Authorization: Bearer`) 전달을 전제로 하며, 백엔드가 HttpOnly 쿠키(대안 7)로 정하면 가드가 백엔드 조회로 바뀌므로 새 ADR 로 다시 정한다.
- 만료는 프론트가 시계로 판단하지 않는다. 백엔드가 세션 무효(Q16 이 정할 코드)로 응답하면 api 가 `clearSession()` 하고 그 에러를 받은 loader 가 `/` 로 redirect 한다.
- 보호 라우트(FR-18) 가드는 loader 에서 `readSession()` 이 없으면 `redirect('/')` 한다(T3 `RequireSession`). `app` 이 `api/session` 을 import 하는 것은 허용한다(`app → api` — 기존 방향 안).
- 백엔드가 토큰을 주기 전에는 T1 의 목 응답이 토큰을 돌려준다 — 실제 백엔드로는 보호 화면에 들어갈 수 없다.

## Rationale

- 결정적 기준은 "바뀌지 않는 데이터가 대부분 + 9/17 마감 + 이미 가진 라우터"다. 캐시 무효화가 필요한 곳은 `compatibilities` 하나이고 진입 시 재요청으로 충분하다. 새 의존성과 두 번째 로딩 상태를 들일 이유가 없다.
- loader 는 렌더 전에 요청을 시작해 화면마다 로딩·에러 코드를 반복하지 않는다. 에러가 `errorElement` 한 곳으로 모여 SCR-12 공통 상태 화면과 맞는다.
- 세션의 형식(토큰 하나)은 정해졌고 계약 세부(시점·전달·만료 코드)만 남았다. 저장 위치·형식을 `api/session.ts`, 싣는 곳을 `client.ts` 한 곳으로 가두면 Q16 답은 두 파일에만 닿는다. localStorage 는 3일 재방문과 인앱 브라우저를 포함한 모든 대상 브라우저에서 동작하고, 프론트가 세션 유무를 요청 없이 알 수 있어 가드가 단순하다.

## Consequences

- 긍정: 의존성 추가 없음. 로딩·에러가 라우터 한 곳에서 나온다. T3 은 Q16 답 없이 `readSession()` 으로 가드를 만들 수 있고, T1 은 라우터와 무관한 순수 api 함수만 만든다.
- 백엔드 1차 계약에 토큰이 없어 백엔드 작업이 필요하다 — 백엔드가 토큰을 발급하기 전까지 실제 연동으로는 입력 → 결과(`/reading/:id`) 흐름이 가드에 막힌다.
- 부정 / 감수한 것:
  - 토큰을 localStorage 에 두면 XSS 로 읽힐 수 있다 — 매칭 성립 뒤 연락처가 이 세션으로 열린다(NFR-4). 제3자 스크립트를 넣지 않고 `dangerouslySetInnerHTML` 을 쓰지 않는 것으로 줄인다.
  - 인앱 브라우저(카카오톡·인스타그램)에서 만든 세션은 기본 브라우저로 넘어가지 않는다 — 다른 브라우저에서 열면 입력 화면으로 안내된다.
  - 같은 결과를 여러 라우트 트리에서 쓰면 캐시가 없어 다시 부른다. 필요해지면 새 ADR 로 대안 1 을 다시 본다.
  - 데이터 라우터의 첫 진입은 loader 가 끝날 때까지 `HydrateFallback` 이 보인다 — 라우트에 대기 화면을 지정해야 한다(T3).
- 후속 작업:
  - `docs/ARCHITECTURE.md` State Management·Persistence·External Systems·Cross-cutting Concerns 갱신 (이 PR)
  - Phase 03 T1: `src/api/session.ts`, `client.ts` 의 토큰 헤더·GET 재시도 1회·세션 무효 시 `clearSession()`, 토큰을 돌려주는 목 응답
  - Phase 03 T3: 보호 라우트 loader 가드, `errorElement`·`HydrateFallback`
  - Phase 03 T4·T5: 폼 제출은 action, 결과는 부모 loader 데이터
  - 백엔드에 토큰 발급·전달·만료·조회 엔드포인트 요청(Q16). 답이 오면 `openapi.yaml` 참조본과 `session.ts`·`client.ts` 를 갱신하는 spec 스트림
