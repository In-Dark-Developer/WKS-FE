# Handoff — 03-T2-state-session-adr

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/T2

## Goal

서버 상태 로딩과 세션 보관 방식이 ADR로 정해지고 ARCHITECTURE State Management에 TBD가 없다.

## Work Completed

- `docs/decisions/ADR-20260913-server-state-and-session-storage.md` (commit cc82bf8)
- 서버 상태: React Router loader/action/fetcher, 요청·캐시 라이브러리 없음, GET만 재시도 1회
- 세션: 로그인 없음, 백엔드 토큰 하나로만 식별·유지(소유자 결정). `src/api/session.ts`만 localStorage `wks:session` `{v:1,token}` 읽기·쓰기, 만료는 백엔드 응답으로 (commit 834eaed)
- ARCHITECTURE 4개 절 갱신, 공지 `2026-09-13-server-state-session`

## Work In Progress

- 없음

## Files Changed

- `docs/decisions/ADR-20260913-server-state-and-session-storage.md`
- `docs/ARCHITECTURE.md`
- `.ai/team/announcements/2026-09-13-server-state-session.md`, `.ai/team/README.md`
- `docs/phases/03-saju-reading/PLAN.md` (T2 체크)

## Decisions Made

- TanStack Query 기각 — 결과가 불변이고 무효화 대상은 `compatibilities` 하나, 라우터와 로딩 상태 이중화
- localStorage 채택 — 축제 3일 재방문, 요청 없이 가드 가능. XSS 노출은 감수. 백엔드가 HttpOnly 쿠키로 정하면 새 ADR
- `resultId`는 세션에 넣지 않음 — 공유 링크 재료로만
- `app → api/session` import 허용(기존 방향 안, lint 규칙 변경 없음)

## Tests Executed

- `pnpm lint` (문서 변경만)
- React Router 7.18.3 에 `useRouteLoaderData`·`shouldRevalidate`·HydrateFallback 경고 존재 확인

## Test Results

- 통과

## Known Problems

- 백엔드 1차 계약(로그인·세션 제외)에 토큰이 없다 — 백엔드 작업 필요(Q16). 그 전까지 실제 연동은 보호 화면 가드에 막히고 목 응답으로만 개발
- `openapi.yaml` 참조본은 여전히 `security: []` 주석이 '세션 없음'이다(계약과는 일치)

## Unverified Assumptions

- 토큰은 `POST /results` 응답으로, `Authorization: Bearer` 헤더로 오간다고 전제 — Q16 답으로 확인 필요

## Exact Next Action

PR #44 병합, 백엔드에 Q16(토큰 발급·전달·만료·조회 엔드포인트) 요청
