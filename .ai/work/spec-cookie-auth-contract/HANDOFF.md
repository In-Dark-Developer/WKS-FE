# Handoff — spec-cookie-auth-contract

- From: claude-code
- To: 없음
- Date: 2026-09-25
- Phase / Task: -/-

## Goal

백엔드 쿠키 전환 전에 FE 가 가정할 로그인 쿠키 계약이 dev 에 있어 09/T2·T3 를 목 모드로 진행할 수 있다.

## Work Completed

- `openapi.yaml`: `POST /auth/kakao`(resultId·ref 연결·복원 규칙, 응답에 token 없음, Set-Cookie) · `POST /auth/logout` · `GET /me/result` · `/me` security · `cookieAuth` 스킴 · 스키마 `KakaoLoginRequest`·`KakaoLoginResult`
- PLAN 09: T2 Owner 곽도윤 → 이정진, 가정 계약·부분 전달 진행 메모
- 공지 `2026-09-25-cookie-auth-contract` (Required, all)

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `docs/phases/09-auth-and-shell/PLAN.md` · `.ai/team/announcements/2026-09-25-cookie-auth-contract.md` · `.ai/team/README.md`

## Decisions Made

- 백엔드 §9 초안을 그대로 두고 토큰 전달만 쿠키로 바꿨다 — 백엔드와 어긋날 면을 최소로 한다.
- 로그아웃 엔드포인트를 더했다 — HttpOnly 쿠키는 프론트가 지울 수 없다.

## Tests Executed

- `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 새 오류 없음 (기존 `nullable` 오류 1건 그대로, 새 경고: logout 4xx 없음 — 멱등이라 의도)

## Known Problems

- 백엔드 dev 5ec80d2 는 아직 Bearer·body token 이고 `/dating/**` 도 Bearer 다. 쿠키 이름·SameSite·logout 은 [가정].

## Unverified Assumptions

- 쿠키 이름 `WKS_SESSION`, `SameSite=None; Secure`, `POST /auth/logout` 200 — 곽도윤 확인 필요.

## Exact Next Action

PR 병합 후 `scripts/ai-stream.sh open 09/T2 kakao-cookie-login`.
