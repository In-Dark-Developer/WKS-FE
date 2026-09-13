# Current State — chore-ui-assets

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-ui-assets
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-ui-assets
- Task: -/-
- Issue: none
- Touches: src/ui/assets/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: ui-assets

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. Figma 「UI 최종 - 개발용」(558-2430) DEV ASSETS·카드·달·구슬·아이콘 추출
- 2. 래스터는 WebP 변환(12지신 720px, 카드 @3x), SVG는 원본
- 3. `src/ui/assets/` 배치, lint·typecheck·build 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`31899a0`

## Relevant Documents

- `AGENTS.md`
- Figma `tzWb3S2guXz5zH2DMeX8Yt` 558-2430

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

PR 병합. 이후 화면 Task가 필요한 파일을 import 한다.