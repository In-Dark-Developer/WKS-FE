# Handoff — 09-T7-saju-form-route

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 09/T7

## Goal

'내 사주 보기'로 들어간 사주 입력에서 브라우저 뒤로가기를 누르면 티저로 돌아온다.

## Work Completed

- `/` = IntroGate(첫 방문 인트로) + 메인 티저, `/saju` = SajuForm + sajuAction (`SAJU_INPUT_PATH`)
- '내 사주 보기'는 결과 없으면 `/saju` push — 기록이 쌓여 뒤로가기가 `/` 로
- `IntroGate` 는 인트로만 맡는다 — 티저 지남 기록(#219·#227 의 teaserPassed·keepPassedOnLeave) 제거
- PRD SCR-01·02 경로, FR-1·FR-19 문구, ARCHITECTURE Persistence

## Work In Progress

- 없음

## Files Changed

- `src/app/routes/saju.routes.tsx` · `src/features/intro/{IntroGate.tsx,introSeen.ts,IntroGate.test.tsx}` · `src/app/routes/index.test.tsx` · `docs/prd/20-screens.md` · `docs/prd/30-functional-requirements.md` · `docs/ARCHITECTURE.md`

## Decisions Made

- 소유자 요청(2026-09-26): 폼에서 뒤로가기 → 티저. 폼을 라우트로 분리. `/` 는 이제 언제나 티저(사주 있는 사용자도 `/` 로 오면 티저)
- 가드·결과 없음 redirect('/') 는 그대로 — 사주 없으면 티저가 홈(FR-19)

## Tests Executed

- `pnpm test`(539)·`typecheck`·`lint` · 로컬 브라우저: `/` → '내 사주 보기' → `/saju`(history 2) → 뒤로가기 → `/` 티저

## Test Results

- 통과

## Known Problems

- `src/lib/analytics.ts` 주석의 입구 설명 `'/'(direct)` 는 Touches 밖이라 남겼다(값은 경로가 아니라 'direct' 라 동작 영향 없음)

## Unverified Assumptions

- 없음

## Exact Next Action

없음.
