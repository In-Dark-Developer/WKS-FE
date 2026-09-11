# 2026-09-12 commit-type-ci — 커밋 type 에 `ci` 가 생겼다

- Required: yes
- Applies to: all
- Change: AGENTS.md Commit Format · .githooks/commit-msg · scripts/ai-end.sh
- Action: CI·워크플로만 바꾸는 커밋과 PR 제목은 `ci(<scope>): <summary>` 로 쓴다 (예: `ci(commands): run the real pnpm commands`). 지금까지는 `chore` 로 뭉뚱그렸는데, 워크플로 변경은 코드 동작이 아니라 검증 파이프라인을 바꾸므로 `git ai-log --grep='^ci('` 로 따로 볼 수 있게 분리한다. 나머지 type 목록과 규칙은 그대로다.
- Until: Phase 08 종료
