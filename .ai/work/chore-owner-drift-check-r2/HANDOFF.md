# Handoff — chore-owner-drift-check-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

담당 대조가 실제로 어긋난 행만 실패시킨다.

## Work Completed

- `check_owners` — 보드 `people` 이 비어 보이는 행을 실패가 아닌 판정 보류로 처리하고 건수를 경고로 남긴다

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-index-sync.sh`

## Decisions Made

- 통합 권한을 탐지해 분기하려다 접었다 — `GET /users` 가 200 을 줘도 '모든 사용자를 본다' 는 뜻이 아니라 오탐이 남는다. 구분할 수 없는 것은 판정하지 않는 쪽이 정확하다
- 대가: '보드에서 담당을 지웠는데 저장소에 남은' 경우는 못 잡는다. 경고 줄로 보류 건수를 드러낸다

## Tests Executed

- `bash -n` 문법 검사
- 실제 CI 실행 결과(PR #172, run 2026-09-23T02:15)를 근거로 오탐 10건·진짜 8건을 분류

## Test Results

- 고치기 전: 18건 실패 중 10건이 오탐(보드는 배정돼 있는데 통합이 그 사용자를 못 봄)
- 고친 뒤 기대: 실패 8건(FR-1·7·8, NFR-2·5·6 등 저장소가 낡은 행), 판정 보류 10행

## Known Problems

- 저장소 `담당` 이 낡은 행 6건이 남아 있다 — FR-1·FR-7·FR-8·NFR-2·NFR-5·NFR-6 은 보드가 '이정진' 인데 저장소가 `—` 다. docs/prd 는 이 스트림 Touches 밖이라 별도 PR 이 필요하다
- 통합이 이정진 외 세 명을 못 본다 — 그래서 `notion-owners.tsv` 도 한 줄뿐이다. 워크스페이스에서 통합 권한을 넓히면 보류 10행이 판정 대상이 된다

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 저장소 `담당` 낡은 6건을 spec 스트림으로 맞춘다.
