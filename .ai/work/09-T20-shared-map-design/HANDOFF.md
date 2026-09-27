# Handoff — 09-T20-shared-map-design

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 09/T20

## Goal

공유 링크로 들어와 궁합을 만든 뒤의 주인 지도(SCR-24·SCR-13)가 Figma 15:1089·16:1827 과 같은 배치·색으로 보인다.

## Work Completed

- SCR-24 '나의 궁합 순위' — 내 줄을 가운데 두고 바로 앞·뒤 순위를 함께, 내 줄은 등급 색(Figma 15:1301 주석 '나의 점수(등수)가 가운데에 오도록')
- 미리보기 `/preview/map` 에 'SCR-24 공유 궁합 결과' 상태 추가

## Work In Progress

- 없음

## Files Changed

- `src/app/screens/SharedResultScreen.tsx`(+test) · `src/features/friends/map/FriendRanking.tsx` · `src/app/preview/screens/map.tsx`

## Decisions Made

- 내 줄 배지는 기존 등급 배지 그대로(궁합 이유 시트의 선택한 줄과 같은 모양) — Figma 는 흰 원 배지

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- QA 스크린샷 원인: 궤도 선 SVG(Figma v1.0 궤도 Ellipse 5~8 과 같은 에셋)는 붓 자국이라 일부 구간이 어둡다. 우리는 30초에 한 바퀴 돌려(FR-8, 9/15 소유자 결정) 구슬 자리의 선이 어두울 때가 있다 — Figma v1.0 은 정지. 멈추려면 FR-8 을 먼저 바꿔야 한다
- 친구 3명 이상이면 구슬이 흐르며 절반은 숨는다(FR-8) — Figma v1.0 은 모두 보임. 같은 결정 대상
- SCR-13 Figma 의 '친구 이름을 눌러 자세한 정보를 확인해보세요.' 안내는 방문자가 남의 궁합 이유를 못 열어 두지 않았다

## Unverified Assumptions

- 없음

## Exact Next Action

소유자 결정: 궤도 선 회전을 멈출지(Figma v1.0 정지) — 멈추면 spec(FR-8) PR 먼저.
