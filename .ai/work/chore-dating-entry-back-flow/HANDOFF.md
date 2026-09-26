# Handoff — chore-dating-entry-back-flow

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

Figma 76-3402 흐름대로 소개팅 진입이 이어지고, 프로필 (2/2) 뒤로가기가 들어온 길 그대로 돌아간다 — (1/2) 를 거쳤으면 (1/2), 인트로에서 곧장 왔으면 인트로.

## Work Completed

- 프로필 단계를 `?step=` 로 관리(DatingProfileForm 은 step·onStepChange·onBack 을 받는 controlled)
- (2/2) '뒤로가기': 방문 기록이 있으면 navigate(-1), 첫 방문이면 `/dating` replace
- 카카오 로그인 복귀 경로 `/dating` → `/dating/profile` (loader 가 1/2·2/2·Top 3 결정)
- 같은 pathname 안 단계 이동은 loader 재실행 안 함(shouldRevalidate)

## Work In Progress

- 없음

## Files Changed

- src/features/dating/entry/DatingProfileScreen.tsx(+test) · profile/DatingProfileForm.tsx(+test)
- src/app/routes/dating.routes.tsx · src/app/preview/screens/dating-profile.tsx

## Decisions Made

- 사주가 있는 사용자(흐름 2)는 (1/2) 로 돌아갈 수 없다 — (1/2) 수정값은 저장되지 않기 때문(POST /dating/profile 에 사주 필드 없음)

## Tests Executed

- pnpm test · typecheck · lint
- 목 모드 브라우저: 인트로(로그인) → (1/2) → (2/2) → 뒤로가기 → (1/2)(입력 유지) → 브라우저 뒤로 → 인트로

## Test Results

- test 573 통과 · typecheck · lint 경고 0

## Known Problems

- 카카오 로그인 뒤 (1/2) 에서 브라우저 뒤로가기는 카카오 로그인 페이지 기록이 남아 있으면 그쪽으로 간다(외부 기록이라 앱이 못 지운다)
- 로그인했으므로 돌아온 인트로는 1.1.1(카카오 시트)이 아니라 2.1(로그인)이다

## Unverified Assumptions

- 없음

## Exact Next Action

PR CI 확인 후 병합
