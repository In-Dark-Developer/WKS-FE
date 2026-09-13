# Handoff — spec-hosting-domains

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

프론트 호스팅(Netlify `threatoffate.site`)과 백엔드 주소(`api.threatoffate.site`)가 ADR·ARCHITECTURE·openapi 에 적혀 있다.

## Work Completed

- `docs/decisions/ADR-20260913-hosting-and-domains.md` (대안 3개, SPA 폴백, CORS·DNS·OG 미정)
- ARCHITECTURE External Systems 정적 호스팅·백엔드 운영 주소, openapi servers 운영 주소, 공지 `hosting-domains`(Required: no)

## Work In Progress

- 없음

## Files Changed

- `docs/decisions/`, `docs/ARCHITECTURE.md`, `docs/api/openapi.yaml`, `.ai/team/`

## Decisions Made

- 소유자: Netlify, 프론트 apex·백엔드 `api.threatoffate.site`

## Tests Executed

- redocly lint · announce --check

## Test Results

- valid, 경고 4개(기존)

## Known Problems

- 백엔드 합의 전: CORS 허용 origin, 운영 `/api` 접두, verify-redirect-url
- 공유 링크 OG 미리보기(NFR-3) 방식 미정 — Phase 08

## Unverified Assumptions

- 운영 API 도 `/api` 접두

## Exact Next Action

PR 리뷰 후 병합
