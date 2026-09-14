# Phase 05 — friend-score

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 04
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

공유 링크로 들어온 친구의 사주로 궁합 점수와 등급(귀인 ≥90 · 찰떡 75–89 · 벗 61–74 · 스침 ≤60)이 산출되어 양쪽 궁합 지도(구슬·등급별 인원·순위)와 결과 화면 하단 순위 요약에 쌓인다.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 05-friend-score`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 FR-6, FR-7, FR-8, FR-14, FR-15 를 구현하는 화면(SCR-06 공유 랜딩 · SCR-07 궁합 결과 · SCR-08 궁합 지도 · SCR-04 하단 순위 요약)과 상태

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 04
- SCR-06 공유 링크 랜딩 · SCR-07 궁합 결과 디자인 — 현재 없음 (PRD Q9). 없으면 착수하지 않는다
- `GET /shares/{shareId}`(링크 주인 공개 결과 — 전문이 오고 화면이 요약을 숨긴다) · `POST /shares/{shareId}/compatibility`(`guestResultId`) · `GET /results/{resultId}`의 `compatibilities` 계약 (2026-09-13 r2 반영) · 등급 4개 이름·구간 확정(귀인 90~ · 찰떡 75~89 · 벗 61~74 · 스침 ~60)
- SCR-06 공유 랜딩은 주인의 사주 요약을 보여주지 않는다 (2026-09-13 기획 피드백). 닉네임 노출 여부는 PRD Q12

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/05-friend-score/` · Owner: @nicerjs23

- [x] T2. 궁합 지도 퍼블리싱 — Done when: Figma 「UI 최종 - 개발용」 지도 「최종」(558:2570, v2 등급별 색 구슬)의 달·궤도·친구 구슬(귀인·찰떡·벗·스침)·등급별 인원 4칸·친구 궁합 순위·빈 상태가 props(내 닉네임·친구 목록 `{ nickname, score, tier }`)로만 렌더되고 `/preview` 에서 가짜 데이터로 확인된다 (테스트 포함). 구슬 배치 규칙이 미정이면(PRD Q11) 디자인 배치를 고정 좌표로 쓴다 · Touches: `src/features/friends/map/`, `src/features/friends/index.ts`, `src/ui/assets/orbs/`, `src/ui/assets/backgrounds/compatibility-map.svg`, `src/app/preview/screens/map.tsx` · Owner: @jjjung0921 (commit 5be8419 — 결과 화면 순위 요약은 `FriendRanking` 을 03/T7 이 `ranking` 슬롯에 넣는다)

- [x] T3. 궁합 지도 라우트와 결과 화면 '지도 보기' — Done when: `/me/map` 이 `routes.tsx` 에 등록돼 보관된 `resultId` 가 없으면 `/` 로 보내고(FR-18), 있으면 `GET /results/{resultId}` 의 `compatibilities` 를 친구 목록(상대 닉네임 = 내 닉네임이 아닌 쪽, 점수 높은 순)으로 바꿔 `CompatibilityMapScreen` 에 넘기며, 결과 화면 친구 궁합 순위 제목 줄의 '지도 보기 >'(Figma 798:3138)가 `/me/map` 으로 이동하고, `compatibilities` 응답 스키마가 백엔드 실제 모양(`score`·`tier`·`originNickname`·`guestNickname`)으로 파싱된다 (테스트 포함) · Touches: `src/app/routes.tsx`, `src/app/routes.test.tsx`, `src/api/schema/result.ts`, `src/api/schema/result.test.ts`, `src/features/saju/readingView.ts`, `src/features/saju/toReadingView.ts`, `src/features/saju/toReadingView.test.ts`, `src/features/friends/`, `src/app/preview/screens/map.tsx`, `src/api/results.ts`, `src/api/results.test.ts`, `src/app/requireSession.ts`, `src/features/saju/readingLoader.test.ts`, `src/features/share/link/ShareLinkButton.tsx`, `src/features/share/link/ShareLinkButton.test.tsx`, `src/app/preview/screens/reading.tsx` · After: 04/T8 · Owner: @jjjung0921 (commit ea218bd)

<!-- T3(2026-09-15): 소유자 결정으로 T1 상세 계획 전에 궁합 지도 라우트를 먼저 연다 — 결과 화면 순위에 '지도 보기'(Figma 798:3138)가 추가됐다. 공유 랜딩·궁합 산출(SCR-06·07)은 여전히 T1 이 채운다.
     퍼블리싱 먼저(2026-09-13): T2 는 Phase 04 완료·T1 상세 계획을 기다리지 않는다(props 만). 등급별 인원 계산·조회 연동은 T1 이 채울 Task 다. 03/T6 병합 뒤 시작한다. -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-06·07·08), FR-6, FR-7, FR-8, FR-14, FR-15
- Figma 「UI 최종 - 개발용」 — 지도 섹션(최종 v2: 등급별 색 구슬), 사주 결과 화면 Frame 51(친구 궁합 순위 빈 상태)
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. FR-6, FR-7, FR-8, FR-14, FR-15 가 화면에서 관찰 가능하게 동작한다
- [ ] AC2. 새 화면·로직에 테스트가 있고 Commands가 경고 없이 통과한다

## Validation Plan

- 상세 계획 작성 시 채운다
