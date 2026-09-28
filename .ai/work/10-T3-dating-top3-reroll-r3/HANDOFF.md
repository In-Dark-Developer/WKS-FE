# Handoff — 10-T3-dating-top3-reroll-r3

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰)
- Date: 2026-09-27
- Phase / Task: 10/T3

## Goal

'다른 인연 만나보기'가 백엔드 리롤 API(§10.4.1)를 불러 카드 셋을 바꾸고, 무료·유료(5실) 판정이 서버 값(`rerollCost`)에서 오며, 연타·잔액 부족·후보 소진이 모두 막힌다.

## Work Completed

- openapi: `POST /dating/recommendations/reroll` · `DatingRecommendations.rerollCost` · `DatingRerollResult` · `DATING_NO_MORE_CANDIDATES`
- `api/dating.ts`: `rerollRecommendations` 를 실제 호출로. 목도 같은 규칙(하루 1회 무료 → 5실, 잔액 부족이면 402)
- 무료·유료 판정을 서버 `rerollCost` 로 바꿈 — '항상 무료' 가정과 비용 3(PRD 값) 을 걷어냈다
- 요청 중 재호출 차단(`isRerolling`) — 서버가 연타를 막지 않아 두 번 차감될 수 있었다
- 실패를 셋으로 갈라 안내: 잔액 부족(402)·후보 소진(409)·그 밖. 셋 다 카드는 그대로다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `docs/api/openapi.yaml` · `src/api/{dating,schema/dating,schema/envelope}.ts` (+테스트)
- `src/features/dating/recommendation/{recommendationsLoader,DatingCardsScreen}.tsx|ts` (+테스트)

## Decisions Made

- 비용·무료 여부를 화면이 계산하지 않는다 — 추천 응답 `rerollCost` 를 그대로 옮긴다(자정 초기화는 서버 KST 판정)
- 연타는 화면 상태로 막는다 — 확인 시트(`RerollSheet`)는 퍼블리싱 소유라 버튼 disabled 를 새로 넣지 않았다
- **PRD FR-27 의 '실 3' 은 확정값 5 와 다르다** — PRD 문구 수정은 spec 스트림 몫이라 이 PR 에 넣지 않았다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 106 files / 583 passed · typecheck·lint 경고 0 · redocly 새 문제 없음(기존 7건)

## Known Problems

- **PRD FR-27 이 '실 3' 이라고 적는다** — 백엔드 확정값은 5 다. spec 스트림으로 고쳐야 한다
- **학교 이메일 인증이 코드 6자리 방식으로 바뀌었다**(§10.7, 2026-09-26, 매직링크는 폐기 예정) — FR-25 프로필 폼에 인증 버튼·코드 입력이 붙어야 한다. 디자인 확인 뒤 Task 가 필요하다(Q20)
- 실제 모드 확인은 아직이다 — 추천·리롤이 학교 메일 인증을 마친 계정을 요구한다

## Unverified Assumptions

- 없음

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR. 다음은 FR-27 PRD 문구(spec)와 §10.7 이메일 코드 인증 Task 제안.
