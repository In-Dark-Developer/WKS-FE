# Handoff — chore-logout-clears-browser-result

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

로그아웃하면 이 브라우저의 '내 결과'(`wks:session`)가 지워져 홈·궁합 지도에 계정 결과가 남지 않는다.

## Work Completed

- `logout` 이 성공(목 포함) 뒤 `clearSession()` — 실패면 남긴다
- ADR-20260927-logout-clears-browser-result

## Work In Progress

- 없음

## Files Changed

- src/api/auth.ts · src/api/auth.test.ts · docs/decisions/ADR-20260927-logout-clears-browser-result.md

## Decisions Made

- 대안 A(로그아웃 시 전부 비움)를 소유자가 선택 — 덮어쓴 경우만 되돌리는 B 는 기각

## Tests Executed

- pnpm test · typecheck · lint
- 목 모드 브라우저: 결과 있는 로그인 상태에서 소개팅 로그아웃 → `wks:session` null · 비로그인 인트로

## Test Results

- test 577 통과 · typecheck · lint 경고 0

## Known Problems

- 계정에 연결되지 않은 비로그인 결과는 로그아웃 뒤 이 브라우저에서 되찾을 수 없다(ADR 감수 사항)

## Unverified Assumptions

- 없음

## Exact Next Action

PR CI 확인 후 병합
