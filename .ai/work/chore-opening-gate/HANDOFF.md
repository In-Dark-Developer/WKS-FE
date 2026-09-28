# Handoff — chore-opening-gate

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

운영 배포에서 2026-09-29 09:00 KST 전에는 어떤 주소로 들어와도 오픈 대기 화면만 보이고, 그 시각이 되면 새로고침 없이 서비스가 열린다.

## Work Completed

- 오픈 전에는 라우터를 만들지 않는다 — loader·API 요청이 나가지 않는다
- 카운트다운이 0 이 되면 라우터를 만들고 서비스로 넘어간다
- `[context.production.environment] VITE_OPEN_AT` — dev 배포·PR 미리보기는 막지 않는다

## Work In Progress

- 없음

## Files Changed

- `src/app/App.tsx` · `src/features/intro/{openingGate.ts,OpeningSoon.tsx,OpeningSoon.css,index.ts}` · `src/app/preview/screens/opening.tsx` · `src/vite-env.d.ts` · `netlify.toml`

## Decisions Made

- 오픈 시각 2026-09-29 09:00 KST — PRD 축제 오픈일(50-scope) + 사용자 '9시'
- 디자인: 메인 티저 제목·구슬 그림 + 사전신청 섹션의 GRAND OPEN 글꼴·칠 + 카운트다운. 디자인에 없는 화면이라 기존 토큰으로 그림
- 라우터는 렌더 밖(모듈·오픈 콜백)에서 만든다 — 렌더 중에 만들면 loader 결과를 놓쳤다(테스트에서 재현)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `/preview/opening` 375px

## Test Results

- 701 passed · 타입 오류 0 · 린트 경고 0

## Known Problems

- 클라이언트 시계 기준이다 — 기기 시간을 바꾸면 넘어갈 수 있다. 백엔드 API 는 열려 있다
- 운영 반영은 dev → main 릴리스가 오픈 전에 나가야 한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 → dev → main 릴리스(오전 9시 전)
