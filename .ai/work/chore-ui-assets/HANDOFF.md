# Handoff — chore-ui-assets

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

화면 Task들이 Figma에서 다시 내려받지 않고 `src/ui/assets/`의 이미지·아이콘을 import 해 쓸 수 있다.

## Work Completed

- `zodiac/` 12지신 투명 캐릭터 WebP (가로 720px, 원본 1024px+)
- `backgrounds/` night-lake(입력 화면) · star-ribbon(별 리본) · paper-grain(종이 질감, 1024px)
- `cards/` 점지 카드 앞면 배경 · 뒷면 · 뒷면(질감 없음) @3x
- `moon/moon.svg` 달 한 장(소유자가 레이어 3개를 합친 파일로 교체) · `orbs/` 귀인·찰떡·벗·스침 구슬 SVG
- AppShell 배경 달: radial-gradient 두 겹 → `[data-app-shell-backdrop]::before`에 `moon.svg`(150px, 중심 72%·18% 유지)
- `icons/` chevron-down·close·plus·arrow-right·instagram·rotate-right SVG

## Work In Progress

- 없음

## Files Changed

- `src/ui/assets/**` (신규 28개, 2.1MB)
- `src/app/layout.css`

## Decisions Made

- 위치는 `src/ui/assets/` (폰트가 `src/ui/tokens/fonts/`에 있는 관례, Vite import로 해시). 소유자 선택
- 래스터는 WebP, 참고용 스크린샷·배경 포함 원본·궁합 지도 합성본은 넣지 않음(텍스트·동적 요소 포함)
- 파일명은 Figma 레이어 이름 기준 kebab-case

## Tests Executed

- `pnpm lint` · `pnpm typecheck` · `pnpm build`
- WebP 크기·알파 확인, 미리보기 육안 확인
- `pnpm test`(32) · 전용 브라우저 localhost:5173 에서 달 렌더·moon.svg 200·콘솔 에러 없음

## Test Results

- 모두 통과. `::before` 배경은 jsdom에서 검증 불가라 단위 테스트 없음(브라우저 확인)

## Known Problems

- night-lake 원본 자체가 반투명(alpha 91–250, 평균 240) — 어두운 배경 위에 깔아야 디자인과 같다
- 인트로 영상, SS·A+ 손글씨 등급, 「02 / Shared Artwork」는 Figma에 이미지 레이어가 없어 미포함

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합
