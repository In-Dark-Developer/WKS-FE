# 2026-09-13 task-after — 같은 Phase 안 Task 선후는 PLAN Task 줄의 `After: Tk` 로 적는다

- Required: yes
- Applies to: all
- Change: docs/phases/_template/PLAN.md · docs/phases/README.md Phase Rules · docs/phases/02,03 PLAN.md · scripts/ai-stream.sh · scripts/notion-index-sync.sh · PR (chore-task-after)
- Action: Task 줄 형식이 `… · Touches: … · After: T1 · Owner: …` 가 됐다(After 는 선택). 02 T2~T5 와 03 T4·T5 는 `After: T1` — T1 이 main 에 병합되기 전에 열면 `ai-stream.sh open` 이 경고한다(막지 않음, 병합 전 `git merge main`). Notion Task 보드에 `선행 Task`·`후행 Task` 관계 열이 생겼고 main 병합마다 CI 가 PLAN 에서 채운다 — 손으로 고치지 않는다. GitHub track 이슈 #23~#26·#29·#30 본문 첫 줄에 `Blocked by #22 / #27` 이 있다. 새 Task 를 PLAN 에 적을 때 선행이 있으면 After 를 꼭 넣는다.
- Until: Phase 08 종료
