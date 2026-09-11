# Current State — spec-prd-revision

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-prd-revision
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-prd-revision
- Task: -/-
- Touches: docs/PRD.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-notion-board-sync

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: prd-revision

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 기존 PRD·product-brief·ARCHITECTURE 대조로 빠진 요구 찾기
- [x] FR-15~18 추가 (기존 번호는 그대로 — 추적성)
- [x] Success Criteria → SC-1~6 확인 절차 표
- [x] Open Questions Q1~Q5 신설, Constraints의 일정 줄을 Q1으로 연결

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`59ea29c`

## Relevant Documents

- `docs/PRD.md` · `docs/product-brief.md`(배경) · `docs/ARCHITECTURE.md`(Data Flow·External Systems)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

PR 을 올려 병합한다. Q1~Q5 는 소유자 결정이 필요하다 — 답이 나오면 해당 절을 고치고 표에서 지운다.
