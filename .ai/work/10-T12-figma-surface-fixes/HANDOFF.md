# Handoff — 10-T12-figma-surface-fixes

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: nicerjs23
- To: 없음
- Date: 2026-09-28
- Phase / Task: 10/T12

## Goal

소개팅 상단 바와 프로필 (2/2) 사진 추가 칸이 Figma 원본 paint 그대로 보인다.

## Work Completed

- 상단 바(10/T12 재작업): 배경을 Rose/50 50% → 살구빛 #ffa1a1 10% 로. Figma `91:1790` 의 `rgba(255,161,161,0.1)` 다
- 사진 추가 칸(10/T14): 흰 카드 + Border/Default, 미리보기 311×393, 버튼 Rose/300 흰 글자. Figma `134:3639`
- `Button` 에 `rose` variant 추가 — `SegmentedControl` 의 선택 칸과 같은 Rose/300 이다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/recommendation/DatingHeader.tsx` · `src/ui/PhotoUpload.tsx` · `src/ui/Button.tsx` · `src/ui/tokens/theme.css`
- 테스트: `DatingHeader.test.tsx` · `PhotoUpload.test.tsx`

## Decisions Made

- Figma top_nav 에는 배경 흐림 효과가 없다 — 채움만 10% 라 뒤 그라데이션이 비친다. `backdrop-blur` 를 넣지 않았다.
- 미리보기는 Figma 의 고정 393px 대신 `aspect-[311/393]` 로 둔다 — 같은 비율이면서 폭이 달라도 안 깨진다(10/T8 과 같은 이유). 인연 카드(343:433)와 같은 비율이다.
- 안내 문구는 그대로 둔다 — Figma 의 'JPEG·PNG, 최대 10MB로 등록해주세요' 와 뜻이 같고 저장소 말투를 따른다(PRD Q10).

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 116 파일 678 테스트 통과, typecheck·lint 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

`/preview/dating-cards`(상단 바)와 `/preview/dating-profile` 의 `(2/2) 기본`(사진 칸)에서 눈으로 확인한다.
