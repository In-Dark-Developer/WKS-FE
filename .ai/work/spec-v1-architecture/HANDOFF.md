# Handoff — spec-v1-architecture

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

ARCHITECTURE.md 가 V1(FR-19~FR-31, Phase 09~11)을 기술하고, 로그인·기록 출처 결정이 ADR 로 남는다.

## Work Completed

- ADR-20260923-v1-account-and-kakao-login (신규)
- ARCHITECTURE.md 7개 절 갱신, 실재하지 않는 `features/matching`·`/matching` 기술 제거
- 공지 2026-09-23-v1-architecture + `.ai/team/README.md` 색인

## Work In Progress

- 없음

## Files Changed

- `docs/ARCHITECTURE.md` · `docs/decisions/ADR-20260923-v1-account-and-kakao-login.md`
- `.ai/team/announcements/2026-09-23-v1-architecture.md` · `.ai/team/README.md`

## Decisions Made

- 로그인 판단은 `api/me.ts` 단일 출처 — `HttpOnly` 쿠키는 읽을 수 없고 인앱 차단과 구분되지 않는다
- 계정 기록이 게스트 기록을 이기고 두 기록을 합치지 않는다 (FR-21)
- 소개팅은 `features/dating/` 한 feature 안의 단계 폴더 — `features ↔ features` import 회피

## Tests Executed

- `ai-stream.sh announce --check` (색인 일치)

## Test Results

- 코드 변경 없음 — test·typecheck·lint 는 CI 가 돌린다

## Known Problems

- V1 API 계약(`docs/api/openapi.yaml`)이 비어 있어 `api/` 신규 파일의 경로·스키마는 미정 (Phase 09/T2 전제)
- Notion 「프론트 프로젝트 폴더 구조」의 FR 번호(FR-46·FR-51~63)가 repo PRD(FR-1~31)와 다르다 — 이 PR 은 repo 번호를 따랐다
- `ReadingScreen` → `HomeScreen` 개명 제안은 반영하지 않았다 (Phase 09/T1 Scope)

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰를 받고 병합한 뒤 Phase 09/T1 로 돌아간다.
