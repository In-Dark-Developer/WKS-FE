# Handoff — chore-header-hide-balance

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

소개팅 상단에는 운명의 실 버튼만 있고 보유 개수는 재화 안내 모달에서만 보인다.

## Work Completed

- `DatingHeader` 보유 개수 제거, 버튼 이름 `운명의 실 획득 방법 보기`

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/recommendation/{DatingHeader,DatingCards}.tsx` + 테스트 3곳

## Decisions Made

- 2026-09-27 소유자: 상단에서는 보유 개수를 보이지 않는다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 브라우저 미리보기

## Test Results

- 622 passed, 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음
