# Handoff — chore-map-orb-timing

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/features/` Owner — 리뷰)
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

궁합 지도 구슬이 10초 보이고 10초 숨으며(붐비면 숨는 시간만 길어짐), 같은 궤도 자리는 친구마다 고정 랜덤이되 겹치지 않고, 구슬 수 제한이 없다(소유자 요청 2026-09-15).

## Work Completed

- `orbLayout.ts`: 닉네임 FNV-1a 시드로 칸 안 비껴 놓기(비껴 나는 폭 = 칸 − 44px), 흐름 둘레 `loop` = 2×보이는 호×max(1, 인원×44 / 기본 둘레), 주기 `duration` = 10초×loop/span
- `CompatibilityMap.css`: 깜빡임 키프레임 대신 궤도 중심 부채꼴 마스크(보이는 호만, 양 끝 12% 서서히) · 팔 회전 주기 CSS 변수
- `CompatibilityMap.tsx`: 5명 제한 삭제, 팔 요소 추가 · `/preview` '친구 24명(붐비는 궤도)' (commit 24b8aed)
- PRD FR-8 · PLAN AC8

## Work In Progress

- 없음 (PR 리뷰 대기)

## Files Changed

- `src/features/friends/map/{orbLayout.ts,CompatibilityMap.tsx,CompatibilityMap.css}`(+test) · `src/app/preview/screens/map.tsx` · `docs/PRD.md` · `docs/phases/05-friend-score/PLAN.md`

## Decisions Made

- 소유자: 보이는 10초 = 숨는 10초, 친구마다 고정 랜덤, 인원 제한 없음, 붐비면 숨는 시간 늘리기(b)
- 숨김을 시간(키프레임 %)이 아니라 자리(부채꼴 마스크)로 한다 — 궤도마다 주기가 달라도 키프레임 한 벌로 보이는 시간이 10초로 고정된다
- 최소 간격 44px(구슬 지름 31 + 닉네임 여유). 멈춘 지도(0~2명·동작 줄이기)는 보이는 호 안에만 놓여 한 궤도 약 6명부터 맞닿는다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build` · 목 서버 `/preview/map` 24명: 0·5·12·25초 시점 보이는 구슬 간 최소 거리, 궤도별 주기, 마스크 적용

## Test Results

- test 321 passed, 경고 없음, build 성공 · 모든 시점 최소 간격 44px, 스침 10명 주기 29.7초(귀인 8명·찰떡 6명은 20초), 콘솔 오류 없음

## Known Problems

- 멈춘 지도(동작 줄이기)에서 한 궤도 6명 이상이면 구슬이 맞닿는다 · 마스크 경계에서 구슬이 반쯤 잘려 보이며 사라진다(서서히 흐려짐)

## Unverified Assumptions

- iOS Safari 에서 CSS 변수가 든 `conic-gradient` 마스크 — 데스크톱 Chromium 으로만 확인

## Exact Next Action

PR 병합 → 실기기(iOS Safari·Android Chrome)에서 궁합 지도 확인
