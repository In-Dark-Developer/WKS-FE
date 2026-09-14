# Phase 05 — friend-score

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 04
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

공유 링크로 들어온 친구의 사주로 궁합 점수와 등급(귀인 ≥90 · 찰떡 75–89 · 벗 61–74 · 스침 ≤60)이 산출되어 양쪽 궁합 지도(구슬·등급별 인원·순위)와 결과 화면 하단 순위 요약에 쌓인다.

## Motivation

Phase 04 가 결과를 밖으로 내보내는 링크(`/s/<shareId>`)를 만들었지만, 그 링크를 누른 친구가 도착할 화면이 없다. 지금 친구는 없는 경로 화면을 본다. 이 Phase 가 링크의 도착지(공유 랜딩) → 친구의 사주 입력 → 궁합 결과를 잇고, 그 결과가 링크 주인의 순위·지도에 쌓이게 해야 '공유 → 친구 유입 → 소개팅' 흐름의 두 번째 고리가 닫힌다.
궁합 지도(SCR-08)는 퍼블리싱(T2)과 라우트(T3)가 이미 따로 진행 중이다. 이 계획이 채우는 것은 **공유 링크로 들어온 방문자 쪽 흐름**이다. SCR-06·07 디자인이 아직 없어서 퍼블리싱-먼저 원칙대로 디자인이 필요 없는 API 연동(T4)을 먼저 열고, 화면 퍼블리싱(T5·T6)은 디자인이 오면 연다.

## Scope

- 공유 링크 흐름: SCR-06 공유 랜딩(`/s/:shareId`) → 방문자 사주 입력(SCR-02 `SajuForm` 재사용, `/s/:shareId/input`) → SCR-07 궁합 결과(`/s/:shareId/result`) — FR-6, FR-7, FR-14, FR-15
- `src/api/` — `GET /shares/{shareId}` · `POST /shares/{shareId}/compatibility` 호출과 zod 스키마, 목 응답 경로
- 궁합 산출 뒤 링크 주인의 결과 화면 순위(SCR-04)·궁합 지도(SCR-08)에 방문자가 나타나는 것의 확인 (FR-8, FR-14 — 표시는 T2·T3 몫)
- 이미 진행 중: SCR-08 궁합 지도 퍼블리싱(T2) · `/me/map` 라우트와 `compatibilities` 스키마 정정(T3)

## Out of Scope

- 궁합 점수·등급 계산 — 백엔드가 `score`·`tier` 를 준다(FR-7, 화면은 계산하지 않는다)
- 궁합 지도 구슬 배치 규칙(PRD Q11) — T2 가 디자인 고정 좌표로 처리했다
- 공유 링크 미리보기 OG 메타·썸네일(NFR-3) — Phase 08 T4
- 방문자 → 소개팅 사전신청 연결 — Phase 06
- 궁합 결과 이미지 공유 — 디자인·기획에 없다

## Dependencies

- Phase 04 — T8(결과 화면 Figma 맞춤, REVIEW) 병합 전이다. 이 계획의 조립 Task(T7)는 `routes.tsx` 를 04/T8·05/T3 뒤에 받는다
- **05/T3 병합** — 운영 백엔드 `compatibilities[]` 항목은 `{ score, tier, originNickname, guestNickname }`(2026-09-15 `/v3/api-docs` `CompatibilityResponse`)인데 현재 `compatibilitySummarySchema` 는 `nickname`·`createdAt` 을 요구한다. 친구 궁합이 한 건이라도 생기면 `GET /results/{id}` 파싱이 실패해 결과 화면이 오류가 된다 — T3 Done-when 이 고친다. T4 는 그 스키마를 재사용한다
- **SCR-06 공유 랜딩 · SCR-07 궁합 결과 디자인 — 현재 없음 (PRD Q9).** T5·T6 은 디자인이 오기 전에는 열지 않는다. T4 는 디자인이 필요 없다
- PRD Q12 — 공유 랜딩에서 링크 주인의 닉네임을 보이는가. 결정 전까지 T5 는 닉네임을 선택 prop 으로 받는다(없으면 닉네임 없는 문구)
- 백엔드 계약 — `GET /shares/{shareId}` 는 `SharedResultResponse`(결과와 같고 `resultId`·`shareId` 없음, 404 `RESULT_NOT_FOUND`). `POST /shares/{shareId}/compatibility` 는 `{ guestResultId }` → 새로 만들면 201, 이미 있는 조합이면 재계산 없이 200(같은 값), 링크 주인 결과와 같으면 400 `SELF_COMPATIBILITY`, `score(A,B) == score(B,A)`. `docs/api/openapi.yaml` 참조본과 운영 Swagger 가 일치한다(2026-09-15)
- 세션 — 공지 `2026-09-14-result-ownership`: `/s/:shareId` 는 가드가 없고, `guestResultId` 는 이 브라우저가 보관한 `resultId` 다. 방문자가 입력하면 보관값이 방문자의 새 결과로 바뀐다
- 미정 — 이미 사주를 본 방문자(보관된 `resultId` 있음)가 입력을 건너뛰고 바로 궁합을 볼 수 있는가. 디자인이 없어 결정하지 않는다. 기본은 FR-6 대로 다시 입력받는다(T7), 디자인이 건너뛰기를 보이면 T7 에서 바꾼다
- 로컬 확인 — 운영 백엔드 CORS 가 `http://localhost:3000` 을 막고 `http://localhost:5173` 은 허용한다(2026-09-15, Phase 03 RESULT Known Issues). 실제 백엔드로 흐름을 확인할 때는 5173 으로 띄우거나 해결을 기다린다

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/05-friend-score/` · Owner: @nicerjs23

- [x] T2. 궁합 지도 퍼블리싱 — Done when: Figma 「UI 최종 - 개발용」 지도 「최종」(558:2570, v2 등급별 색 구슬)의 달·궤도·친구 구슬(귀인·찰떡·벗·스침)·등급별 인원 4칸·친구 궁합 순위·빈 상태가 props(내 닉네임·친구 목록 `{ nickname, score, tier }`)로만 렌더되고 `/preview` 에서 가짜 데이터로 확인된다 (테스트 포함). 구슬 배치 규칙이 미정이면(PRD Q11) 디자인 배치를 고정 좌표로 쓴다 · Touches: `src/features/friends/map/`, `src/features/friends/index.ts`, `src/ui/assets/orbs/`, `src/ui/assets/backgrounds/compatibility-map.svg`, `src/app/preview/screens/map.tsx` · Owner: @jjjung0921 (commit 5be8419 — 결과 화면 순위 요약은 `FriendRanking` 을 03/T7 이 `ranking` 슬롯에 넣는다)

- [ ] T3. 궁합 지도 라우트와 결과 화면 '지도 보기' — Done when: `/me/map` 이 `routes.tsx` 에 등록돼 보관된 `resultId` 가 없으면 `/` 로 보내고(FR-18), 있으면 `GET /results/{resultId}` 의 `compatibilities` 를 친구 목록(상대 닉네임 = 내 닉네임이 아닌 쪽, 점수 높은 순)으로 바꿔 `CompatibilityMapScreen` 에 넘기며, 결과 화면 친구 궁합 순위 제목 줄의 '지도 보기 >'(Figma 798:3138)가 `/me/map` 으로 이동하고, `compatibilities` 응답 스키마가 백엔드 실제 모양(`score`·`tier`·`originNickname`·`guestNickname`)으로 파싱된다 (테스트 포함) · Touches: `src/app/routes.tsx`, `src/app/routes.test.tsx`, `src/api/schema/result.ts`, `src/api/schema/result.test.ts`, `src/features/saju/readingView.ts`, `src/features/saju/toReadingView.ts`, `src/features/saju/toReadingView.test.ts`, `src/features/friends/`, `src/app/preview/screens/map.tsx`, `src/api/results.ts`, `src/api/results.test.ts` · After: 04/T8 · Owner: @jjjung0921

<!-- T3(2026-09-15): 소유자 결정으로 T1 상세 계획 전에 궁합 지도 라우트를 먼저 연다 — 결과 화면 순위에 '지도 보기'(Figma 798:3138)가 추가됐다. 공유 랜딩·궁합 산출(SCR-06·07)은 여전히 T1 이 채운다.
     퍼블리싱 먼저(2026-09-13): T2 는 Phase 04 완료·T1 상세 계획을 기다리지 않는다(props 만). 등급별 인원 계산·조회 연동은 T1 이 채울 Task 다. 03/T6 병합 뒤 시작한다. -->

- [ ] T4. 공유·궁합 API 연동 — Done when: `src/api/shares.ts` 의 `getSharedResult(shareId)`·`createCompatibility(shareId, guestResultId)` 가 `request()` 로 호출하고 응답을 zod 로 파싱해 `ApiOutcome` 을 돌려주며, `SharedResultResponse` 는 `resultId`·`shareId` 없이 파싱되고 `compatibilities` 는 05/T3 이 정정한 스키마를 재사용하며, 201·200 이 같은 성공으로, 404 `RESULT_NOT_FOUND`·400 `SELF_COMPATIBILITY` 가 `{ kind: 'api', code }` 로 구분되고, POST 는 재시도하지 않으며, `VITE_API_MOCK=true` 면 파일 안 목 응답(주인 1명·결정적 점수·보관 `resultId` 가 주인과 같으면 `SELF_COMPATIBILITY`)을 돌려준다 (테스트 포함) · Touches: `src/api/shares.ts`, `src/api/shares.test.ts`, `src/api/schema/share.ts`, `src/api/schema/share.test.ts` · After: T3 · Owner: @nicerjs23

- [ ] T5. SCR-06 공유 랜딩 퍼블리싱 — Done when: SCR-06 디자인대로 링크 주인 닉네임(선택 prop — Q12)과 '내 사주로 궁합 보기' CTA 가 props 로만 렌더되고, 주인의 사주 요약(운명 제목·설명·등급·십이간지)이 props 에도 DOM 에도 없으며(FR-15), `/preview` 에서 닉네임 있음·없음 두 상태를 가짜 데이터로 볼 수 있다 (테스트 포함). `src/api/` 를 import 하지 않는다 · Touches: `src/features/friends/landing/`, `src/features/friends/index.ts`, `src/app/preview/screens/share-landing.tsx` · Owner: 미정 (디자인 도착 후 배정 — Q9)

- [ ] T6. SCR-07 궁합 결과 퍼블리싱 — Done when: SCR-07 디자인대로 두 닉네임·점수(0–100)·등급 이름과 색(`tiers.ts` 의 귀인·찰떡·벗·스침 — 화면이 점수로 등급을 계산하지 않는다)과 '나도 내 사주 보기'(내 결과로)·'친구에게 공유' CTA 가 props 로만 렌더되고, `/preview` 에서 네 등급 각각과 '자기 링크'(SELF_COMPATIBILITY 안내) 상태를 가짜 데이터로 볼 수 있다 (테스트 포함). `src/api/` 를 import 하지 않는다 · Touches: `src/features/friends/compatibility/`, `src/features/friends/index.ts`, `src/app/preview/screens/compatibility-result.tsx` · Owner: 미정 (디자인 도착 후 배정 — Q9)

- [ ] T7. 공유 링크 흐름 조립 — Done when: `routes.tsx` 에 가드 없는 `s/:shareId`(loader `GET /shares/{shareId}` → 랜딩 뷰 모델, 404 는 없는 링크 오류 화면) · `s/:shareId/input`(`SajuForm` + 방문자 action: `POST /results` 성공 → `POST /shares/{shareId}/compatibility`(방금 보관된 `resultId`) → `/s/:shareId/result` 로 이동, 실패는 `{ formError: 'connection' }` 로 입력값 유지) · `s/:shareId/result`(loader: 보관된 `resultId` 가 없으면 `/s/:shareId` 로, 있으면 같은 POST 로 기존 값 200 을 받아 새로고침에도 같은 점수, `SELF_COMPATIBILITY` 면 `/reading/:resultId` 로)가 등록되고, 궁합이 만들어진 뒤 링크 주인의 `GET /results/{id}` `compatibilities` 에 방문자가 들어간다 (테스트 포함 — 목 응답·라우트 테스트) · Touches: `src/app/routes.tsx`, `src/app/routes.test.tsx`, `src/features/friends/shareLandingLoader.ts`, `src/features/friends/guestSajuAction.ts`, `src/features/friends/compatibilityLoader.ts` (각 `*.test.ts`), `src/features/friends/index.ts` · After: T4, T5, T6, 04/T8 · Owner: @nicerjs23

<!-- 05/T1 상세 계획(2026-09-15, @nicerjs23): 디자인(Q9)이 없어 T4(API)만 바로 열 수 있다. T5·T6 은 디자인이 오면 Owner 를 정해 연다 — 화면 퍼블리싱이 T2·T3·04/T8 을 해 온 @jjjung0921 쪽과 겹치지 않게 배정한다.
     SCR-06·07 을 friends feature 에 둔 이유: 궁합 지도(T2)·등급 이름(`friends/map/tiers.ts`)과 같은 도메인이고, share feature 는 링크를 '내보내는' 쪽(04)이다. 방문자 입력은 saju 의 `SajuForm` 을 app 이 새 action 과 함께 조립한다(features 끼리 import 금지).
     SCR-07 loader 가 POST 를 다시 부르는 이유: 백엔드가 이미 있는 조합을 재계산 없이 200 으로 주므로 새로고침·재방문에도 같은 점수를 받는 유일한 경로다(점수만 조회하는 GET 이 계약에 없다). -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-06·07·08), FR-6, FR-7, FR-8, FR-14, FR-15
- Figma 「UI 최종 - 개발용」 — 지도 섹션(최종 v2: 등급별 색 구슬), 사주 결과 화면 Frame 51(친구 궁합 순위 빈 상태)
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. 공유 링크(`/s/<shareId>`)로 들어오면 세션 없이 랜딩이 열리고, 링크 주인의 사주 요약(운명 제목·설명·등급·십이간지)이 화면과 DOM 어디에도 없다. 닉네임은 Q12 결정대로 보이거나 숨는다 (FR-15, FR-18)
- [ ] AC2. 방문자가 사주를 입력하면 두 사람의 궁합 점수(0–100)와 등급(귀인·찰떡·벗·스침)이 보이고, 등급은 응답 `tier` 그대로다 (FR-6, FR-7)
- [ ] AC3. 궁합 결과를 새로고침하거나 다시 열어도 같은 점수가 보이고, 보관된 결과 없이 결과 주소로 오면 랜딩으로 안내된다
- [ ] AC4. 궁합이 만들어진 뒤 링크 주인의 결과 화면 친구 궁합 순위와 궁합 지도에 방문자가 나타난다 (FR-8, FR-14)
- [ ] AC5. 없는 `shareId` 는 오류 화면, 자기 링크로 궁합을 요청하면 자기 결과로 안내되고, 연결 실패 시 입력값이 남은 채 재시도 안내가 뜬다
- [ ] AC6. `src/features/friends/` 의 화면 컴포넌트가 `src/api/` 를 import 하지 않고, SCR-06·07 의 모든 상태를 `/preview` 에서 가짜 데이터로 볼 수 있다 (publishing-first)
- [ ] AC7. 새 화면·로직에 테스트가 있고 Commands 4개가 경고 없이 통과한다

## Validation Plan

- AC1·AC6: T5 컴포넌트 테스트(주인 요약 텍스트 부재 단언) + `src/features/friends/` 에서 `@/api` grep + `/preview` 수동 확인
- AC2·AC5: T4 API 테스트(201·200·404·SELF_COMPATIBILITY·스키마 위반) · T7 action·loader·라우트 테스트(목 응답)
- AC3: T7 라우트 테스트 — 보관값 없음·있음, 같은 POST 200 재호출
- AC4: 실제 백엔드로 브라우저 두 개(주인·방문자) 수동 1회 — 주인이 결과를 만들고 `/s/<shareId>` 를 방문자 브라우저에서 입력한 뒤 주인 결과 새로고침. 운영이면 결과 2건·궁합 1건·LLM 2회가 생긴다. 로컬은 5173 포트(CORS)
- AC7: `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`
