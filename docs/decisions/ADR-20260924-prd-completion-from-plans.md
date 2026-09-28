# ADR-20260924: PRD 보드의 `UI 완료`·`기능 완료` 를 PLAN Task 완료에서 이끌어낸다

- Status: Accepted
- Date: 2026-09-24
- Deciders: @jjjung0921

## Context

⚔️ PRD 보드에 `UI 완료`·`기능 완료` 체크박스가 생겼다(FE 뷰). ADR-20260923-prd-single-notion-db 는 저장소가
원천인 열(`ID`·`이름`·`구분`·`우선순위`)만 CI 가 쓰고 나머지 추적 열은 사람이 관리하게 했다. 두 체크박스를 손으로
켜면 Task 가 끝난 뒤 보드가 늦게 따라오거나 잊힌다. 완료 사실은 이미 PLAN 의 `[x]` 로 저장소에 있다.

## Problem

Task 완료와 FR 완료를 어떻게 잇고, 퍼블리싱과 연동이 나뉜 FR(10/T4 · 11/T3 같은 퍼블리싱 Task)을 어떻게 구분하는가.

## Alternatives

1. 사람이 보드에서 켠다 — 바꿀 것이 없다 / Task PR 과 보드가 따로 움직여 늦거나 빠진다.
2. Task 이름·Touches 로 추측한다 — PLAN 을 안 고친다 / '퍼블리싱' 같은 말에 기대 틀리기 쉽다.
3. Task 줄에 `FR:`·`UI:` 필드를 두고 CI 가 계산한다 — 명시적이다 / PLAN 작성자가 필드를 적어야 한다.

## Decision

3안. Task 줄의 Owner 뒤에 `· FR: FR-n, …`(그 FR 을 동작하게 만드는 Task) 또는 `· UI: FR-n, …`(화면만 만드는
퍼블리싱 Task)를 적는다. `notion-index-sync.sh --prd` 가 dev push 마다 FR 별로 계산해 보낸다.

- `기능 완료` = 그 FR 을 `FR:` 로 가리킨 Task 가 모두 `[x]`.
- `UI 완료` = 그 FR 을 `UI:` 로 가리킨 Task 가 모두 `[x]`. `UI:` Task 가 없으면 `기능 완료` 와 같다 — 연동 Task 가 화면까지 만든다.
- 어느 Task 도 가리키지 않는 FR 은 두 열을 보내지 않는다 — V0.5 에서 끝난 FR 의 보드 값은 사람이 둔 그대로다.

두 열은 이제 저장소가 원천이다. 보드에서 손으로 바꾼 값은 다음 동기화에 덮어써진다.

## Rationale

- Task 완료가 PR 병합으로 오므로 보드가 병합 시점에 맞춰진다. 병합된 `[x]` 가 곧 근거다.
- 필드를 Owner 뒤에 둬 `Touches:`·`After:` 를 읽는 기존 파서(`ai-stream.sh open`, Task 보드 선행 관계)를 건드리지 않는다.

## Consequences

- PLAN 작성자는 Task 에 `FR:`/`UI:` 를 적는다(`docs/phases/_template/PLAN.md`). Phase 09~11 은 이 ADR 과 함께 채웠다.
- 워크플로가 `docs/phases/*/PLAN.md` push 에도 돈다. PR 의 담당 대조는 PLAN 변경으로 돌지 않는다.
