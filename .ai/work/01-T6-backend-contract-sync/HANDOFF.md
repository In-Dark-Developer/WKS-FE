# Handoff — 01-T6-backend-contract-sync

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 01/T6

## Goal

`docs/api/openapi.yaml` 이 백엔드 api-spec.md(2026-09-13)와 일치하고 차이가 등록되어 Phase 03 T1 이 시작할 수 있다.

## Work Completed

- 참조본 일치 확인(PR #15 에서 교체됨) · 차이 등록 확인(PRD Q3·Q7·Q14 · backend-questions.md 24항목)
- PLAN 01 T6 완료 표시, Owner @jjjung0921, Done-when 을 '답변 반영'이 아니라 '차이 등록'으로 재작성

## Work In Progress

- 없음

## Files Changed

- `docs/phases/01-project-setup/PLAN.md` (T6 한 줄)

## Decisions Made

- 백엔드 답변을 기다리지 않고 T6 를 닫는다(소유자 결정). 답변 반영은 후속 spec 스트림

## Tests Executed

- `npx @redocly/cli lint docs/api/openapi.yaml` · `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- lint 오류 0(경고 4, 참조본이라 무시) · test 1/1 · typecheck·lint 통과

## Known Problems

- BE 소스(WKS-BE dev 4cf672e, feat/4-saju-calculator 9896e52) 대조 결과: 구현된 것은 `POST /api/results` 뿐. `GET /results/{id}`·궁합·signup 은 빈 컨트롤러이며 경로도 spec 과 다르다(`/api/compatibility`, `/api/signup`). `error.traceId` 없음(요구사항 FR-CM-08 에는 있음). INVALID_INPUT 의 message 는 필드 메시지를 ", " 로 이어 붙인 문자열
- **Tier 구간 충돌**: BE architecture/backend-requirements 는 76–100 GUIIN · 51–75 CHALTTEOK · 26–50 BEOT · 0–25 SEUCHIM. PRD FR-7(귀인 ≥90 · 찰떡 75–89 · 벗 61–74 · 스침 ≤60)과 다르다 — 기획 결정 필요
- feat/4 브랜치의 api-spec.md 가 참조본보다 새롭다: `calendarType`(필수)·`isLeapMonth` 추가, `birthRegion` 제거, 시진은 칸 가운데 시각(`HH:mm`)으로 전송, 자시 두 칸 분리 요청. dev 병합 전이라 참조본에는 아직 안 넣었다 — 병합되면 후속 spec 스트림
- 실기동 대조는 못 했다(Docker 미기동). 코드·Flyway V1·V2·application.yml 로 확인

## Unverified Assumptions

- 없음 — 포트 8080(server.port 미설정) · CORS `http://localhost:3000` · verify 리다이렉트 기본 `http://localhost:3000/verify` · tier 4값 `GUIIN CHALTTEOK BEOT SEUCHIM` · 이메일 도메인은 env `SIGNUP_ALLOWED_EMAIL_DOMAINS`(기본 빈 값) 모두 소스에서 확인

## Exact Next Action

PR 을 열어 병합한다. 그 뒤 Phase 03 T1 을 연다.