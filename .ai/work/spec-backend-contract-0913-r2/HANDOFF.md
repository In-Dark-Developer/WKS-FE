# Handoff — spec-backend-contract-0913-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

docs/api/openapi.yaml 참조본과 PRD·ARCHITECTURE 가 WKS-BE b61f849 의 api-spec.md·코드와 일치한다.

## Work Completed

- openapi 0.2.0: ResultRequest(calendarType·isLeapMonth·birthTime 규칙, birthRegion 제거, birthDate 문자열 패턴), Result(shareId·zodiac·compatibilities)·SharedResult, Grade 6단계·Zodiac·CalendarType enum, `/results/{id}/compatibility` → `/shares/{shareId}` GET·`/shares/{shareId}/compatibility`(guestResultId), tier 구간 확정, traceId 미구현 표기
- PRD: FR-2(윤달·자시 두 칸), FR-3·FR-5 등급 6단계, Q3 축소, Q7·Q8·Q15 삭제
- ARCHITECTURE Data Flow 1·2, 세션 절 shareId, 03·05 PLAN 의존 문구, 공지 `backend-contract-r2`

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml`, `docs/PRD.md`, `docs/ARCHITECTURE.md`
- `docs/phases/03-saju-reading/PLAN.md`, `docs/phases/05-friend-score/PLAN.md`
- `.ai/team/announcements/2026-09-13-backend-contract-r2.md`, `.ai/team/README.md`

## Decisions Made

- 원본은 백엔드 api-spec.md. 코드와 다른 곳(signup 경로 `/api/signup`·엔드포인트 없음, traceId 없음)은 문서를 따르고 [미확인] 표기
- `birthDate` 는 `format: date` 대신 패턴 — 음력 2월 30일 같은 값이 온다
- `isLeapMonth` 는 nullable(백엔드 Boolean, 생략·null=false)

## Tests Executed

- `npx @redocly/cli@1 lint docs/api/openapi.yaml` · YAML 파싱 · `phases --check` · `announce --check` · `pnpm lint`

## Test Results

- redocly valid(경고 4 — 헬스체크 등 4xx 응답 없음, 기존과 같음), 나머지 통과

## Known Problems

- 04 PLAN 의 'B0~SS' 표기는 plan PR #53 이 04 를 고치는 중이라 건드리지 않음 — 병합 후 한 줄 수정
- ADR-20260913-server-state-and-session-storage 본문의 'resultId 는 공유 링크 재료' 는 이제 shareId — ADR 은 본문 수정 금지, 토큰 계약(Q16) ADR 때 함께 대체
- 백엔드 FortuneCategory 에 운명운 없음 — 인연카드 '운명운' 등급 출처 미정(Q3 cardGrades)
- T4 SajuForm 은 이미 이 계약 모양으로 보낸다 — 코드 변경 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰(@hairyung2002) 후 병합, 03/T1 소유자에게 공지 확인 요청
