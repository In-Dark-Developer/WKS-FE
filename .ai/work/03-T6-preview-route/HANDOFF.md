# Handoff — 03-T6-preview-route

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/T6

## Goal

개발 서버에서 `/preview` 가 화면 목록을, `/preview/<화면>` 이 가짜 데이터로 각 화면을 보여 주고, 빌드에는 preview 코드가 없으며, 화면 추가는 `src/app/preview/screens/<화면>.tsx` 파일 하나로 끝난다.

## Work Completed

- `/preview` 목록 · `/preview/<slug>` 화면 · `?state=` 상태 전환 · 화면별 가짜 action
- 등록 규약: `screens/<slug>.tsx` 가 `export const preview: PreviewScreen`(title·order·backdrop?·states·action?) — `import.meta.glob` 이 모은다
- App.tsx 에서 `import.meta.env.DEV` 일 때만 lazy 라우트로 붙임
- `screens/saju.tsx`: SajuForm, 제출하면 1.2초 로딩 뒤 연결문제 상태

## Work In Progress

- 없음

## Files Changed

- `src/app/App.tsx`, `src/app/App.test.tsx`
- `src/app/preview/{previewScreen.ts,previewScreens.ts,PreviewRoute.tsx,screens/saju.tsx}` + 테스트 2개

## Decisions Made

- 상태는 `states` 레코드(첫 키가 기본) — T5 로딩·에러·결과를 공유 파일 수정 없이 한 화면 파일에 담기 위해
- 화면별 `action` — 폼의 로딩·연결문제 상태를 백엔드 없이 보려고
- 상단 확인용 nav 는 AppShell 안(430px 열) — 임의값 없이 토큰만

## Tests Executed

- `pnpm test`(118) · `pnpm typecheck` · `pnpm lint` · `pnpm build` 후 dist 에 preview 문자열 0건
- 브라우저: /preview 목록, /preview/saju 입력→로딩→연결문제, /preview/nope 안내

## Test Results

- 통과

## Known Problems

- 이슈 #30(03/T5) 담당자 변경은 소유자 확인 대기
- Figma MCP 인증 만료 — T5 전에 재인증 필요

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합 → 03/T5
