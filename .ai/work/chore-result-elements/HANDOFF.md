# Handoff — chore-result-elements

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

결과 화면 카드 아래에 사주 원국의 목·화·토·금·수 개수가 Figma 982:3446 대로 보인다.

## Work Completed

- `resultSchema.elements`(필수, 0 이상 정수) · ReadingView.elements · elementOrder(목→수)
- `ElementsSection` — 카드 5장(사이 7px), 아이콘 44px, 동국체 이름, 8칸 막대(8 초과는 8칸까지), 스크린리더에 'N개'
- 아이콘은 Figma SVG(inner shadow 필터)를 크롬 3배 PNG 로 구움 — iOS 필터 깨짐 회피
- openapi Elements 스키마·SharedResult.required, PRD FR-3

## Work In Progress

- 없음

## Files Changed

- `src/api/schema/result.ts` · `src/features/saju/{readingView,toReadingView,ReadingResult}.ts(x)` · `sections/ElementsSection.{tsx,css,test.tsx}` · `src/ui/assets/elements/*.png` · 목 응답·테스트 픽스처 · `docs/api/openapi.yaml` · `docs/PRD.md`

## Decisions Made

- 섹션 위치는 인스타 공유 버튼 아래·행운 위 — Figma 982:3446 에는 인스타 버튼이 없지만 요청 범위 밖이라 두었다
- 막대 칸·사이는 좁은 화면에서 비율로 줄인다(320px 카드 53px 에서도 넘침 없음)
- 채운 칸 색 5종·빈 칸 색은 Figma 원본 hex(토큰 없음)를 CSS 파일에 둔다

## Tests Executed

- pnpm test·lint·typecheck (exit code) · iOS 시뮬레이터 iPhone 17e `/preview/reading` · 크롬 320/360px 카드 치수

## Test Results

- 모두 exit 0 · test 357(신규 3) · iOS 아이콘 매끈·막대 개수 일치 · 320/360px 넘침 없음

## Known Problems

- 이름 글자색은 Figma 가 순수 검정인데 토큰 text-primary(#24292d)로 썼다
- main 작업 폴더에 다른 세션의 미커밋 변경(routes.tsx 뒤로가기, 스트림 chore-reading-back-always)이 있어 이 작업은 worktree `WKS-FE-elements` 에서 했다

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 worktree `WKS-FE-elements` 를 정리한다.
