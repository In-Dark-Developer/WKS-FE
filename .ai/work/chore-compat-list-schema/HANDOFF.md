# Handoff — chore-compat-list-schema

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/api/` Owner — 리뷰, 05/T7 이 이 스키마를 쓴다)
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

결과·공유 조회의 `compatibilities` 가 운영 실제 응답 모양으로 파싱돼, 궁합이 있는 결과 화면·궁합 지도가 오류 없이 열린다.

## Work Completed

- `compatibilitySummarySchema`(조회 목록) → `{nickname, score, tier, createdAt}`, `compatibilitySchema`(궁합 생성 응답) → 두 닉네임 스키마로 분리 · `toReadingView` 가 `nickname` 을 그대로 쓴다 · 테스트 5개 파일 갱신 · Phase 05 PLAN Dependencies 사실 정정 (commit 17f0e5f)

## Work In Progress

- 없음 (PR 리뷰 대기)

## Files Changed

- `src/api/schema/result.ts`·`share.ts`(+test) · `src/features/saju/toReadingView.ts`(+test) · `src/app/routes.test.tsx` · `docs/phases/05-friend-score/PLAN.md`

## Decisions Made

- 소유자 지시(2026-09-15): 요청은 Swagger 대로 보내고 응답은 운영 실측으로 대조한다 — Swagger 와 실제가 다르면 실제를 따른다
- `createdAt` 은 화면이 쓰지 않지만 계약 필드라 문자열로 받는다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build` · 운영 호출(요청은 Swagger 대로) 응답 9개를 FE zod 봉투 스키마로 파싱: POST /results ×2, GET /results ×2(주인·친구), GET /shares, POST compatibility 201·200, 400 SELF_COMPATIBILITY, 404 RESULT_NOT_FOUND

## Test Results

- test 280 passed, typecheck·lint 경고 없음, build 성공 · 운영 응답 9개 모두 파싱 통과, 주인 친구 목록 `테스트친구 93 GUIIN`·친구 쪽 `테스트주인 93 GUIIN`

## Known Problems

- 운영 Swagger(`/v3/api-docs`)가 `ResultResponse`·`SharedResultResponse` 의 `compatibilities` 항목을 `CompatibilityResponse`(두 닉네임)로 적지만 실제는 `{nickname, score, tier, createdAt}` — 백엔드 문서 수정 요청 필요(백엔드 저장소는 고치지 않는다)
- 운영 DB 에 대조용 결과 2건(테스트주인·테스트친구)·궁합 1건이 남았다 — 지우는 API 없음

## Unverified Assumptions

- `/signups` 계열은 메일이 발송돼 호출 대조하지 않았다

## Exact Next Action

PR 리뷰·병합 → 백엔드 담당에 Swagger `compatibilities` 항목 타입 수정 요청
