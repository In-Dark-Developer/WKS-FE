# Handoff — chore-grand-open-font

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

결과 화면 사전신청 섹션의 'GRAND OPEN !!' 이 디자인(873:1871)과 같은 서체·크기로 보인다.

## Work Completed

- `cafe24-pro-slim-max.woff2` 추가 — 카페24 공식 배포본(`Cafe24PROSlimMax_v2.0.zip`)의 `Webfont/` 파일을 변환 없이 그대로
- `theme.css` @font-face · `--font-slim` · `--text-display-40`(40/1.2), `cn.ts` 스케일 목록
- 티저 제목을 `font-slim text-display-40` 로
- 백엔드 확장분 운영 배포 확인을 openapi·PRD Q14·PLAN 에 반영

## Work In Progress

- 없음

## Files Changed

- `src/ui/tokens/fonts/cafe24-pro-slim-max.woff2`(+README) · `src/ui/tokens/theme.css` · `src/lib/cn.ts` · `src/features/profile/PreRegisterTeaser.tsx` · `docs/api/openapi.yaml` · `docs/PRD.md` · `docs/phases/06-dating-gate/PLAN.md`

## Decisions Made

- 공식 배포본에 woff2 가 들어 있어 서브셋·변환 없이 그대로 넣었다(fonts/README.md 규칙)
- `--text-display-40` 은 디자인시스템 스타일이 아니라 그 화면의 크기라 주석으로 출처를 남겼다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · 브라우저(`/preview/pre-register?state=티저`)

## Test Results

- test 344 통과 · typecheck·lint 무경고 · build 에 woff2 156.69 kB 포함 · `document.fonts.check('40px "Cafe24 PRO Slim Max"')` true

## Known Problems

- 없음

## Unverified Assumptions

- Figma 의 `Cafe24 PRO Slim:Max` 가 배포본 `Cafe24 PRO Slim Max` 와 같은 파일이라고 보았다 — 자간·굵기 차이는 실기기에서 눈으로 확인할 몫이다

## Exact Next Action

PR merge 후 배포본에서 결과 화면 제목 서체를 눈으로 확인한다.
