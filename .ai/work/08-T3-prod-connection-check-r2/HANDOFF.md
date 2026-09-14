# Handoff — 08-T3-prod-connection-check-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @jjjung0921 (Netlify 인증서 발급)
- Date: 2026-09-14
- Phase / Task: 08/T3

## Goal

운영 주소 `https://threadoffate.site` 가 HTTPS 로 열리고 새로고침·API 호출(CORS)이 동작함을 확인해 RESULT 에 남긴다.

## Work Completed

- 재점검 표 `docs/phases/08-launch-readiness/RESULT.md` (2026-09-14 14:40): DNS apex A·www CNAME, Netlify 사이트·SPA·캐시, 번들 API 주소, 백엔드 HTTPS, CORS(Origin 3개) ✅

## Work In Progress

- 도메인 HTTPS 인증서 대기 — `https://threadoffate.site`·`www` 가 `*.netlify.app` 인증서를 돌려준다

## Files Changed

- `docs/phases/08-launch-readiness/RESULT.md`

## Decisions Made

- 없음

## Tests Executed

- `dig @8.8.8.8` (NS·A·CNAME), `curl` (Netlify·apex `--resolve`·번들·HTTPS·CORS preflight), `gh run list --workflow sync-fork.yml`

## Test Results

- RESULT 재점검 표 그대로. 남은 ❌ 는 HTTPS 인증서 1건, ⏸ 는 운영 화면 API 호출 1건

## Known Problems

- `docs/deploy/netlify-fork.md` 가 옛 사이트 이름 `effulgent-torrone-699094.netlify.app` 을 적고 있다(지금 `wks-fe.netlify.app`, 옛 주소 404) — Touches 밖, 별도 스트림 필요
- 로컬 macOS 리졸버가 레코드 추가 전 음성 응답을 캐시해 `threadoffate.site` 를 못 찾았다 — `curl --resolve` 로 우회

## Unverified Assumptions

- 사이트 이름 변경(`wks-fe`)은 소유자가 Netlify 에서 직접 한 것으로 본다

## Exact Next Action

Netlify Domain management 에서 DNS 검증 재시도 → 인증서 발급 확인 후 RESULT 표 ❌·⏸ 행 재점검
