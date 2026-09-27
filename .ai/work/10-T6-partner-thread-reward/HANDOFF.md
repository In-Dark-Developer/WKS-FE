# Handoff — 10-T6-partner-thread-reward

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead · `src/features/auth/` — `ref` 전달이 남아 있다)
- Date: 2026-09-27
- Phase / Task: 10/T6

## Goal

협업 링크로 들어와 로그인한 사용자에게 '운명의 실이 지급되었어요' 모달이 지급량·보유 수와 함께 뜨고, `rewardGranted` 가 null 이면 뜨지 않으며, 잔액이 새로고침 없이 맞는다.

## Work Completed

- `src/api/rewards.ts` — 로그인 응답의 `rewardGranted` 를 한 번만 꺼내 쓰는 보관소(sessionStorage). `api/auth.ts:loginWithKakao` 가 응답에서 남긴다
- `reward/RewardGrantedDialog.tsx` — SCR-23 1.2 모달. 받은 개수·보유 수·제휴처 이름, 공용 `DatingDialog` 재사용
- `reward/PendingRewardDialog.tsx` — 대기 중인 지급을 꺼내 `GET /wallet` 으로 보유 수를 읽고 한 번만 띄운다
- `dating.routes.tsx` — 소개팅 라우트 전체를 감싸는 레이아웃에 한 번 걸어 둬 어느 소개팅 화면에 도착하든 뜬다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/api/{rewards,auth}.ts` (+테스트) · `src/features/dating/reward/*`(신규, +테스트) · `index.ts` · `src/app/routes/dating.routes.tsx`

## Decisions Made

- 지급 정보는 sessionStorage 에 한 번만 담는다 — 로그인 왕복이 전체 페이지 이동이라 메모리로는 못 넘기고, 꺼내는 즉시 지워 새로고침에 다시 뜨지 않게 했다
- 모달을 소개팅 라우트 레이아웃에 한 번 건다 — 로그인 복귀 지점이 `/dating`·`/dating/profile` 로 갈릴 수 있어 화면마다 붙이지 않았다
- 보유 수는 원장(`GET /wallet`)에서 읽는다. 못 읽으면 받은 개수만 보이고 모달은 그대로 뜬다 — 지급 사실을 알리는 게 먼저다
- SCR-23 에 퍼블리싱 Task 가 없어 공용 `DatingDialog`·`ThreadCount`·`Button` 으로 그렸다. 새 표현 컴포넌트는 만들지 않았다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 109 files / 602 passed · typecheck·lint 경고 0

## Known Problems

- **`ref` 를 로그인 요청에 싣는 부분이 없다** — `features/auth/kakaoLogin.ts` 가 `ref: null` 로 고정돼 있고 그 파일은 09/T2(이정진) 소유다. 협업 링크의 코드를 읽어 넘겨 주면 이 PR 의 받는 쪽이 그대로 동작한다. 백엔드도 제휴 지급은 미구현이라 `rewardGranted` 는 당분간 항상 null 이다
- 모달의 '나중에 사용할래요 → 서비스 메인' 갈래(FR-32 · Figma 1.3)는 넣지 않았다 — Task 의 Done when 은 지급 알림까지이고, 로그인 전 배너 진입 화면은 아직 없다
- SCR-23 문구·그림은 Figma 를 그대로 옮기지 못했다(디자인 확인 필요) — 지급량·보유 수는 명세대로다

## Unverified Assumptions

- 없음

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR. 09/T2 가 `ref` 를 넘기면 실제 모드로 확인한다.
