# Handoff — 10-T3-dating-top3-reroll

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (Phase 10 Lead · 퍼블리싱 10/T4 소유자 — PR 리뷰)
- Date: 2026-09-25
- Phase / Task: 10/T3

## Goal

`/dating/cards` 가 `GET /dating/recommendations` 로 오늘의 인연 Top 3 를 그리고, 잠긴 항목은 값 대신 비용을 보이며, '다른 인연 만나보기'가 무료·유료·잔액 부족을 가른다.

## Work Completed

- openapi.yaml: `GET /dating/recommendations` · `DatingCandidate`·`DatingLockableField` (WKS-BE §10.4)
- `api/dating.ts`: `getRecommendations` + 목 후보 3명, `rerollRecommendations`(목 전용 — BE 경로 없음)
- `recommendation/`: 응답 → `DatingCardsView` 변환(잠금은 값 없이 비용만) · 잔액은 `GET /me` · 리롤 실패 시 추천 유지 + 토스트 · 403 안내 화면
- `/dating/cards` 라우트가 Placeholder 대신 카드 화면을 그린다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `docs/api/openapi.yaml` · `src/api/{dating,schema/dating}.ts`
- `src/features/dating/recommendation/*`(+테스트 2개)·`index.ts` · `src/app/routes/dating.routes.tsx`·`index.test.tsx`

## Decisions Made

- 잔액은 `GET /me` 의 `threadBalance` 를 그대로 보인다 — 원장·획득·소모는 10/T2 몫이라 화면이 계산하지 않는다(FR-31)
- 무료 리롤 여부를 알려주는 응답이 없어 지금은 항상 '무료 1회 남음'으로 둔다 — 리롤 API 가 서면 그 값으로 바꾼다
- 잔액 부족은 확인 시트가 이미 버튼을 막는다 — 화면에 같은 판정을 또 두지 않았다
- 해금·운명의 실·요청함 버튼은 갈 화면이 없어 눌러도 아무 일도 하지 않는다(Phase 11)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 100 files / 527 passed · typecheck·lint 경고 0 · redocly 새 문제 없음(기존 오류 1·경고 5)
- 목 모드 브라우저 확인은 아직 안 했다

## Known Problems

- PLAN 의 `After: T1, T2, T4` 중 T2(재화 '실')가 아직 없다 — 잔액은 `GET /me` 의 `threadBalance` 를 그대로 보이고, 획득·소모 원장은 10/T2 가 맡는다
- 리롤 API 가 BE 에 없다(api-spec.md §10 '#84 구현 상태') — 무료 1회·실 3 차감은 목 전용이고 실제 모드에서는 버튼이 막힌다
- `GET /dating/recommendations` 는 학교 메일 인증 연동 전까지 `DATING_NOT_VERIFIED` 403
- 잠긴 사진 썸네일 API 가 없어 `thumbnailUrl` 은 항상 null
- 10/T1-r2(#210)는 병합됐고 이 브랜치에 `git merge dev` 로 반영했다

## Unverified Assumptions

- 해금한 항목이 `{ locked: false, value }` 로 온다 — 해금 API 가 없어 확인 전이다
- 추천 응답의 `rank` 가 1~3 만 온다 (스키마가 그 범위를 강제한다)

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR. 다음은 10/T2(재화 '실') — BE `/wallet` 이 서야 실제 모드가 된다.
