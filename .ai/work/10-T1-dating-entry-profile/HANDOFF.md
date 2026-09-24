# Handoff — 10-T1-dating-entry-profile

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (Phase 10 Lead · src/app/ Owner — PR 리뷰) · 09/T2 로그인 담당(목 로그인 교체 지점 확인)
- Date: 2026-09-24
- Phase / Task: 10/T1

## Goal

소개팅 탭이 `GET /me` 로 비로그인·사주 없음·프로필 없음·등록 완료를 갈라 인트로·프로필 (1/2)·(2/2)·Top 3 자리로 보내고, 프로필 두 단계가 검증·오류·연결 실패 상태를 가진 채 저장까지 끝난다.

## Work Completed

- 목 데이터(`VITE_API_MOCK=true`)로 전 흐름 동작 — commit 2ee9119 (WIP)
- `/dating` 인트로: 401 이면 비로그인(카카오 시트), 아니면 로그인 인트로. '내 운명 찾아 떠나기'가 `GET /me` 를 다시 불러 (1/2)·(2/2)·`/dating/cards` 로 보냄. 조회 실패는 Toast 로 재시도 안내(FR-24)
- `/dating/profile`: `requireAuth` → 등록 완료면 Top 3 로 redirect. 사주 있으면 `GET /results/{id}/input` 으로 (1/2) 를 채우고 (2/2) 부터
- 제출: 사주 없으면 `POST /results` → 프로필 저장 → `/dating/cards`. 실패 시 입력 유지·alert, 재시도 때 사주 재생성 안 함. 사진은 고르는 즉시 업로드
- `/dating/cards`: `requireDatingProfile` + Placeholder (10/T3 자리)

## Work In Progress
- 없음 (BLOCKED — 아래 Known Problems)

## Files Changed

- src/api: `me.ts`·`dating.ts`·`uploads.ts`·`schema/{me,dating,upload}.ts` 새로, `results.ts:getResultInput`·`schema/result.ts:resultInputSchema` 추가 (+ 각 test)
- src/features/dating/entry/*: 진입 분기·loader·두 화면 컨테이너 (+ test), `index.ts` export
- src/app/routes: `dating.routes.tsx`(세 라우트) · `guards.ts`(requireAuth·requireDatingProfile) · `index.test.tsx`(AC1 6건)
- docs/api/openapi.yaml: `/results/{id}/input` · `/signups/photo-upload-url` · `/me` · PLAN T1 Touches 에 `src/api/`

## Decisions Made

- 로그인·로그아웃은 라우트가 넘긴다 — features ↔ features import 금지라 09/T2 의 features/auth 를 dating 이 직접 부를 수 없다. 지금은 `api/me.ts` 의 목 계정 on/off.
- 실제 모드의 프로필 저장은 경로를 추측하지 않고 요청 없이 실패(NOT_FOUND '준비 중')를 돌려준다.
- 인트로는 등록 완료 사용자도 자동으로 건너뛰지 않는다 — FR-24 대로 버튼을 눌러 Top 3 로 간다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results
- test 95 files / 484 passed · typecheck·lint 경고 0 · redocly: 기존 오류 1(ContactMethod nullable)·경고 4 그대로, 새 항목 없음
- 수동(브라우저) 확인은 아직 안 함

## Known Problems

- 인증 방식 불일치: 백엔드 api.md §6 은 `Authorization: Bearer`(쿠키 미사용), 저장소 NFR-7·ARCHITECTURE·ADR-20260923-v1-account 는 HttpOnly 쿠키. spec PR 필요 — 09/T2·Lead 판단. `origin/Feat/Login`(스트림 밖)은 Bearer+localStorage 로 구현됨
- `/api/dating/**` 명세 없음 — 저장 요청 모양(`schema/dating.ts`)은 가안
- 목 계정·목 결과는 메모리에만 있어 새로고침하면 초기화된다

## Unverified Assumptions

- 프로필 사진이 사전등록과 같은 `POST /signups/photo-upload-url` 을 쓴다
- 프로필 저장 요청이 `resultId` 로 사주를 연결한다 (로그인 후 만든 사주를 계정에 붙이는 방법이 명세에 없음)
- (2/2) 에서 (1/2) 로 돌아가 사주를 고쳐도, 이미 있는 사주는 다시 만들지 않는다 — 수정은 반영되지 않음

## Exact Next Action

부분 전달 PR 병합 뒤, 09/T2 병합 시 -r2 스트림에서 `dating.routes.tsx` 의 목 로그인/로그아웃을 features/auth 로 교체. PLAN T1 은 [ ] 유지.
