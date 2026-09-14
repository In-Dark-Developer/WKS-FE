# Handoff — chore-intro-video

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: -/-

## Goal

첫 방문자가 `/` 에 들어오면 8초 인트로 영상이 재생되고 2초부터 건너뛰기 버튼으로 넘길 수 있으며, 끝나거나 넘기면 사주 입력 화면이 뜨고 다시 보이지 않는다.

## Work Completed

- PRD FR-1(첫 방문 1회 · 2초 건너뛰기 · `/` 만)·SCR-01·Non-goals, ARCHITECTURE Persistence(`wks:intro-seen`) 갱신 (commit 63410f2)
- `src/features/intro/`: `IntroVideo`(음소거 자동 재생, 2초 타이머 뒤 건너뛰기, 끝·오류 시 종료) · `IntroGate`(첫 방문이면 인트로, 끝나면 children) · `introSeen`
- 건너뛰기: 우측 위 반투명(흰 50%·테두리 80%·blur) 버튼 (commit 1d87965, 소유자 참고 캡처)
- `routes.tsx` index 를 `IntroGate` 로 감쌈. routes·App 테스트는 인트로를 본 방문자로 시작

## Work In Progress

- 없음

## Files Changed

- `docs/PRD.md`, `docs/ARCHITECTURE.md`, `src/app/routes.tsx`, `src/app/routes.test.tsx`, `src/app/App.test.tsx`, `src/features/intro/*`, `src/ui/assets/video/intro.mp4`

## Decisions Made

- 소유자 결정(2026-09-14): 첫 방문 1회(localStorage) · `/` 에서만 · spec 과 구현 한 PR
- 건너뛰기는 영상 시각이 아니라 마운트 후 2초 타이머 — 자동 재생이 막혀도 넘길 수 있게
- 끝까지 가거나 건너뛰었을 때 봤다고 기록 — 보는 중 새로고침하면 다시 나온다
- 건너뛰기는 `ui/Button` 이 아닌 intro 전용 button 요소 — 디자인시스템에 없는 모양, 토큰만 사용
- 조립은 children 으로 — intro 가 saju 를 import 하지 않는다

## Tests Executed

- `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- 개발 서버 모바일 375px: 첫 방문 재생·2초 뒤 버튼·건너뛰기 → 입력 화면·새로고침 뒤 인트로 없음

## Test Results

- test 55 files·255 passed, typecheck·lint 경고 없음, console 오류 없음
- 빌드: `intro-*.mp4` 1,067KB 별도 자산, JS gzip 151.9KB

## Known Problems

- 첫 방문자는 1MB 영상을 받는다 — 08/T5 LCP 측정에 영향 가능
- 세션 없이 결과 링크로 들어와 `/` 로 튕긴 첫 방문자에게는 인트로가 뜬다
- 영상 오른쪽 아래에 ✦ 워터마크가 들어 있다(영상 원본)

## Unverified Assumptions

- iOS Safari·Android Chrome·인앱 브라우저에서 음소거 자동 재생이 된다 — 실기기 미확인 (막히면 2초 뒤 건너뛰기로 넘어감)

## Exact Next Action

PR 병합 뒤 실기기(iOS Safari·Android Chrome·카카오 인앱)에서 자동 재생 확인
