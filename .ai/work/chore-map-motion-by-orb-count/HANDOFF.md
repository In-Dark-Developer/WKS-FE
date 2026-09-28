# Handoff — chore-map-motion-by-orb-count

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/-

## Goal

궁합 지도는 구슬이 1개 이하면 궤도 선만, 2개 이상이면 선은 멈추고 구슬만 움직이며, 공유 링크 진입 지도도 같다.

## Work Completed

- 움직임 규칙: 구슬 ≤1 → 'orbits'(선만 30초 회전), ≥2 → 'orbs'(선 0° 고정, 구슬 흐름). 아무것도 안 움직이던 2명 'none' 상태 제거
- 공유 링크 진입 초대 지도의 isStill(09/T18, #298) 제거 — QA '선은 있으나 다 멈춰 있어요'
- PRD FR-8 을 새 규칙으로 개정(2026-09-29 소유자 결정)

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/{ShareInvite.tsx,ShareInvite.test.tsx,map/CompatibilityMap.tsx,map/CompatibilityMap.css,map/orbLayout.ts,map/CompatibilityMapScreen.test.tsx}` · `src/app/preview/screens/map.tsx` · `docs/prd/30-functional-requirements.md`

## Decisions Made

- 구슬 0개(빈 지도)도 선이 돈다 — '1개 이하'로 보고 늘 무언가는 움직이게 했다
- #298 의 초대 지도 멈춤은 소유자 지시로 되돌렸다(흐르는 구슬은 보이는 호 밖에서 잠시 숨는다)

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 기기의 '동작 줄이기' 설정이 켜져 있으면 규칙과 상관없이 전부 멈춘다(NFR)

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰.
