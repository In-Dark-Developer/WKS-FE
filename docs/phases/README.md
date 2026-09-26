# Phases

<!--
전체 개발 계획의 Phase 목록. 아래 표는 각 NN-<name>/PLAN.md 머리(Status·Lead·Depends on)와 Tasks 체크박스에서 `scripts/ai-stream.sh phases` 가 생성한다 — 손으로 고치지 않는다 (`ai-end.sh --ci` 가 어긋나면 FAIL).
- Phase 열기: `scripts/ai-stream.sh phase new <name>` (원격의 최대 NN + 1, 계획 스트림 ws/plan-NN-<name>).
- 지금 진행 중인 Task는 각 스트림의 CURRENT.md 가 기준이다. 활성 스트림은 `scripts/ai-stream.sh status`.
-->

<!-- phases:begin -->
| #  | Phase | Lead | Depends on | Status | Tasks | Result |
|----|-------|------|------------|--------|-------|--------|
| 01 | [project-setup](01-project-setup/PLAN.md) | @jjjung0921 | none | DONE | 6/6 | [RESULT](01-project-setup/RESULT.md) |
| 02 | [design-system](02-design-system/PLAN.md) | @gn00py48 | 01 | DONE | 6/6 | [RESULT](02-design-system/RESULT.md) |
| 03 | [saju-reading](03-saju-reading/PLAN.md) | @nicerjs23 | 02 | DONE | 8/8 | [RESULT](03-saju-reading/RESULT.md) |
| 04 | [share-and-card](04-share-and-card/PLAN.md) | @gn00py48 | 03 | DONE | 8/8 | [RESULT](04-share-and-card/RESULT.md) |
| 05 | [friend-score](05-friend-score/PLAN.md) | @nicerjs23 | 04 | DONE | 9/9 | [RESULT](05-friend-score/RESULT.md) |
| 06 | [dating-gate](06-dating-gate/PLAN.md) | @gn00py48 | 03 | DONE | 4/4 | [RESULT](06-dating-gate/RESULT.md) |
| 07 | [matching-thread](07-matching-thread/PLAN.md) | @nicerjs23 | 06 | PLANNED | 0/1 | — |
| 08 | [launch-readiness](08-launch-readiness/PLAN.md) | @jjjung0921 | 05, 07 | PLANNED | 5/6 | [RESULT](08-launch-readiness/RESULT.md) |
| 09 | [auth-and-shell](09-auth-and-shell/PLAN.md) | @jjjung0921 | 03 | PLANNED | 8/10 | — |
| 10 | [dating-onboarding](10-dating-onboarding/PLAN.md) | @jjjung0921 | 09 | PLANNED | 1/4 | — |
| 11 | [dating-thread](11-dating-thread/PLAN.md) | @jjjung0921 | 10 | PLANNED | 3/3 | — |
<!-- phases:end -->

## Phase Rules

- 한 Phase는 독립적으로 검증 가능한 하나의 결과를 낸다. 결과를 한 문장으로 말할 수 없으면 나눈다.
- Phase들은 `Depends on`으로 이어진 그래프다. 의존이 없는 Phase는 사람별·구성요소별로 **동시에** 진행할 수 있고, Phase마다 Lead 한 명이 있다.
- Task 하나 = 스트림 하나(`ws/NN-Tk-<slug>`). 한 Task를 다시 열어야 하면 `ai-stream.sh open --reopen`.
- 같은 Phase 안의 선후는 Task 줄의 `After: Tk`로 적는다. `ai-stream.sh open`이 선행 Task가 main에 `[x]`가 아니면 경고한다 — 병렬로 시작할 수는 있지만 병합 전 `git merge main`으로 선행 결과를 받는다. `After`가 없는 Task는 서로 동시에 진행한다.
- Phase 종료 조건: PLAN의 Acceptance Criteria 전부 충족 + Validation Plan 수행 + `Depends on`의 Phase가 DONE + 그 Phase의 활성 스트림 없음 + RESULT.md 작성. Lead가 `ws/phase-NN-close` 스트림에서 RESULT 작성 → PLAN Status=DONE → `ai-stream.sh phases` → `ai-stream.sh gc` → PR. 병합 후 `ai-stream.sh tag NN`.
