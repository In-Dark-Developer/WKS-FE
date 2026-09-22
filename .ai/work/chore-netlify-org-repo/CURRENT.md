# Current State — chore-netlify-org-repo

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-netlify-org-repo
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-netlify-org-repo
- Task: -/-
- Issue: none
- Touches: .github/workflows/,netlify.toml,docs/ARCHITECTURE.md,docs/decisions/,docs/deploy/,.ai/team/announcements/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: netlify-org-repo

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] ADR 작성(이전 ADR Superseded), `sync-fork.yml` 삭제, `netlify.toml`·ARCHITECTURE·배포 문서·공지 갱신
- [ ] 소유자가 Netlify 재연결 완료(2026-09-22) — PR 의 deploy preview 로 검증 후 병합 ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`9630d2d`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `docs/decisions/ADR-20260922-netlify-org-repo-direct.md` · `docs/deploy/netlify.md`(옛 `netlify-fork.md`)
- `netlify.toml` 머리 주석 · `docs/ARCHITECTURE.md:75` External Systems 정적 호스팅 행
- 삭제: `.github/workflows/sync-fork.yml`

## Next Action

PR 의 Netlify deploy preview 로 org 레포 연결을 확인한 뒤 병합한다. 병합 후 소유자가 Secret·Variable·PAT 폐기, fork 삭제.
