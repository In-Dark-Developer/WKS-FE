# Handoff — 10-T8-dating-card-size

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @gn00py48 (강근우 · `src/ui/` Owner — ProfileCard 변경) · @jjjung0921 (이정진 · Phase 10 Lead)
- Date: 2026-09-28
- Phase / Task: 10/T8

## Goal

Top 3 카드(앞면·뒷면·인연x)가 Figma 규격(343×433, radius 12, 흰 테두리)으로 보이고 화면 폭이 달라도 모양이 유지된다.

## Work Completed

- Figma 두 노드를 직접 읽어 규격을 확인했다 — 앞면 `96:1876`·뒷면/인연x `134:2527` 모두 **343×433**
- **원인**: 카드가 높이만 `h-[433px]` 로 고정돼 있었다. 레이아웃이 최대 430px(`layout.css`)이고 좌우 16px 여백이라 카드 폭이 328~398px 로 변하는데 높이는 433 고정 → 폭에 따라 모양이 달라졌다
- 고침: `aspect-[343/433] w-full` — 375px 화면에서 정확히 343×433 이고, 360px·430px 에서도 가로세로가 함께 늘어 모양이 같다
- 빈 카드(인연x)도 같은 비율로 맞췄다 — 후보가 모자랄 때 카드 높이가 들쭉날쭉하지 않는다(10/T11 이 빈 자리를 채운다)
- radius 12·흰 테두리는 이미 Figma 와 같아 건드리지 않았다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/ui/ProfileCard.tsx`(+테스트) · `src/features/dating/recommendation/DatingCards.tsx:EmptyCard`(+테스트)

## Decisions Made

- 폭을 343px 로 고정하지 않고 비율로 뒀다 — 고정하면 360px 화면에서 좌우 여백이 깨지고 430px 에서 가운데가 빈다. NFR-1(360~430px)을 지키려면 비율이 맞다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 115 files / 661 passed · typecheck·lint 경고 0

## Known Problems

- 카드 안쪽 글자·사진 크기는 비율에 따라 함께 늘지 않는다(고정 px) — 430px 화면에서 카드가 502px 높이가 되며 아래 여백이 조금 넓어진다. 눈으로 확인이 필요하면 알려 주세요
- 실기기 확인은 하지 않았다 — 테스트는 비율 클래스를 단언한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고 10/T9(글래스 효과)로 넘어간다.
