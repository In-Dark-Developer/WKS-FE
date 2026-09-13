# Handoff — plan-04-share-and-card

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 04/T1

## Goal

Phase 04 PLAN 의 Scope·Tasks·Acceptance Criteria·Validation Plan 이 채워져, 남은 공유 흐름(FR-4)·인연카드 이미지 공유(FR-5)·폴백(FR-16)을 누가 어떤 순서로 만들지가 Task 단위로 정해진다.

## Work Completed

- PLAN 의 Motivation·Scope·Out of Scope·Dependencies·Tasks·Acceptance Criteria·Validation Plan 작성
- Task 4개 추가 — T3 공유 링크 버튼(퍼블리싱) · T4 카드 이미지 생성(+ADR) · T5 인연카드 화면(After T3·T4) · T6 결과 화면·라우트 조립(After T5)
- `docs/phases/README.md` 색인 재생성 (04 = 1/6)

## Work In Progress

- 없음

## Files Changed

- `docs/phases/04-share-and-card/PLAN.md`
- `docs/phases/README.md` (파생 — `ai-stream.sh phases` 생성)

## Decisions Made

- 공유 방식(PRD Q11)을 **Web Share 우선 → 클립보드 복사 → 링크 텍스트 노출** 3단 폴백으로 정했다. 카드 이미지는 `navigator.share({files})` → 실패 시 다운로드.
- 인연카드 등급은 백엔드에 `cardGrades` 를 요청하지 않고 `SharedResult.fortunes[]`(MARRIAGE·CHILDREN·LOVE + `Grade` SS~B)를 그대로 쓴다 — PRD Q3 중 Phase 04 를 막던 부분이 닫힌다.
- NFR-3(OG 미리보기)을 Phase 04 Out of Scope 로 옮겼다 — Phase 08 T4 가 `index.html`·`public/og/` 에서 맡는다.
- T4(이미지 생성)를 T5(화면)에서 분리했다 — 외부 의존성 판단(ADR)이 걸려 작업 속도가 다르다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `scripts/ai-stream.sh phases --check`

## Test Results

- 46 files / 206 tests 통과 · typecheck 통과 · lint 경고 0 · 색인 차이 0

## Known Problems

- PRD FR-5 는 인연카드 앞면을 '연애운·결혼운·**운명운**' 이라 적었으나 계약(`FortuneCategory`)과 04/T2 구현은 '결혼운·**자녀운**·연애운' 이다. PLAN 은 계약을 따랐다 — PRD 수정은 Touches 밖이라 spec 스트림 건이다.
- `src/app/routes.tsx` 소유가 03/T7 → 04/T6 으로 넘어간다고 PLAN 에 적었으나 06/T3(`/reading/:id/pre-register`)도 같은 파일을 노린다. 두 Task 가 겹치면 먼저 연 쪽이 갖는다.
- 이 기계의 Node 가 v22.15.1 인데 `engines` 는 `>=26` 이다 (경고만, 검증은 통과).

## Unverified Assumptions

- T6 Owner 를 @nicerjs23 으로 적은 것은 공지 publishing-first 의 연동 담당 원칙에서 끌어온 제안이다 — 본인 확인 전이다.
- 카드 PNG 를 Web Share 파일로 넘기는 방식이 iOS Safari 인스타에서 실제로 동작하는지는 T5 에서 실기기로 확인해야 한다.

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR 을 올리고, 병합 뒤 T3(공유 링크 버튼)과 T4(카드 이미지, ADR 포함) 스트림을 병렬로 연다.
