# Handoff — chore-owner-drift-check-r3

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

대응표에 없는 보드 표시 이름을 검사가 이름과 함께 알려준다.

## Work Completed

- `map_owners` 가 모르는 이름을 느낌표를 앞에 붙인 문자열로 돌려주고 호출부가 그것으로 판정한다 — 전역 변수는 명령 치환(서브셸)을 넘어오지 못했다
- r2 가 넣은 '판정 보류' 분기 제거

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-index-sync.sh`

## Decisions Made

- r2 의 진단('Notion 이 통합에게 안 보이는 사용자를 people 에서 뺀다')은 틀렸다. 실제 원인은 서브셸에서 잃은 전역 변수였고, 보드 이름은 정상적으로 읽힌다 — 보류 분기를 되돌리고 어긋난 행은 다시 실패시킨다

## Tests Executed

- `bash -n`
- `map_owners` 단독 실행 — 아는 이름 / 모르는 이름 / 섞인 목록 / 빈 값 네 갈래

## Test Results

- `정진 이` → `이정진`, `동건 이` → 모르는 이름으로 보고, 섞이면 모르는 쪽을 보고, 빈 값은 빈 값

## Known Problems

- `notion-owners.tsv` 에 아직 한 줄뿐이다. 이 PR 의 CI 가 나머지 세 명의 표시 이름을 알려주면 채운다 — 그 전까지 owner-drift 는 빨갛다

## Unverified Assumptions

- 보드의 12행이 대응표에 없는 이름 때문에 실패한 것이라고 본다. CI 출력이 그 이름들을 찍으면 확정된다

## Exact Next Action

CI 가 찍은 표시 이름 세 개를 notion-owners.tsv 에 추가한다.
