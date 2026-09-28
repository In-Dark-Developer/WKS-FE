# Handoff — 10-T1-saju-step-back

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: nicerjs23
- To: 없음
- Date: 2026-09-29
- Phase / Task: 10/T1

## Goal

프로필 (1/2)에서 로그인을 잃지 않고 소개팅 인트로로 돌아갈 수 있다.

## Work Completed

- `SajuStep` 이 `onBack` 을 받아 (2/2) 가 쓰던 `StepHeader` 의 뒤로가기를 (1/2) 에도 보인다
- `DatingProfileScreen.handleBack` 이 단계를 본다 — (1/2) 는 늘 `/dating` 인트로로, (2/2) 는 전처럼 들어온 길로
- 회귀 테스트 2개: (1/2) 에서 누를 때 · (2/2) 에서 (1/2) 로 돌아온 뒤 누를 때

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/profile/SajuStep.tsx` · `StepHeader.tsx` · `DatingProfileForm.tsx`
- `src/features/dating/entry/DatingProfileScreen.tsx` · `DatingProfileScreen.test.tsx`

## Decisions Made

- (1/2) 는 `navigate(-1)` 이 아니라 `/dating` 으로 바로 간다 — (1/2) 앞의 기록은 소개팅 밖일 수 있어 돌아갈 곳이 일정하지 않다.
- `replace: true` 로 간다 — 브라우저 뒤로가기에 (1/2) 가 다시 나오지 않게.
- 로그인은 건드리지 않는다. 세션은 쿠키가 들고 있고 화면만 바뀐다. 인트로는 `datingIntroLoader` 가 `GET /me` 로 다시 판정해 Intro 2.1(로그인)을 보인다.
- Figma `134:3490` 에는 (1/2) 뒤로가기가 없다 — QA 요청이 디자인을 덮는다. `StepHeader` 주석에 적었다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 118 파일 706 테스트 통과, typecheck·lint 경고 없음

## Known Problems

- 10/T1 은 여전히 `[ ]` 다 — 이 건과 별개로 실서버 검증이 남아 있다.

## Unverified Assumptions

- 없음

## Exact Next Action

목 모드(`VITE_API_MOCK=true`) 로컬에서 `/dating` → 프로필 (1/2) → 뒤로가기가 인트로로 오는지 본다.
