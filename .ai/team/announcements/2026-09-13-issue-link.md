# 2026-09-13 issue-link — GitHub track 이슈에서 스트림을 연다: `ai-stream.sh open --issue N <slug>`

- Required: yes
- Applies to: all
- Change: scripts/ai-stream.sh · scripts/ai-end.sh · scripts/lib/common.sh · .ai/work/_template/CURRENT.md · AGENTS.md Session Procedure · PR (chore-issue-link)
- Action: Phase 02·03·04 의 Task 마다 GitHub 이슈(`track` 라벨, `track(NN/Tk): …`, assignee = PLAN Owner)가 있다. 내 Task 를 시작할 때 이슈 본문의 명령 `scripts/ai-stream.sh open --issue <N> <slug>` 를 에이전트에게 준다 — 브랜치·`.ai/work/` 생성과 push, CURRENT `Issue:` 기록, 이슈 코멘트까지 한 번에 되고 `--ready` PR 본문 첫 줄이 `Closes #N` 이 되어 병합 시 이슈가 닫힌다. 이슈는 사람용 추적이며 원본은 여전히 PLAN·CURRENT.md·Notion 보드다. 기존 스트림의 CURRENT 에는 `Issue:` 줄이 없어도 된다(none 취급).
- Until: Phase 08 종료
