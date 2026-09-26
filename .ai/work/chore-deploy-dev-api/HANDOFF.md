# Handoff — chore-deploy-dev-api

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: -/-

## Goal

dev.threadoffate.site 가 백엔드 dev 서버(api-dev.threadoffate.site)를 부른다.

## Work Completed

- `netlify.toml` `[context.dev.environment]` VITE_API_BASE_URL = api-dev · `docs/deploy/netlify.md` 구성도·요청 사항 갱신

## Work In Progress

- 없음

## Files Changed

- `netlify.toml` · `docs/deploy/netlify.md`

## Decisions Made

- 없음

## Tests Executed

- api-dev 확인(2026-09-26): CORS dev origin 허용·credentials, /me 401, logout Set-Cookie wks_token

## Test Results

- 통과. 단 /auth/kakao 는 KAKAO_UNAVAILABLE — dev 서버에 카카오 키·시크릿·JWT_SECRET 미설정(isConfigured false)

## Known Problems

- dev 서버 로그인 설정(KAKAO_CLIENT_ID·SECRET·JWT_SECRET·KAKAO_ALLOWED_REDIRECT_URIS)은 백엔드 담당

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 dev 번들 API 주소 확인.
