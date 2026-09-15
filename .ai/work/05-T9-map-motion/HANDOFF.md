# Handoff — 05-T9-map-motion

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/features/` Owner — 리뷰) · @gn00py48 (`src/ui/` 에셋 분리 — 리뷰)
- Date: 2026-09-15
- Phase / Task: 05/T9

## Goal

궁합 지도의 구슬이 등급 색 궤도 위에 놓이고, 궤도 선이 돌며 3명 이상이면 구슬이 보이는 구간을 흐르고 같은 시간 숨고, 동작 줄이기면 멈춘다 (PLAN 05/T9).

## Work Completed

- `compatibility-map.svg` 를 바탕·`compatibility-orbit-1..4.svg`·`compatibility-moon.svg` 로 분리(기존 SVG 안 레이어 그대로, Figma 재추출 없음)
- `orbLayout.ts` — 등급별 궤도(귀인 #91BDC8 → 찰떡 → 벗 → 스침), 보이는 호 계산, 멈춘 자리·흐름 파라미터(같은 궤도 균등 출발, 궤도마다 엇갈림)
- CSS — 궤도 선 30초 제자리 회전, 3명+ 구슬 팔 회전 + 몸 반대 회전 + 앞 절반만 보임, `prefers-reduced-motion: no-preference` 에서만 (commit a763e6e)
- PRD FR-8 배치·움직임 문장, PLAN T9·AC8

## Work In Progress

- 없음 (PR 리뷰 대기)

## Files Changed

- `src/features/friends/map/CompatibilityMap.tsx`·`.css`·`orbLayout.ts`(+test)·`CompatibilityMapScreen.test.tsx` · `src/ui/assets/backgrounds/compatibility-{map,moon,orbit-1..4}.svg` · `docs/PRD.md` · PLAN T9

## Decisions Made

- 소유자: 0~2명/3명+ 기준, 30초, 등급 색 궤도(달에서 가까운 줄부터 귀인·찰떡·벗·스침), 구슬은 보이는 구간만 흐르고 같은 시간 숨는다
- 달 중심 한 덩어리 회전은 반 바퀴 동안 구슬이 칸 밖이라 기각(`/preview` 15초 지점 확인)
- 궤도마다 출발을 엇갈림(에이전트) — 등급이 모두 달라도 한꺼번에 숨지 않는다. 벗 궤도(271.9×267.6)는 원으로 흐른다(오차 2px 안)
- PRD FR-8 을 이 스트림에서 고침(Touches 에 `docs/PRD.md` 추가, Rule 7 예외)

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build` · 개발 서버(목) `/preview/map` 친구 6명: 애니메이션을 0~28초로 옮겨 보이는 구슬·칸 안 여부 대조, 12초 스크린샷, 친구 2명 모드

## Test Results

- test 306 passed, typecheck·lint 경고 없음, build 성공 · 매 시점 1~3개 보이고 모두 칸 안, 구슬이 제 색 궤도 위·닉네임 똑바로, 콘솔 오류 없음

## Known Problems

- 한 궤도에 5명이면 보이는 구슬은 그중 절반쯤이다(설계대로) · 닉네임 8자가 가까운 두 구슬에서 글자끼리 스칠 수 있다

## Unverified Assumptions

- 실기기(iOS Safari·Android Chrome)에서 키프레임 안 CSS 변수(`var(--from)`) 애니메이션 — 데스크톱 Chromium 으로만 확인

## Exact Next Action

PR 병합 → 실기기 두 대로 궁합 지도 움직임 확인(08/T6 과 함께)
