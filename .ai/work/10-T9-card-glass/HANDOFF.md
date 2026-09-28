# Handoff — 10-T9-card-glass

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @gn00py48 (강근우 · `src/ui/` Owner — 토큰 3개 추가) · @jjjung0921 (이정진 · Phase 10 Lead)
- Date: 2026-09-28
- Phase / Task: 10/T9

## Goal

카드의 반투명(글래스) 면이 Figma 카드 앞면(`91:1641`)과 같은 블러·투명도로 보이고, 사진이 있든 없든 글자가 읽힌다.

## Work Completed

- Figma 값을 직접 읽어 대조했다. **이미 같던 것**: 사진 흐림 `blur 10px`(`101:2071`) · 아래 어두운 그러데이션(검정까지 약 58%, opacity 90)
- **달랐던 것**: 사진 위에 얹히는 세 유리 면에 채움이 없거나 불투명했다
  - '카드 뒤집기' 칩 — 채움 없음 → **흰색 18%**(`134:2275`). 밝은 사진 위에서 글자가 묻히던 원인이다
  - Top 배지 — 불투명 `bg-neutral-700` → **회색 50%**(`96:1891`, 원본 #3c3c3c)
  - 점수 원 — 테두리만 → **채움 20%**(`101:1972`, 원본 #786926)
- 세 값이 디자인 토큰에 없어 `theme.css` 에 더했다(`opacity-card-neutral-0-18`·`opacity-card-badge-50`·`opacity-card-score-20`). 하단 네비 토큰처럼 **원본 paint** 라는 주석을 달았다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/ui/tokens/theme.css` · `src/ui/ProfileCard.tsx`(+테스트) · `src/features/dating/card/CandidateFaces.tsx`(+`CandidateCard.test.tsx`) · PLAN T9 Touches

## Decisions Made

- 토큰을 더했다(소유자 승인 2026-09-28) — 임의 색(`bg-[rgba(...)]`)은 컨벤션이 막고, 기존 토큰에 18%·50%·20% 가 없었다
- 점수 원의 지름은 그대로 뒀다(48px, Figma 45px) — 이 Task 는 블러·투명도를 맞추는 것이라 크기는 건드리지 않았다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 115 files / 661 passed · typecheck·lint 경고 0

## Known Problems

- 눈으로 본 확인은 하지 않았다 — 테스트는 토큰 클래스를 단언한다. 밝은 사진 위 가독성은 실기기에서 한 번 봐야 한다
- Figma 는 사진을 두 겹(blur 10px + 7.5px)으로 깔지만 우리는 한 겹이다 — 눈에 띄는 차이가 아니라 그대로 뒀다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고 10/T10(카드 뒤집기 애니메이션)으로 넘어간다.
