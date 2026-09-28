# Handoff — 11-T8-inbox-pills

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 11/T8

## Goal

요청함 목록 줄 오른쪽 알약이 탭마다 다르다 — 보낸 신청은 요청 상태, 받은 신청은 궁합 점수다.

## Work Completed

- `RequestRow` 가 `tab` 을 받아 받은 탭에서는 궁합 점수 알약을, 보낸 탭에서는 상태 알약을 그린다
- `f08af93` 에서 지웠던 `[data-score-pill]` 그라데이션을 `dating.css` 에 되살렸다
- `/preview/dating-requests` 의 받은 신청 fixture 에 점수(92·78)를 채웠다 — 없으면 새 알약이 미리보기에 안 보인다
- 테스트를 보낸/받은 두 건으로 갈랐다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/requests/RequestInbox.tsx` · `RequestInbox.test.tsx` · `src/features/dating/dating.css`
- `src/app/preview/screens/dating-requests.tsx`

## Decisions Made

- 점수가 없는 줄(`score === null`)은 상태 알약으로 되돌아간다 — 퍼블리싱 미리보기가 점수를 숨길 수 있어야 하고(뷰 모델 주석), 점수 없는 줄에 빈 알약을 두지 않는다.
- Touches 에 `src/app/preview/screens/dating-requests.tsx` 를 더했다 — 공지 `2026-09-13-publishing-first` 가 화면 확인용 preview 파일을 그 화면 Task 의 몫으로 정해 두었다. 공유 목록 파일은 건드리지 않았다.
- 알약 그라데이션 색은 Figma 에 변수가 없어 원본 값을 그대로 쓴다 (기존 상태 알약과 같은 방식).

## Tests Executed

- `npx vitest run src/features/dating/requests` · `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`
- 미리보기 육안 확인: `/preview/dating-requests` 보낸 탭·받은 탭

## Test Results

- 전부 통과 — 116 files / 670 tests. 받은 탭 두 줄이 `92점`·`78점` 알약으로 보인다
- `previewScreens.test.tsx` 가 전체 실행에서 한 번 실패했다가 재실행에 통과 — 지연 import 가 느린 기계에서 나는 기존 flake 다(내 변경과 무관)

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올린다.
