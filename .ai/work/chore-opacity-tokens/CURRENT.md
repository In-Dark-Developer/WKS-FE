# Current State — chore-opacity-tokens

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-opacity-tokens
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-opacity-tokens
- Task: -/-
- Issue: none
- Touches: src/ui/tokens/theme.css,src/ui/tokens/theme.test.ts,docs/CONVENTIONS.md,.ai/team/announcements/,.ai/team/README.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-server-state-session, 2026-09-13-screen-ownership, 2026-09-13-session-module-owner, 2026-09-13-opacity-tokens

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: opacity-tokens

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. Figma 로컬 변수·스타일 전체(use_figma 읽기)와 selection 704:2804 변수 추출
- 2. theme.css 대조 — 램프 41·스타일 54·Space/Radius 16·텍스트 21 일치, Opacity 10 누락
- 3. Opacity 토큰 10개(color-mix), 테스트, CONVENTIONS 표, 공지

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`8371c62`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/tokens/theme.css` Opacity 블록 · `src/ui/tokens/theme.test.ts`

## Next Action

PR 리뷰(@gn00py48) 후 병합
