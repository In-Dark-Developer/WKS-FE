# Current State — chore-replace-card-back-and-loading-video

- Stream: chore-replace-card-back-and-loading-video
- Owner: gn00py48@gmail.com
- Branch: ws/chore-replace-card-back-and-loading-video
- Task: -/-
- Issue: none
- Touches: src/ui/assets/cards/card-back.webp,src/ui/assets/video/fortune-loading.mp4,src/features/share/card/ConnectionCard.css
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: replace-card-back-and-loading-video

## Status

REVIEW

## Progress

- [x] 교체본 실측 — 카드 1097×1466 RGBA 무손실 1160KB · 영상 971KB H.264+AAC
- [x] `ConnectionCard.css` 그림자 여백 보정 제거 → `inset:0` + `object-fit: cover`
- [x] 카드 손실 재인코딩 q90 — 1160KB → 160KB (PSNR 42.7dB, 크기·알파 그대로)
- [x] 검증 test 354 · typecheck · lint · build

## Last Checkpoint

`1e3eef8`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

- `src/features/share/card/ConnectionCard.css` — `[data-connection-card-back] img`
- `src/ui/assets/cards/card-back.webp` · `src/ui/assets/video/fortune-loading.mp4`

## Next Action

`AGENTS.md`에서 -/-의 Done when·Acceptance Criteria를 확인하고 HANDOFF의 Goal·Work In Progress를 쓴 뒤 시작한다.
