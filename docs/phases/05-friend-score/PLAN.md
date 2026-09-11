# Phase 05 — friend-score

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 04
- Start: TBD · End: TBD

## Goal

공유 링크로 들어온 친구의 사주로 궁합 점수와 등급이 산출되어 양쪽 페이지에 쌓인다.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 05-friend-score`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 FR-6, FR-7, FR-8, FR-14 를 구현하는 화면과 상태

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 04

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/05-friend-score/` · Owner: @nicerjs23

## Relevant Specifications

- `docs/PRD.md` — FR-6, FR-7, FR-8, FR-14
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. FR-6, FR-7, FR-8, FR-14 가 화면에서 관찰 가능하게 동작한다
- [ ] AC2. 새 화면·로직에 테스트가 있고 Commands가 경고 없이 통과한다

## Validation Plan

- 상세 계획 작성 시 채운다
