# Current State — chore-screen-assembly-ssot

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-screen-assembly-ssot
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-screen-assembly-ssot
- Task: -/-
- Issue: none
- Touches: src/app/,.github/workflows/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: screen-assembly-ssot

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 조립을 `src/app/screens/` 로 추출 — routes 는 loader·이동만, preview 3개가 같은 조립을 쓴다
- [x] CI: 취소·job 합치기·코드 없는 PR 건너뛰기·notion-sync 중복 제거. test·typecheck·lint·`/preview` 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`3ae89e9`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/screens/`: `ReadingScreen` · `MyMapScreen` · `SharedMapScreen` · `ShareInputScreen` · `BackRow`
- `src/app/routes.tsx:routes` 라우트 표·이동 래퍼만 · `.github/workflows/ci.yml:commands`
- `src/app/preview/screens/`: `reading.tsx` · `map.tsx` · `saju.tsx` — 같은 조립을 쓴다

## Next Action

PR 리뷰를 기다린다. `chore-reading-back-always` 가 `src/app/routes.tsx`·`routes.test.tsx`·`preview/screens/reading.tsx` 를 함께 만지므로 병합 전 `git merge main` 이 필요하다.
