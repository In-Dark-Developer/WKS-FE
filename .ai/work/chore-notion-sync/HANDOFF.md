# Handoff — chore-notion-sync

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: -/-

## Goal

`ws/*` 브랜치 push·PR 이벤트마다 Notion `✅ Task 보드`의 상태·Owner·PR이 그 스트림의 CURRENT.md와 같아진다 — 손으로 맞추지 않는다.

## Work Completed

- `scripts/notion-sync.sh` — 브랜치 → 스트림 → 보드 행(`Phase` 번호 + `Task`) 갱신. `--check`는 접근·쓰기 확인만, `--stream`은 브랜치 대신 스트림 id 지정
- `.github/workflows/notion-sync.yml` — `ws/**` push와 PR 이벤트에서 실행, secret `NOTION_TOKEN` 사용
- 보드 `상태`에 `보류`(빨강) 옵션 추가 — BLOCKED를 진행중으로 뭉개지 않기 위해
- ADR-20260912, 공지 `2026-09-12-notion-board-sync`

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-sync.sh` · `.github/workflows/notion-sync.yml` · `docs/decisions/ADR-20260912-notion-task-board-sync.md` · `.ai/team/announcements/2026-09-12-notion-board-sync.md` · `.ai/team/README.md`(색인)

## Decisions Made

- 단방향(git → Notion)만 한다 — 양방향이면 보드 편집이 스트림 소유권(Rule 15)을 우회한다 (ADR-20260912)
- 매핑: TODO→대기 · IN_PROGRESS→진행중 · BLOCKED→보류 · REVIEW→리뷰 · PR merged→완료
- 보드 행은 사람이 만든다. 행이 없으면 조용히 건너뛴다 — 동기화가 행을 만들면 보드 구조를 동기화가 소유하게 된다
- Notion API 버전은 `2022-06-28` 고정(database 엔드포인트). jq는 러너 기본 제공

## Tests Executed

- 로컬: `bash -n`, 토큰 없음 / 잘못된 토큰(401 FAIL, exit 1) / Task 스트림 아님
- Actions: 5회 run 모두 성공 — 읽기·쓰기 확인, 브랜치 인식, 그리고 임시 스텝으로 `--stream chore-bootstrap`(01/T1) 실제 반영

## Test Results

- `[ok] 01/T1 → 상태 '리뷰' · Owner @jjjung0921` — find_row·patch_page가 실제 행에서 동작. 값이 이미 같아 보드 내용은 그대로

## Known Problems

- 보드 속성 이름(`상태`·`Task`·`Phase`·`Owner`·`PR`)을 바꾸면 조용히 실패가 아니라 FAIL로 CI가 빨개진다 — 이름 변경은 ADR과 함께
- `NOTION_DB` id가 워크플로에 평문으로 있다 — 비밀값은 아니지만 저장소를 public으로 돌릴 때 다시 본다
- PR 병합 시 완료 처리는 `pull_request: closed` + `merged=true`에 의존한다. main 직접 push로 들어온 변경은 보드에 안 잡힌다

## Unverified Assumptions

- 보드의 `Task`는 Phase 안에서 유일하다 (지금은 그렇다 — T1이 8행, 각기 다른 Phase)
- integration 권한이 이 DB에만 공유돼 있다 — 다른 페이지 접근 여부는 확인하지 않았다

## Exact Next Action

PR을 올려 병합한다. 병합 후 첫 Task 스트림(01/T2)이 열리면 보드 행이 자동으로 진행중이 되는지 한 번 눈으로 확인한다.
