# Handoff — chore-task-after

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

같은 Phase 안 Task 의 선후가 PLAN 의 `After:` 한 곳에 있고, 스트림 열기·Notion 보드·GitHub 이슈가 그것을 따른다.

## Work Completed

- Task 줄 형식에 `After: Tk` 추가(템플릿·README 규칙), 02 T2~T5·03 T4·T5 에 `After: T1`, PLAN 주석 갱신
- `ai-stream.sh open`: Touches 파서 `· After:` 제거, 선행 Task 가 main 에 `[x]` 아니면 `선행 경고`(막지 않음)
- Task 보드에 self-relation `선행 Task`↔`후행 Task` 추가, `notion-index-sync --phases` 가 Phase 마다 보드 행을 읽어 `선행 Task` PATCH (dry-run 은 출력만)
- ADR-20260913 한 줄, 공지 `task-after`, 이슈 #23~#26·#29·#30 첫 줄 `Blocked by #22/#27`

## Work In Progress

- 없음

## Files Changed

- `scripts/ai-stream.sh` · `scripts/notion-index-sync.sh` · `docs/phases/_template/PLAN.md` · `docs/phases/README.md` · `docs/phases/02-design-system/PLAN.md` · `docs/phases/03-saju-reading/PLAN.md` · `docs/decisions/ADR-20260913-notion-index-sync.md` · `.ai/team/announcements/2026-09-13-task-after.md` · `.ai/team/README.md`

## Decisions Made

- After 는 경고만, 차단 아님 — 병렬 착수 후 병합 전 `git merge main` 이 팀 관례(Rule 9)라 막을 이유가 없다
- Phase 간 의존은 `Depends on` 그대로, After 는 같은 Phase 안 Task 만 (다른 Phase 는 Depends on 으로)

## Tests Executed

- `bash -n` · `ai-stream.sh phases --check` · `--phases --dry-run`(After 6건 출력) · Touches 파서 sed · After 파서 + `git show origin/main` 검사

## Test Results

- 전부 기대대로. `open` 경고 문장은 실제 open 없이 파서 단계만 확인

## Known Problems

- 보드 관계 PATCH 실호출 미검증(병합 후 dispatch). 보드 Task 열이 "T1" 형식이 아니면 행을 못 찾고 warn 후 건너뛴다
- `open --issue` 와 After 경고는 서로 독립 — 이슈 본문 `Blocked by` 는 손으로 유지

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 → Actions `notion-index-sync` Run workflow → 보드 `선행 Task` 6건 확인.