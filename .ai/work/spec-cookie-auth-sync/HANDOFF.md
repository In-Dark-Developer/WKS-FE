# Handoff — spec-cookie-auth-sync

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: -/-

## Goal

openapi 의 로그인 쿠키 계약이 WKS-BE dev(#91)의 실제 값과 같고 [가정] 표시가 없다.

## Work Completed

- 쿠키 이름 `wks_token`, SameSite=Lax, Domain 없음, 로그아웃 확정, 인증 경로에 /dating/**·/wallet/** — 머리 주석의 가정안 줄을 대조 기록으로 교체

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml`

## Decisions Made

- 없음

## Tests Executed

- `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 새 오류 없음(기존 `nullable` 1건)

## Known Problems

- SameSite=Lax 라 *.netlify.app 미리보기·localhost→원격 API 에서는 로그인이 안 된다(늘 비로그인).
- `src/api/auth.ts`·`src/api/schema/auth.ts` 주석의 'FE 가정 계약' 표현은 Touches 밖이라 남겼다.

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 dev.threadoffate.site 에서 09/T2·T3·T8 실제 모드 확인(카카오 Redirect URI 등록 필요).
