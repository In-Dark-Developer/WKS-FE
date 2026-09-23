# Handoff — chore-owner-drift-check

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

저장소 `담당` 열이 보드와 어긋나면 PR 에서 드러난다.

## Work Completed

- `notion_query_page` — 페이지네이션 포함 DB 조회 (lib/notion.sh)
- `--check-owners` — 보드 `담당자` 와 FR·NFR 표 `담당` 대조. 쓰기 없음. 토큰 없으면 경고 후 통과
- `scripts/lib/notion-owners.tsv` — 보드 표시 이름(`정진 이`) ↔ 저장소 표기(`이정진`) 대응표
- `owner-drift` job — docs/prd 를 건드리는 PR 에서 실행. concurrency group 을 이벤트별로 분리

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-index-sync.sh` · `scripts/lib/notion.sh` · `scripts/lib/notion-owners.tsv`
- `.github/workflows/notion-index-sync.yml` · `.ai/team/announcements/2026-09-23-prd-owner-drift.md`

## Decisions Made

- 쓰지 않고 검사만 한다 — ADR-20260923-prd-single-notion-db 의 '보드가 원본' 을 뒤집지 않는다
- 사람 식별은 user id 가 아니라 표시 이름으로 한다. 통합이 이름을 못 읽으면 검사가 그 사실을 알리고 멈춘다
- 표시 이름과 저장소 표기가 달라 대응표가 필요하다 — 4명 규모라 파일 하나로 충분하다

## Tests Executed

- `bash -n` 문법 검사 (두 스크립트)
- 토큰 없는 실행 — 경고 후 통과 확인
- `repo_owners` 단독 실행 — 41행 중 19행 배정
- jq 추출식을 표본 payload 로 검증 (이름 있음 / 이름 없음 / 미배정)
- 워크플로 YAML 파싱 — job 2개, 트리거 3종

## Test Results

- 전부 통과. 실제 보드 대조는 CI 에서 처음 돈다 (로컬에 NOTION_TOKEN 이 없다)

## Known Problems

- 저장소 `담당` 이 크게 낡았다 — 보드는 FR-1~31·NFR-1~8 서른아홉 행에 담당자가 있는데 저장소는 19행만 차 있다. 첫 실행에서 대량으로 빨갛게 나올 것이다
- 대응표에 `정진 이` 한 줄만 넣었다. 나머지 세 명은 이 세션의 통합 토큰으로 이름을 읽지 못했다 — CI 토큰이 읽으면 검사가 이름을 알려주고, 그때 한 줄씩 추가한다
- `owner-drift` 는 main ruleset 의 required check 가 아니다. 필수로 만들려면 ruleset 에 추가해야 한다

## Unverified Assumptions

- CI 의 `NOTION_TOKEN` 이 '사용자 정보 읽기' 권한을 가져 `people[].name` 이 온다고 가정했다. 오지 않으면 검사가 그 사실을 명시하고 실패한다

## Exact Next Action

PR 의 owner-drift 출력에서 어긋난 행 목록을 받아 보드·저장소를 맞춘다.
