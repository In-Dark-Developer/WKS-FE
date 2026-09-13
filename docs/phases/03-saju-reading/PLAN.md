# Phase 03 — saju-reading

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 02
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

사주 입력 폼에서 시작해 운명 카드 결과 화면(운명 제목·설명, 연애운·결혼운·자녀운 등급 SS~B 6단계, 행운의 장소(동국대)·아이템)이 뜨고, 그 결과가 백엔드 응답에서 온다. 세션 없이 결과 화면에 들어오면 입력으로 안내된다.

## Motivation

제품의 첫 관문이자 이후 모든 기능(공유·궁합·소개팅)이 딛고 서는 데이터다. 백엔드 호출 계층과 경계 검증 방식도 이 Phase에서 한 번 정해두면 나머지 Phase가 따라 쓴다.

## Scope

- 사주 입력 폼(SCR-02): 성별(남/여) · 달력 기준(양/음력) · 생년월일 8자리 · 12시진 셀렉트 + '몰라요' · 닉네임 1–8자 (태어난 지역은 받지 않고 `birthRegion` 필드도 보내지 않는다 — 계약에서 빠짐), 기본/오류/연결문제/로딩 4상태
- 결과 대기(SCR-03)와 결과 화면(SCR-04): 운명 카드(십이간지 캐릭터·'○○보살님' 치환·운명 제목·설명·3영역 문자 등급 스탬프 SS~B 6단계), 행운의 장소·아이템 카드, 운세 카드 3장, 보살 말투 문구
- 세션 없음·만료 시 입력 화면으로 안내 (FR-18)
- `src/api/` 클라이언트: 요청/응답 zod 스키마, 에러·타임아웃 처리, 서버 상태 캐시 방식 결정(ADR)
- 백엔드 준비 전 개발을 위한 목(mock) 응답 경로

## Out of Scope

- 인트로 — MVP 제외 (PRD Non-goals)
- 공유 링크·인연카드·'인스타 스토리 공유하기' 버튼 (Phase 04)
- 궁합 점수·결과 화면 하단 '친구 궁합 순위' 섹터·사전신청 티저 (Phase 05·06)
- 로그인/세션 UI — 백엔드 인증 방식 확정 전까지 최소로만

## Dependencies

- Phase 02 — T4는 02/T2(기본 입력)·02/T6(Select) 병합 후, T3의 SCR-12 는 02/T4(`ContentState`)를 쓴다
- 백엔드 계약 `POST /results` · `GET /results/{id}` — WKS-BE dev b61f849 로 참조본 갱신(2026-09-13 r2, `docs/api/openapi.yaml`): `calendarType`·`isLeapMonth`·`birthTime` 가운데 시각, 응답 `shareId`·`zodiac`·`fortunes[].grade` 6단계. 세션 토큰은 계약에 없다(Q16)
- 백엔드 dev(b61f849)에 `POST /results` · `GET /results/{id}` · `GET /shares/{shareId}` · `POST /shares/{shareId}/compatibility` 가 있다 — 목 응답 경로는 백엔드 없이 개발·테스트할 때 쓴다
- 로컬 연동: 백엔드 CORS 는 `http://localhost:3000` 만 허용 — `vite.config.ts` `server.port` 를 3000 으로 맞춘다 (T1 Touches)
- 결과 대기 디자인(디자인시스템 FortuneLoading)과 결과 에러 상태 디자인

## Tasks

- [ ] T1. API 클라이언트 계층 + 경계 검증 — Done when: `POST /results` · `GET /results/{id}`의 요청/응답 봉투가 zod로 검증되고 스키마 위반·네트워크 실패·`error.code`(404·503)가 타입으로 구분되며 테스트가 통과 · Touches: `src/api/client.ts`, `src/api/results.ts`, `src/api/schema/`, `docs/api/openapi.yaml#/paths/~1results`, `docs/api/openapi.yaml#/paths/~1results~1{resultId}`, `vite.config.ts` · Owner: @nicerjs23

- [x] T2. 서버 상태 캐시·세션 보관 방식 ADR — Done when: ADR이 병합되고 `docs/ARCHITECTURE.md` State Management의 TBD가 사라진다 · Touches: `docs/decisions/`, `docs/ARCHITECTURE.md` · Owner: @jjjung0921 (commit cc82bf8)

- [x] T3. 라우트 등록 + 세션 안내 — Done when: `/`(입력)·`/reading/:id`(결과)가 `src/app/routes.tsx`에 등록되고, 세션 없이 `/reading/:id`에 들어오면 `/`로 안내되며(FR-18), 이후 Phase의 라우트 자리(`/reading/:id/card`, `/reading/:id/pre-register`, `/s/:shareId`, `/me/map`, `/matching`)가 주석으로 예약돼 있고, 모든 라우트의 `errorElement`·첫 진입 `HydrateFallback`이 공통 상태 화면(SCR-12 — 수정본 오류·연결문제·로딩 문구, `ContentState` 사용)을 그린다 (테스트 포함) · Touches: `src/app/routes.tsx`, `src/app/requireSession.ts`, `src/app/RouteError.tsx`, `src/app/RouteLoading.tsx`, `src/api/session.ts` · Owner: @jjjung0921 (commit cc0ebd7)

- [x] T4. 사주 입력 폼 — Done when: 성별·달력 기준·생년월일 8자리·12시진·닉네임 8자 검증과 '몰라요'→null 처리(`birthRegion` 은 보내지 않는다)가 동작하고, 필드별 에러 문구("생년월일을 숫자 8자리로 작성해 주세요" 등)·연결 실패 시 입력값 유지·로딩 상태가 디자인(수정본 4상태)대로 뜬다 (테스트 포함) · Touches: `src/features/saju/SajuForm.tsx`, `src/features/saju/formSchema.ts`, `src/features/saju/options.ts`, `src/features/saju/index.ts`, `src/ui/{Button,TextField,Select,SegmentedControl,Checkbox}.tsx`(수정본 appearance) · After: T1 · Owner: @jjjung0921 (commit 320a04a — action·라우트 연결은 T7)

- [x] T5. 결과 화면 퍼블리싱 — Done when: Figma 「UI 최종 - 개발용」 사주 결과 화면 Frame 93 내 사주(713:4021, 예전 558:2432)의 운명 카드(십이간지 캐릭터·'○○보살님'·운명 제목·설명·3영역 등급 스탬프 SS~B 6단계)·행운의 장소/아이템·운세 카드 3장과 결과 대기(FortuneLoading)·에러 상태가 `ReadingView` props 로만 렌더되고(응답 스키마·`src/api/` 를 import 하지 않는다), 다른 Phase 가 채울 `share`(04 인스타 공유)·`ranking`(05 친구 궁합 순위)·`teaser`(06 사전신청) 슬롯 prop과 하위 라우트용 `<Outlet />` 자리가 있으며(조립은 T7 — saju 가 share·friends·profile 을 import 하지 않는다), `/preview` 에서 가짜 데이터로 확인된다 (테스트 포함). 운명 카드 앞면은 04/T2 인연카드와 같아 `src/ui/DestinyCard.tsx` 에 둔다 · Touches: `src/features/saju/ReadingResult.tsx`, `src/features/saju/FortuneLoading.tsx`, `src/features/saju/sections/`, `src/features/saju/readingView.ts`, `src/features/saju/index.ts`, `src/ui/DestinyCard.tsx`, `src/ui/DestinyCard.css`, `src/ui/ZodiacCharacter.tsx`, `src/ui/assets/grades/`, `src/ui/assets/cards/`, `src/ui/tokens/theme.css`, `src/ui/tokens/fonts/`, `src/app/preview/screens/reading.tsx` · After: T6 · Owner: @jjjung0921 (commit 7fc2ccf)

- [x] T6. 퍼블리싱 확인 라우트 — Done when: 개발 서버에서만 `/preview` 가 화면 목록을, `/preview/<화면>` 이 가짜 데이터로 각 화면을 보여 주고(`import.meta.env.DEV`), `pnpm build` 산출물에 preview 코드가 없으며, 화면 추가는 `src/app/preview/screens/<화면>.tsx` 파일 하나로 끝난다(공유 목록 파일을 고치지 않는다 — `import.meta.glob`), 입력 화면(SajuForm)이 첫 항목으로 뜬다 (테스트 포함) · Touches: `src/app/App.tsx`, `src/app/preview/` · Owner: @jjjung0921 (commit 17512a9)

- [ ] T7. 입력·결과 연동 — Done when: `/` 가 SajuForm 과 action(검증된 SajuInput → `POST /results` → 세션 저장 → `/reading/:id` 로 redirect, 연결 실패는 `{ formError: 'connection' }`)으로, `/reading/:id` 가 loader(`GET /results/{id}` → `ReadingView` 변환)로 동작하고, 404·503·스키마 위반이 errorElement 로 가며, 백엔드 준비 전에는 T1 의 목 응답으로 입력 → 결과를 완주한다 (테스트 포함) · Touches: `src/app/routes.tsx`, `src/features/saju/sajuAction.ts`, `src/features/saju/readingLoader.ts`, `src/features/saju/toReadingView.ts` · After: T1, T4, T5 · Owner: @nicerjs23

<!-- 선후는 각 Task 의 After: 가 기준이다 (T4 After: T1 · T5 After: T6 · T7 After: T1·T4·T5). T5·T6 은 T1 없이 진행한다.
     퍼블리싱 먼저(2026-09-13): 화면(T4·T5)은 props 뷰 모델로만 그리고 `/preview` 에서 가짜 데이터로 확인한다. 데이터 연결(action·loader·응답→뷰 모델 변환)은 T7 이 한다. T5 담당 @nicerjs23 → @jjjung0921, 연동은 T7 @nicerjs23.
     라우트 파일은 충돌 지점이라 한 Task 만 소유한다 — T3(완료) 이후는 T7. 다른 Task는 자기 화면 컴포넌트·loader·action만 export 한다. preview 는 `App.tsx`(T6)에서 붙여 routes.tsx 와 겹치지 않는다.
     옵션 값(12시진)은 `features/saju/options.ts`(T4)에 두고 ui Select(02/T6)에는 props로만 넘긴다. API 파일은 자원별로 나눈다 — `client.ts`는 T1, `session.ts`(localStorage 세션 보관 — ADR-20260913-server-state-and-session-storage)는 T3 소유이고 다른 Task는 import 만. `session.ts`를 T1에서 T3으로 옮겼다(2026-09-13) — T3의 가드가 T1을 기다리지 않게. -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-02·03·04·12), FR-2, FR-3, FR-18, NFR-2, NFR-4
- `docs/ARCHITECTURE.md` — Data Flow 1, State Management, Cross-cutting Concerns
- `docs/api/openapi.yaml` — `/results`, `/results/{resultId}`
- Figma 「UI 최종 - 개발용」 558-2430 — 수정본(기본/오류/연결문제/로딩중), 사주 결과 화면 Frame 69

## Acceptance Criteria

- [ ] AC1. 입력 → 결과를 이탈 없이 완주할 수 있다
- [ ] AC2. 태어난 시간을 '몰라요'로 두어도 결과를 받을 수 있고, 음력·윤달 입력이 전송되며, 지역 입력 없이 `birthRegion` 필드를 보내지 않는다
- [ ] AC6. 세션 없이 `/reading/:id`에 들어오면 입력 화면으로 안내된다
- [ ] AC3. 백엔드 응답이 스키마와 다르면 화면이 깨지지 않고 에러 안내가 뜬다
- [ ] AC4. 입력 폼과 결과 화면에 단위·컴포넌트 테스트가 있다
- [ ] AC5. `src/app/routes.tsx`를 T3(완료)·T7 외의 Task가 수정하지 않았다

## Validation Plan

- AC1·AC2: 목 응답으로 흐름 수동 확인 + 폼 테스트
- AC3: 스키마 위반 응답을 주입한 테스트
- AC4: `pnpm test`
