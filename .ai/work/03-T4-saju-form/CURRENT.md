# Current State — 03-T4-saju-form

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 03-T4-saju-form
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/03-T4-saju-form
- Task: 03/T4
- Issue: #29
- Touches: src/features/saju/, src/ui/Button.tsx, src/ui/Button.test.tsx, src/ui/TextField.tsx, src/ui/TextField.test.tsx, src/ui/Select.tsx, src/ui/Select.test.tsx, src/ui/SegmentedControl.tsx, src/ui/SegmentedControl.test.tsx, src/ui/Checkbox.tsx, src/ui/Checkbox.test.tsx, docs/phases/03-saju-reading/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-server-state-session, 2026-09-13-screen-ownership, 2026-09-13-session-module-owner, 2026-09-13-opacity-tokens, 2026-09-13-form-owner-change

## Current Phase

03-saju-reading — `docs/phases/03-saju-reading/PLAN.md`

## Current Task

T4. 사주 입력 폼

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. Figma 수정본 기본·오류·연결문제·로딩중(695:2501·2514·2529·2544) 확인
- 2. ui 에 수정본 appearance 추가(apricot 버튼·accent 세그먼트·soft 입력·accent 체크)
- 3. options(13시진·자시 두 칸)·formSchema(검증→SajuInput)·SajuForm(useSubmit JSON, action 규약)
- 4. test 110·typecheck·lint·build, 브라우저 375px 기본·오류 상태 확인(임시, 커밋 안 함)

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`320a04a`

## Relevant Documents

- `docs/phases/03-saju-reading/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/saju/SajuForm.tsx:SajuForm` · `formSchema.ts:validateSajuForm` · `options.ts:birthTimeOptions`

## Next Action

PR 병합. T1 병합 뒤 routes.tsx index 에 SajuForm + action(createResult → writeSession → redirect) 연결
