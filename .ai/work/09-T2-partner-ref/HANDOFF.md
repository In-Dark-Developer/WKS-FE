# Handoff — 09-T2-partner-ref

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 09/T2

## Goal

제휴 링크(`?ref=`)로 들어온 사람이 로그인하면 그 코드가 `POST /auth/kakao` 의 `ref` 로 가고, 이미 로그인한 사람은 `POST /wallet/partner-rewards` 로 받아, 지급되면 10/T6 의 소개팅 모달이 뜬다.

## Work Completed

- `features/auth/partnerRef.ts` — 진입 주소의 `ref` 를 sessionStorage 에 보관, 로그인 상태면 바로 보상 청구
- `kakaoLogin.ts` — 보관한 `ref` 를 로그인 요청에 싣고 성공하면 지운다
- `api/wallet.ts:claimPartnerReward` · `schema/wallet.ts:partnerRewardSchema`
- `RootLayout` — 진입 시 한 번 보관·청구
- openapi — `/wallet/partner-rewards` · `PartnerReward` · `ref`·`rewardGranted` 설명 (WKS-BE bfe89e3)

## Work In Progress

- 없음

## Files Changed

- `src/features/auth/{partnerRef,kakaoLogin,index}.ts`(+테스트) · `src/api/{wallet,schema/wallet}.ts`(+테스트) · `src/app/RootLayout.tsx` · `docs/api/openapi.yaml`

## Decisions Made

- 보관은 sessionStorage — 카카오 왕복은 같은 탭이고, 인앱→외부 브라우저 전환은 주소에 `ref` 가 남아 다시 읽힌다
- 청구가 401 이면 남겨 로그인이 싣고, 연결 실패도 남기며, 백엔드가 거절한 값(400)만 지운다
- 로그인 상태 청구의 지급도 10/T6 의 `rememberPendingReward` 에 남긴다 — 모달은 소개팅 화면에 도착했을 때 뜬다
- 목 모드는 로그인 목처럼 지급하지 않는다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 118 files / 689 passed · 타입 오류 0 · 린트 경고 0

## Known Problems

- 로그인 상태로 `/?ref=` 에 들어오면 모달은 소개팅 탭에 가야 뜬다(모달 위치는 10/T6 결정)
- 09/T2 의 인앱 브라우저 로그인 완주(NFR-8)는 실기기 확인이 남아 T2 는 체크하지 않는다

## Unverified Assumptions

- 실제 모드 지급은 api-dev 에 WKS-BE bfe89e3 가 배포돼야 확인된다

## Exact Next Action

PR 병합 뒤 dev.threadoffate.site `?ref=FESTIVAL` 로 로그인해 지급 모달 확인
