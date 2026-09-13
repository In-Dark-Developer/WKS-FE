# Handoff — spec-backend-source-check

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

WKS-BE 소스 대조(2026-09-13)로 확정된 사실이 openapi·PRD·Phase 03 PLAN 에 반영되어 Phase 03 T1 이 실제 응답으로 깨지지 않는다.

## Work Completed

- openapi: `error.traceId` required 해제(백엔드 미구현) · `CompatibilityTier` enum 4값 · INVALID_INPUT message 형식 설명 · 머리말에 소스 대조 기록
- PRD: Q3 에 tier 구간 충돌(BE 76/51/26 vs PRD 90/75/61) 명시 · Q15(사주 입력 규칙 — calendarType·isLeapMonth·birthRegion 제거·시진 가운데 시각·자시 2칸) 추가
- Phase 03 PLAN: `GET /results/{id}` 미구현 → 목 경로 필수 · vite 포트 3000(BE CORS) · T1 Touches 에 `vite.config.ts`

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `docs/PRD.md` · `docs/phases/03-saju-reading/PLAN.md`

## Decisions Made

- `feat/4` 의 계약 변경(calendarType·isLeapMonth·birthRegion 제거)은 dev 미병합이라 openapi 에 넣지 않고 Q15 로만 기록 — 병합 후 spec 스트림
- FR-7 구간은 기획 결정 전까지 PRD 그대로. 화면은 tier 값만 쓴다

## Tests Executed

- `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 오류 0, 경고 4(이전과 동일)

## Known Problems

- `ws/spec-drop-birth-region`(REVIEW)이 openapi birthRegion 설명 줄을 바꾼다 — 이 스트림은 그 줄을 안 건드려 충돌 없음. 병합 순서 무관

## Unverified Assumptions

- 없음

## Exact Next Action

`scripts/ai-end.sh --ready --web` 으로 PR 을 연다.