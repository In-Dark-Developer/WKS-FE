# Handoff — 10-T3-dating-top3-reroll-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰)
- Date: 2026-09-26
- Phase / Task: 10/T3

## Goal

추천 카드의 잠긴 사진이 백엔드가 주는 `blurredPhotoUrl` 로 흐리게 보이고, 프로필 계약 사본이 백엔드 최신(dev 0c6c772 — 쿠키 전환·프로필 수정 제거)과 맞는다.

## Work Completed

- 추천 카드의 잠긴 사진이 `blurredPhotoUrl`(WKS-BE §10.4)로 흐리게 보인다 — 사진 없는 후보는 null 그대로
- openapi 사본을 백엔드 dev 0c6c772 와 맞췄다: `PATCH /dating/profile/me` 제거(405 주석으로 남김) · `METHOD_NOT_ALLOWED` 에러 코드 · `DatingCandidate.blurredPhotoUrl` · 쿠키 전환 완료를 머리 주석에 기록

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `docs/api/openapi.yaml` · `src/api/schema/dating.ts`
- `src/features/dating/recommendation/{recommendationsLoader,cardsView}.ts` (+테스트) · `src/app/routes/index.test.tsx`

## Decisions Made

- 확정된 백엔드 변경만 반영했다 — 리롤·실·해금 API 는 아직 없어 목 그대로 두고 건드리지 않았다
- 목 추천(`api/dating.ts`)에는 `blurredPhotoUrl` 을 넣지 않았다 — 없는 이미지 주소를 지어내지 않기 위해서다(목 모드는 잠금 표시만 보인다)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 100 files / 528 passed · typecheck·lint 경고 0 · redocly 새 문제 없음(기존 6건 그대로)

## Known Problems

- 실(`/api/wallet/**`)·리롤·정보 해금 API 는 여전히 BE 미구현 — 리롤은 목 전용 그대로다
- `GET /dating/recommendations` 는 학교 메일 인증 연동 전까지 `DATING_NOT_VERIFIED` 403 이라 실제 모드 확인은 아직이다
- 카카오 콜백 주소가 백엔드 화이트리스트에 등록됐는지 확인 전이다

## Unverified Assumptions

- 없음

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR. 실제 모드 확인은 학교 메일 인증 연동·콜백 주소 등록 뒤에.
