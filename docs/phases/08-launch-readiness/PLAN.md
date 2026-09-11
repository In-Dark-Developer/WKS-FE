# Phase 08 — launch-readiness

- Status: PLANNED
- Lead: TBD
- Depends on: 05, 07
- Start: TBD · End: TBD

## Goal

축제 현장에서 쓸 수 있도록 배포·성능·접근성·분석이 갖춰진 상태.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 08-launch-readiness`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 NFR-1, NFR-2, NFR-5, NFR-6 를 구현하는 화면과 상태

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 05, 07

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/08-launch-readiness/` · Owner: 미정

## Relevant Specifications

- `docs/PRD.md` — NFR-1, NFR-2, NFR-5, NFR-6
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. NFR-1, NFR-2, NFR-5, NFR-6 가 화면에서 관찰 가능하게 동작한다
- [ ] AC2. 새 화면·로직에 테스트가 있고 Commands가 경고 없이 통과한다

## Validation Plan

- 상세 계획 작성 시 채운다
