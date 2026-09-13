# Handoff — 04-T3-share-link

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 04/T3

## Goal

'친구에게 공유' 버튼이 현재 origin 기준 `/s/:shareId` 링크를 Web Share → 클립보드 복사 → 링크 노출 3단 폴백으로 내보내고, `/preview/share` 에서 세 분기를 모두 볼 수 있다 (FR-4).

## Work Completed

- `shareUrl.ts` — `buildShareUrl(shareId)` 가 `location.origin` 으로 만든다(절대 주소 없음)
- `shareLink.ts` — `'shared' | 'cancelled' | 'copied' | 'manual'` 4결과의 폴백 분기
- `ShareLinkButton.tsx` — 버튼·로딩 잠금·복사 Toast·복사 실패 시 링크 입력 노출
- `messages.ts` — 보살 말투 문구를 한곳에 모음 (CONVENTIONS 7장)
- `src/app/preview/screens/share.tsx` — 세 분기를 강제로 띄우는 `/preview/share`
- `src/features/share/index.ts` 에 `ShareLinkButton`·`buildShareUrl` export

## Work In Progress

- 없음

## Files Changed

- `src/features/share/link/{shareUrl,shareLink,messages,ShareLinkButton}.{ts,tsx}` + 테스트 3개
- `src/features/share/index.ts`, `src/app/preview/screens/share.tsx`

## Decisions Made

- 폴백 결과를 문자열 4종으로 돌려주고 화면이 표시를 고른다 — 분기 테스트가 쉽다.
- **공유 시트 취소(`AbortError`)는 복사하지 않는다.** 사용자가 스스로 닫았는데 "복사했느니라"가 뜨면 거짓 안내가 된다.
- `/preview` 데모가 `navigator.share`·`clipboard` 를 화면이 떠 있는 동안만 갈아 끼우고 떠날 때 되돌린다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · AC5·AC6 grep

## Test Results

- 49 files / 219 tests 통과(신규 13) · typecheck 통과 · lint 경고 0 · build 성공(JS gzip 147.20 kB < 250 kB)
- `@/api` import 0건 · 코드 내 절대 주소 0건(테스트의 부재 단언 1건만)

## Known Problems

- PLAN 의 T3 줄을 `[x]` 로 바꾸지 못했다 — 이 브랜치는 04/T1 계획 PR 병합 전의 main 에서 갈라져 PLAN 에 T3 줄이 아직 없다. 계획 PR 병합 후 `git merge main` 하고 SHA(`57ed534`)를 적어야 한다.
- PLAN T3 Done when 은 '미지원·**취소**·거부 시 클립보드 복사' 인데 구현은 취소를 복사하지 않는다 — 계획 PR 을 올리기 전에 그 문구를 '미지원·실패 시 복사(취소는 아무 일 없음)' 로 고치는 편이 맞다.

## Unverified Assumptions

- 실기기(iOS Safari·Android Chrome)에서 공유 시트가 실제로 열리는지는 확인하지 못했다 — PLAN Validation Plan 의 수동 확인 항목이다.
- 공유 문구('…보았느니라')는 기획 확정본이 아니라 이 Task 가 정한 임시값이다.

## Exact Next Action

04/T1 계획 PR 이 병합되면 `git merge main` → PLAN T3 에 `(commit 57ed534)` 기록 → `ai-end.sh --ready`.
