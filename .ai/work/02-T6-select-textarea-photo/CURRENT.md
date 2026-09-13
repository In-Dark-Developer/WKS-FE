# Current State — 02-T6-select-textarea-photo

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 02-T6-select-textarea-photo
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/02-T6-select-textarea-photo
- Task: 02/T6
- Issue: none
- Touches: src/ui/Select.tsx, src/ui/TextArea.tsx, src/ui/PhotoUpload.tsx, src/ui/Select.test.tsx, src/ui/TextArea.test.tsx, src/ui/PhotoUpload.test.tsx, docs/phases/02-design-system/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-server-state-session, 2026-09-13-screen-ownership, 2026-09-13-session-module-owner, 2026-09-13-opacity-tokens, 2026-09-13-form-owner-change

## Current Phase

02-design-system — `docs/phases/02-design-system/PLAN.md`

## Current Task

T6. 폼 컴포넌트(선택·긴 입력·사진)

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. Figma 16-2 C06 TextArea·C08 SelectTrigger·C09 OptionRow·C11 PhotoUpload 스펙 추출
- 2. Select(combobox + listbox, 키보드, hidden input) · TextArea(카운터) · PhotoUpload(5상태)
- 3. test 90·typecheck·lint·build, 브라우저 키보드 선택 확인(임시 갤러리, 커밋 안 함)

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`9094369`

## Relevant Documents

- `docs/phases/02-design-system/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/Select.tsx:Select` · `src/ui/TextArea.tsx:TextArea` · `src/ui/PhotoUpload.tsx:PhotoUpload`

## Next Action

PR 병합 후 03/T4 사주 입력 폼
