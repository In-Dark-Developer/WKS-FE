# 2026-09-12 notion-board-sync — Notion Task 보드는 이제 자동으로 갱신된다

- Required: yes
- Applies to: all
- Change: ADR-20260912-notion-task-board-sync.md
- Action: Notion `✅ Task 보드`의 `상태`·`Owner`·`PR` 열을 손으로 고치지 않는다 — `ws/**` push와 PR 이벤트마다 `CURRENT.md`의 `Status:`·`Owner:`로 덮어쓴다(TODO→대기 · IN_PROGRESS→진행중 · BLOCKED→보류 · REVIEW→리뷰 · PR merged→완료). 보드가 실제와 다르면 보드가 아니라 `CURRENT.md`를 고친다. `작업`·`Phase`·`Task`·`Touches`는 그대로 사람이 채운다.
- Until: Phase 08 종료
