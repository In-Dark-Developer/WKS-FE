# Current State — spec-drop-birth-region

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-drop-birth-region
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-drop-birth-region
- Task: -/-
- Touches: docs/PRD.md,docs/phases/03-saju-reading/PLAN.md,docs/api/openapi.yaml,.ai/team/announcements/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-planning-feedback

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: drop-birth-region

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] PRD US-1 · FR-2 · Q6 삭제
- [x] PLAN 03 Scope · Dependencies · T4 · AC2
- [x] openapi birthRegion 설명(항상 null)
- [x] 공지 · Figma 기능명세서 · Notion 색인 FR-2

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`fea326c`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `docs/PRD.md` FR-2 · `docs/api/openapi.yaml#/components/schemas/ReadingRequest`

## Next Action

PR 병합 후 Phase 01 T6 문의 목록에 `birthRegion` 제거 요청을 넣는다.
