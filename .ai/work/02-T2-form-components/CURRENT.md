# Current State — 02-T2-form-components

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 02-T2-form-components
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/02-T2-form-components
- Task: 02/T2
- Issue: #23
- Touches: src/ui/Button.tsx, src/ui/IconButton.tsx, src/ui/TextField.tsx, src/ui/Checkbox.tsx, src/ui/SegmentedControl.tsx, src/ui/Field.tsx, src/ui/Icon.tsx, src/ui/*.test.tsx, src/ui/assets/icons/check.svg, src/ui/assets/icons/spinner.svg, docs/phases/02-design-system/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-server-state-session, 2026-09-13-screen-ownership, 2026-09-13-session-module-owner, 2026-09-13-opacity-tokens, 2026-09-13-form-owner-change

## Current Phase

02-design-system — `docs/phases/02-design-system/PLAN.md`

## Current Task

T2. 폼 컴포넌트(기본 입력)

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. Figma 디자인시스템(16-2) C01·C02·C04·C05·C07·C10 변형별 스펙 추출(use_figma 읽기)
- 2. Icon(마스크) + check·spinner SVG
- 3. Button·IconButton·Field·TextField·Checkbox·SegmentedControl + 테스트
- 4. test 78·typecheck·lint·build, 브라우저 렌더·키보드 확인(임시 갤러리, 커밋 안 함)

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`0dbf26a`

## Relevant Documents

- `docs/phases/02-design-system/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/Button.tsx:Button` · `src/ui/Field.tsx:Field` · `src/ui/TextField.tsx:TextField`
- `src/ui/Checkbox.tsx:Checkbox` · `src/ui/SegmentedControl.tsx:SegmentedControl` · `src/ui/Icon.tsx:Icon`

## Next Action

PR 병합 후 02/T6(Select·TextArea·PhotoUpload)
