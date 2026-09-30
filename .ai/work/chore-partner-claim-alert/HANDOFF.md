# Handoff — chore-partner-claim-alert

- From: claude-code
- To: 없음
- Date: 2026-09-30
- Phase / Task: 10/T22

## Goal

로그인한 채 제휴 배너로 들어온 사람도 지급 알림을 보고, 서버 오류로 지급이 실패하면 다음 진입에 다시 받는다.

## Work Completed

- `claimPendingPartnerRef` 가 지급을 남겼는지 돌려주고, `INTERNAL_ERROR` 면 ref 를 지우지 않는다
- `RootLayout` 이 지급이 늦게 오면 `PendingRewardDialog` 를 key 로 다시 그려 보관된 지급을 꺼낸다

## Work In Progress

- 없음

## Files Changed

- `src/app/RootLayout.tsx` · `src/app/RootLayout.test.tsx`
- `src/features/auth/partnerRef.ts` · `src/features/auth/partnerRef.test.ts`

## Decisions Made

- 다시 그리는 것은 지급이 있을 때만 — 로그인 응답으로 이미 뜬 알림을 지우지 않게

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 744 통과, 타입·린트 경고 없음. 새 RootLayout 테스트는 key 를 빼면 실패함을 확인

## Known Problems

- 실 현황(`ThreadGuideDialog`)의 '축제 사이트 방문' 줄은 늘 미지급으로 보인다 — `GET /wallet` 에 지급 여부가 없어 백엔드 요청
- dev 에서 memberId 2 세션의 `POST /wallet/check-in`·`partner-rewards` 가 500(traceId fbb5cd66, 6d1cbbf0) — 회원 행이 없는 토큰으로 추정, 백엔드 요청

## Unverified Assumptions

- 정상 계정으로 로그인한 실측은 못 했다(카카오 로그인 필요) — 단위·통합 테스트로만 확인

## Exact Next Action

PR 병합 뒤 dev 에서 로그인한 계정으로 `/?ref=FESTIVAL` 진입해 알림이 뜨는지 본다.
