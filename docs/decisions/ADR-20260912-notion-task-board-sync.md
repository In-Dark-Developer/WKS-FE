# ADR-20260912: Notion Task 보드는 스트림 상태의 사본이다

- Status: Superseded by ADR-20260923-retire-task-board-sync
- Date: 2026-09-12
- Deciders: @jjjung0921 (제안) / 리뷰어는 PR 승인자

## Context

팀은 Notion에 `✅ Task 보드`를 두고 Phase·Task·Owner·Touches·상태를 본다. 같은 사실이 저장소에도 있다 — `.ai/work/<id>/CURRENT.md`의 `Status:`·`Owner:`, 브랜치 `ws/<id>`, PR. 두 곳을 손으로 맞추면 반드시 어긋나고, 어느 쪽이 사실인지 매번 다시 판단해야 한다.

## Problem

보드와 저장소 중 무엇이 기억이고, 둘을 어떻게 잇는가. 양방향으로 이으면 Notion에서 바꾼 상태가 저장소를 되돌릴 수 있고, 그 순간 Rule 1(저장소가 기억)이 깨진다.

## Alternatives

1. **손으로 맞춘다** — 장점: 도구가 없다. 단점: 실제로는 맞추지 않는다. 보드가 며칠 만에 거짓이 된다.
2. **git → Notion 단방향 동기화(Actions)** — 장점: 기억은 한 곳(`CURRENT.md`)에 남고 보드는 읽기용 사본이 된다. 단점: Notion에서 상태를 바꿔도 아무 일도 일어나지 않는다(의도된 제약이며 사람이 오해할 수 있다).
3. **양방향 동기화(Notion webhook + git 커밋)** — 장점: 어느 쪽을 고쳐도 된다. 단점: 충돌 해소 규칙·봇 커밋이 필요하고, 스트림 소유권(Rule 15)을 보드가 우회하게 된다.

## Decision

2번을 택한다.

- `.ai/work/<id>/CURRENT.md`가 사실이고 보드는 그 사본이다. 보드를 고쳐도 저장소는 바뀌지 않으며, 다음 push가 덮어쓴다.
- `scripts/notion-sync.sh`가 브랜치 `ws/<id>`에서 스트림을 찾아 보드 행(`Phase` 번호 + `Task`)을 갱신한다. `.github/workflows/notion-sync.yml`이 `ws/**` push와 PR 이벤트에서 호출한다.
- 상태 매핑: `TODO`→대기 · `IN_PROGRESS`→진행중 · `BLOCKED`→보류 · `REVIEW`→리뷰 · PR merged→완료.
- `Owner`(Person)와 `PR`(링크)도 같이 쓴다. Owner 는 2026-09-13 부터 Person 속성이며, 스크립트의 `owner_uid` 표가 GitHub 핸들을 Notion 사용자 id 로 옮긴다 — 표에 없는 핸들은 경고 후 Owner 를 비운다. 새 팀원은 표에 한 줄 추가한다. `작업`·`Phase`·`Task`·`Touches`는 사람이 만들고 동기화가 건드리지 않는다.
- 토큰은 Actions secret `NOTION_TOKEN`에만 둔다(Rule 13). secret이 없으면 동기화를 건너뛴다 — fork PR에서 정상 동작한다.

## Consequences

- 보드에 없는 Task(행이 없는 Phase/Task)는 조용히 건너뛴다. 행은 사람이 만든다.
- Task 스트림이 아닌 스트림(spec·chore·plan)은 보드에 행이 없으므로 접근 확인만 하고 끝난다.
- Notion 쪽 속성 이름(`상태`·`Task`·`Phase`·`Owner`·`PR`)이나 `Owner` 의 타입(Person)이 바뀌면 동기화가 실패한다. 보드 스키마는 이 ADR과 함께 바꾼다.
- 보드가 저장소 상태와 다르면 저장소가 맞다.
