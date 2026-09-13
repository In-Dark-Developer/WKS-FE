# Handoff — 02-T5-app-shell

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: codex
- To: 없음
- Date: 2026-09-13
- Phase / Task: 02/T5

## Goal

AppShell이 360–430px에서 16px 여백으로 가로 넘침 없이 늘어나고, 데스크톱 중앙 정렬·safe-area·고정 하늘/달/별 배경을 제공한다.

## Work Completed

- Figma node `110:1381`의 375px 화면·343px 콘텐츠·16px 좌우 여백을 반응형 `AppShell`로 구현했다.
- 데스크톱 430px 중앙 캔버스, safe-area, 고정 하늘·달과 상승 별, reduced-motion 정지를 적용했다.
- 네이티브 `main` 속성 전달과 자식 렌더를 테스트했다.

## Work In Progress

- 없음

## Files Changed

- `src/app/AppShell.tsx`
- `src/app/layout.css`
- `src/app/AppShell.test.tsx`

## Decisions Made

- 높이는 고정하지 않고 `min-height: 100dvh`만 두어 콘텐츠가 문서 흐름으로 늘어난다.
- 설치형 PWA(manifest·service worker)는 범위에서 제외하고 safe-area·동적 뷰포트만 지원한다.

## Tests Executed

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `git diff --check`

## Test Results

- 8개 테스트 파일·31개 테스트 통과, 타입·린트·포맷·공백 오류 없음.

## Known Problems

- 실제 브라우저 360/375/430px 실측은 AppShell이 아직 라우트에 연결되지 않아 수행하지 못했다.

## Unverified Assumptions

- 없음

## Exact Next Action

PR에서 CSS 폭·safe-area 규칙을 확인하고, 화면 Task에서 `AppShell`을 라우트 레이아웃에 연결한다.
