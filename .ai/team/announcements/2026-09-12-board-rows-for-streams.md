# 2026-09-12 board-rows-for-streams — spec·chore 스트림도 보드에 자동으로 생긴다

- Required: yes
- Applies to: all
- Change: ADR-20260912-notion-board-rows-for-streams.md
- Action: Notion `✅ Task 보드`에 `Stream` 열이 생겼다. spec·chore·plan·phase-close 스트림은 첫 push에 행이 자동 생성되고 제목·Touches·상태·Owner·PR이 채워진다 — 손으로 만들지 않는다. Phase Task 행은 전과 같이 사람이 만들며 동기화는 갱신만 한다. 자동 생성된 행을 지우면 그 스트림이 다시 push될 때 되살아난다.
- Until: Phase 08 종료
