# Handoff — 08-T3-prod-connection-check

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 08/T3

## Goal

운영 주소 `https://threadoffate.site` 가 열리고 새로고침·API 호출(CORS)이 동작함을 확인해 RESULT 에 남긴다.

## Work Completed

- 점검 표 `docs/phases/08-launch-readiness/RESULT.md`: fork 동기화·Netlify·SPA·캐시 ✅, 번들 API 주소 오타·apex/www 레코드 없음·백엔드 443 거부·CORS 403 ❌
- 실제 도메인 threadoffate.site 로 netlify.toml·ARCHITECTURE·openapi·현재 ADR·운영 문서·PLAN 수정, 공지

## Work In Progress

- 없음

## Files Changed

- CURRENT Touches 그대로

## Decisions Made

- 대체된 ADR·지난 공지 본문은 고치지 않고 새 공지로 정정

## Tests Executed

- dig @8.8.8.8(NS·A·CNAME), curl(Netlify·/s/test·자산 헤더·번들 문자열·api 80/443·OPTIONS), redocly

## Test Results

- RESULT 표 참고 — T3 미완

## Known Problems

- 백엔드 HTTPS 없음(443 refused), CORS 에 Netlify origin 없음(403)
- Route53 apex A·www CNAME 없음, Netlify 에 도메인 추가 여부 미확인

## Unverified Assumptions

- 운영 API `/api` 접두 (HTTP 400 응답은 경로 존재를 뜻할 수 있음)

## Exact Next Action

PR 병합 → 오타 수정본 배포 확인 → 백엔드 작업 뒤 재점검
