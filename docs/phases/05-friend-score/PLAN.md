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
- `/shares/{shareId}` · `/shares/{shareId}/compatibility` · `/me/friends` 계약 확정
- SCR-06 공유 랜딩은 주인의 사주 요약을 보여주지 않는다 (2026-09-13 기획 피드백). 닉네임 노출 여부는 PRD Q12

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/05-friend-score/` · Owner: @nicerjs23

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
