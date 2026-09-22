# Handoff — plan-v1

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-opus-5
- To: 없음
- Date: 2026-09-23
- Phase / Task: v1/-

## Goal

V1 요구 13건이 Phase 세 개·Task 열 개로 갈려 각자 충돌 없이 스트림을 열 수 있다.

## Work Completed

- Phase 09(auth-and-shell, 5 Task) · 10(dating-onboarding, 3) · 11(dating-thread, 2) 을 세웠다. 결과를 한 문장으로 말할 수 있는 단위로 갈랐다.
- Task 의 `Touches` 를 2026-09-23 담당 배정의 모듈 경계에 맞췄다 — 같은 파일을 두 사람이 동시에 잡지 않는다.
- `After` 를 ⚔️ PRD 보드의 `선행` 관계와 같게 박았다.
- `ai-stream.sh phases` 로 `docs/phases/README.md` 표를 갱신했다.

## Work In Progress

- 없음

## Files Changed

- `docs/phases/09-auth-and-shell/PLAN.md` (신규)
- `docs/phases/10-dating-onboarding/PLAN.md` (신규)
- `docs/phases/11-dating-thread/PLAN.md` (신규)
- `docs/phases/README.md`

## Decisions Made

- Phase 06·07 을 다시 열지 않고 09~11 을 새로 세운다 — 06·07 은 V0.5 범위이고 FR-12·FR-13 은 V1 요구가 대체한다.
- Task 를 FR 에 1:1 로 걸지 않고, 소유자와 모듈이 같고 선행이 직렬인 FR 은 한 Task 로 묶었다(10/T1 = FR-24+25, 11/T2 = FR-29+30). 쪼개도 PR 만 늘고 얻는 것이 없다.
- Task 의 `Touches` 에 해당 `docs/prd/` 조각을 함께 선언한다 — Rule 7 의 예외를 써서 spec 과 구현을 한 PR 로 끝낸다.

## Tests Executed

- `bash scripts/ai-stream.sh phases`
- `bash scripts/ai-end.sh --ci`

## Test Results

- README 표가 PLAN 머리와 일치한다(09: 0/5 · 10: 0/3 · 11: 0/2).

## Known Problems

- Phase 10·11 의 소개팅 화면은 v1.0 Figma 에 이름 없는 와이어프레임뿐이다 — 확정 디자인 없이는 Done when 을 판정할 수 없다. 두 Phase 의 최대 위험이다.
- Lead 를 셋 다 @jjjung0921 로 두었다. 10·11 은 실제 Lead 로 바꿔야 한다.
- Phase 06(IN_PROGRESS, 4/4) 과 07(PLANNED, 0/1) 이 열린 채다 — V0.5 범위이므로 닫을지 Lead 가 정한다.

## Unverified Assumptions

- 백엔드 계약(로그인 콜백·프로필·추천·해금·요청)이 각 Phase 의 첫 Task 착수 전에 `docs/api/openapi.yaml` 로 온다고 가정했다.

## Exact Next Action

dev 에 병합하고 09/T1·09/T2 스트림을 연다.
