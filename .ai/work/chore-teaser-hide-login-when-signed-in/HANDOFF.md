# Handoff — chore-teaser-hide-login-when-signed-in

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

로그인한 사용자에게는 메인 티저의 '이미 아이디가 있어요'가 보이지 않는다.

## Work Completed

- `/` index route 에 loader(`GET /me`) 추가, `MainTeaser` 의 `onHaveAccount` 를 선택으로 — 없으면 링크를 그리지 않는다

## Work In Progress

- 없음

## Files Changed

- src/app/routes/saju.routes.tsx · src/features/intro/MainTeaser.tsx · src/app/routes/index.test.tsx

## Decisions Made

- `GET /me` 조회 실패는 비로그인으로 본다 — 로그인할 길을 막지 않으려고
- 티저 테스트는 loader 가 끝날 때까지 기다린다(renderTeaser async)

## Tests Executed

- pnpm test · typecheck · lint
- 목 모드 브라우저: 로그인 → 링크 없음, 비로그인 → 링크 있음

## Test Results

- test 575 통과 · typecheck · lint 경고 0

## Known Problems

- `/` 첫 화면(인트로 영상 포함)이 `GET /me` 응답을 기다린 뒤 그려진다

## Unverified Assumptions

- 없음

## Exact Next Action

PR CI 확인 후 병합
