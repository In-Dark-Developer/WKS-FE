# Handoff — 09-T20-shared-map-design-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 09/T20 (재개)

## Goal

궁합 지도의 궤도 선 네 줄이 늘 또렷하게 보이고, 구슬이 흐르는 동안에는 선이 함께 돌지 않는다.

## Work Completed

- QA "선이 안 보인다" 를 미리보기에서 재현 — 궤도를 200° 돌리면 밝은 구간이 패널 밖으로 나가 희미한 꼬리만 남는다
- 원인: 구슬 애니메이션만 `[data-motion='orbs']` 로 묶여 있고 궤도 선 회전에는 스코프가 없어 늘 돌고 있었다
- `SPIN_ORBITS_UNTIL = 2` 를 두고 `data-motion` 을 `orbs`·`orbits`·`none` 세 값으로 나눴다
- CSS 의 선 회전을 `[data-motion='orbits']` 아래로 옮겼다 — 구슬이 흐르면 선은 Figma 자리(0°)에 선다
- 기존 모션 테스트를 새 규칙으로 고쳤다 (1명 이하 orbits · 2명 none · 3명 이상 orbs)

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/map/CompatibilityMap.tsx` · `CompatibilityMap.css` · `CompatibilityMapScreen.test.tsx`

## Decisions Made

- 궤도 선이 도는 건 구슬 1개 이하일 때뿐이다 (2026-09-28 소유자 결정). 구슬 2개는 구슬도 선도 서 있다 — 구슬은 3명부터 흐르기 때문이다(FR-8).
- 회전을 아예 없애지 않았다 — 구슬이 없거나 하나뿐인 지도는 선이 돌아야 지도가 살아 있어 보인다는 원래 의도를 남긴다.
- 궤도 에셋은 고치지 않았다. 밝은 구간 하나만 그려진 것은 디자인 원본이고, 회전을 멈추면 그대로 또렷하다.

## Tests Executed

- `npx vitest run src/features/friends` · `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`
- 미리보기 육안 확인: `/preview/map` 의 SCR-08(6명·2명·빈 상태) · SCR-13 · SCR-24

## Test Results

- 전부 통과 — 116 files / 669 tests. 미리보기에서 네 궤도가 모두 또렷하고 구슬만 흐른다

## Known Problems

- PRD FR-8 문구는 아직 "궤도 선은 늘 제자리에서 30초에 한 바퀴 돌고" 다 — Notion PRD 를 이 결정에 맞게 고쳐야 한다(문서 담당에게 넘김).

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고, Notion PRD 의 FR-8 문장 수정을 요청한다.
