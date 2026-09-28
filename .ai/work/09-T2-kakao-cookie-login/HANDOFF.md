# Handoff — 09-T2-kakao-cookie-login

- From: claude-code
- To: 없음
- Date: 2026-09-25
- Phase / Task: 09/T2

## Goal

FE 가 openapi 쿠키 계약(PR #205)대로 카카오 로그인·로그아웃을 하고, 목 모드에서 로그인 시트 → 콜백 → 원래 화면 복귀가 끝까지 동작한다.

## Work Completed

- `api/client.ts` 모든 요청 `credentials: 'include'` · `api/auth.ts` loginWithKakao·logout(목 포함) · `api/schema/auth.ts`
- `api/me.ts` 목 계정을 localStorage(`wks:mock-account`)에 둬 새로고침·전체 페이지 이동에도 유지(쿠키 흉내)
- `features/auth/kakaoLogin.ts` — 인가 URL·state+복귀 경로(sessionStorage `wks:kakao-login`)·콜백 완료. `Feat/Login`(b226363)에서 옮기고 토큰 저장 제거. 목 모드는 가짜 코드로 콜백 경로 직행
- `app/routes/auth.routes.ts` `/auth/kakao/callback` loader → returnTo 로 redirect · 티저·소개팅 인트로의 로그인/로그아웃 연결

## Work In Progress

- 없음

## Files Changed

- `src/api/{auth,client,me}.ts` · `src/api/schema/{auth,me}.ts` · `src/features/auth/*` · `src/app/routes/{auth.routes.ts,index.tsx,saju.routes.tsx,dating.routes.tsx}` · `src/vite-env.d.ts`

## Decisions Made

- 로그인 실패·취소는 시작 화면으로 조용히 돌아간다(콘솔만) — FR-21 "취소·실패해도 현재 기록 유지".
- 복귀 경로는 `/` 로 시작하는 같은 origin 경로만 허용(`//` 차단).

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 목 모드 브라우저: 소개팅 인트로 로그인 → /dating 복귀, 새로고침 유지, 로그아웃, 위조 state → `/`

## Test Results

- 전부 통과

## Known Problems

- 실제 모드 미검증 — BE(dev 5ec80d2)가 아직 Bearer·body token. `VITE_KAKAO_CLIENT_ID` 배포 환경변수와 콜백 주소 BE 화이트리스트 등록 필요.
- 로그인 실패 안내 문구 없음(디자인 없음). ARCHITECTURE Persistence 에 새 저장소 키 2개(`wks:kakao-login`, 목 전용 `wks:mock-account`) 미기재 — 다음 spec 에 반영.
- `restoredResultId` 를 세션에 쓰는 복원은 09/T3.

## Unverified Assumptions

- 콜백 경로 `/auth/kakao/callback` (BE §9 예시와 같음), 쿠키 이름·SameSite 는 계약의 [가정].

## Exact Next Action

BE 쿠키 전환 후 실제 모드로 확인하고 PLAN T2 를 체크한다. 그 전에는 09/T3.
