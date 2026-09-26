# Handoff — 10-T2-dating-thread-wallet

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰) · @gn00py48 (강근우 · 해금이 같은 잔액을 쓴다)
- Date: 2026-09-27
- Phase / Task: 10/T2

## Goal

재화 '실'의 잔액이 백엔드 원장(`GET /api/wallet`) 하나에서 오고, 해금으로 줄어든 잔액이 화면에 바로 반영되며, 모자랄 때 소모가 막히고 안내가 뜬다. 화면은 잔액을 계산하지 않는다.

## Work Completed

- openapi: `GET /wallet` · `POST /wallet/check-in` · `Wallet`·`WalletCheckIn` (WKS-BE §12, dev adf54ab)
- `src/api/wallet.ts`·`schema/wallet.ts` 신규 — 잔액 조회·출석 체크
- 목 원장을 백엔드 규칙과 맞춤(`me.ts`): 가입 10 은 **최초 로그인** 1회 · 출석 5 는 하루 1회 · 해금이 쓴 만큼 차감
- 카드 잔액의 단일 출처를 `GET /wallet` 으로 바꿈(`/me` 는 게이트 요약). 조회 실패는 0 으로 두어 소모가 막힌다(FR-31)
- 11/T2(#228) 병합 충돌 정리 — 같은 `Promise.all` 을 둘이 고쳐 잔액(원장)·보낸 신청 둘 다 살림

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `docs/api/openapi.yaml` · `src/api/{wallet,schema/wallet}.ts`(신규) · `src/api/me.ts`·`schema/me.ts`
- `src/features/dating/recommendation/recommendationsLoader.ts` (+테스트) · `src/app/routes/index.test.tsx`·`src/api/me.test.ts` 목 갱신
- `notes/to-gn00py48-wallet.md` — 강근우님께 보낼 알림(잔액 출처·목 규칙·503 문구 제안)

## Decisions Made

- 잔액은 원장(`GET /wallet`) 하나에서만 읽는다 — `/me`·해금 응답·원장 셋으로 갈리면 화면마다 다른 값이 보인다
- 조회 실패 시 잔액을 0 으로 둔다 — 카드는 그대로 보이고 소모만 막힌다(FR-31 '모자라면 막고 안내')
- 출석 체크 버튼은 만들지 않았다 — 디자인은 있으나 퍼블리싱 Task 몫이라 API 만 둔다(소유자 결정 2026-09-26)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 106 files / 561 passed · typecheck·lint 경고 0 · redocly 새 문제 없음(기존 7건 그대로)
- 목 모드 브라우저 확인은 아직 안 했다

## Known Problems

- 출석 체크(`POST /wallet/check-in`)를 누를 UI 가 내 할당이 아니다 — 디자인은 있으나 퍼블리싱 Task 몫이라 이 스트림은 API 만 두고 버튼을 만들지 않는다(소유자 결정 2026-09-26)
- 제휴 지급(FR-32)은 백엔드 미구현 — `rewardGranted` 는 당분간 항상 null
- 리롤 API 는 여전히 없다 — 리롤 비용 판정은 목 그대로다
- 궁합 까닭 해금이 503 이면 실은 이미 차감된 뒤인데(WKS-BE §10.5) 화면 문구가 그걸 알리지 않는다 — 해금 화면은 11/T1 소유라 `notes/to-gn00py48-wallet.md` 로 알린다

## Unverified Assumptions

- 없음

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR. 실제 모드 확인은 학교 메일 인증(매직링크) 흐름이 서면.
