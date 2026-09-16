# Handoff — chore-map-back-link

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (`src/app/` Owner — 리뷰) · @gn00py48 (`src/ui/` — 뒤로가기 줄을 ui 로 올릴지 판단)
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

내 궁합 지도(`/me/map`)에서 결과 화면과 같은 모양의 뒤로가기로 내 사주 결과로 돌아갈 수 있다.

## Work Completed

- QA 보고(2026-09-17): `/me/map` 에 내 사주로 돌아갈 길이 없다 → 뒤로가기 추가

## Work In Progress

- 없음 (소유자 push 승인 대기)

## Files Changed

- `src/app/routes.tsx`(`BackRow` 로 모음·지도 뒤로가기·loader 가 `myResultId` 전달) · `src/app/routes.test.tsx`
- `src/features/friends/map/CompatibilityMapScreen.tsx`(`back` 슬롯, 뒤로가기~지도 24px)·`.test.tsx` · `src/app/preview/screens/map.tsx`

## Decisions Made

- 공통 뒤로가기 컴포넌트가 없어 `routes.tsx` 안 인라인 마크업을 `BackRow` 로 모아 결과 화면·지도가 같이 쓴다 — `src/ui/` 로 올리는 것은 ui Owner 판단
- 이동은 `navigate(-1)` 이 아니라 `/reading/{내 resultId}` 로 — 지도에 직접 들어오거나 새 탭이면 돌아갈 기록이 없다
- loader 가 보관된 `resultId` 를 함께 넘긴다(주소에 없다)
- 뒤로가기~지도 간격은 24px(`mb-12`+`gap-12`) — 결과 화면 48px 보다 좁다(소유자 확인 2026-09-17, 지도는 카드가 바로 이어져 48px 이면 비어 보인다)

## Tests Executed

- `pnpm test`·`typecheck`·`lint`
- 목 dev(3010 요청 → vite 가 3001 사용) + playwright: 입력 → 결과 → 지도 보기 → 뒤로가기

## Test Results

- 354 tests pass(신규 3), typecheck·lint 0
- 브라우저: 지도 뒤로가기 → `/reading/{내 id}` 복귀, 콘솔 에러 0. 360·390·430px 가로 넘침 0

## Known Problems

- 결과 → 지도 → 뒤로가기는 기록을 쌓는다(결과, 지도, 결과) — 브라우저 뒤로가기는 지도로 간다. 문제되면 `replace` 로 바꾼다

## Unverified Assumptions

- 없음

## Exact Next Action

소유자 승인 → push → PR.
