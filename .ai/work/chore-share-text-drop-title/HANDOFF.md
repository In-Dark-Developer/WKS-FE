# Handoff — chore-share-text-drop-title

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

공유 문구가 닉네임 문장과 링크 두 줄로만 간다.

## Work Completed

- `shareLink(url, text)` 로 줄이고 text 를 `문구\n링크` 로 · `shareTitle` 삭제

## Work In Progress

- 없음

## Files Changed

- `src/features/share/link/shareLink.ts`·`.test.ts` · `messages.ts` · `ShareLinkButton.tsx`

## Decisions Made

- 없음

## Tests Executed

- pnpm test·lint·typecheck (exit code)

## Test Results

- 모두 exit 0 · test 344

## Known Problems

- `/preview` 공유 화면이 `title:` 칸을 계속 그린다(이제 빈 값) — Touches 밖이라 두었다

## Unverified Assumptions

- 없음

## Exact Next Action

배포 후 카카오톡 공유가 두 줄인지 확인한다.
