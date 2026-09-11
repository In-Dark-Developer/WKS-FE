# Phase 06 — dating-gate

- Status: PLANNED
- Lead: TBD
- Depends on: 03
- Start: TBD · End: TBD

## Goal

블러 처리된 소개팅 섹터가 추가 정보 입력과 동의를 거쳐 열리고, 알림 신청과 쿠폰 안내가 동작한다.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 06-dating-gate`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 FR-9, FR-10, FR-11, NFR-4 를 구현하는 화면과 상태

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 03

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/06-dating-gate/` · Owner: 미정

## Relevant Specifications

- `docs/PRD.md` — FR-9, FR-10, FR-11, NFR-4
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. FR-9, FR-10, FR-11, NFR-4 가 화면에서 관찰 가능하게 동작한다
- [ ] AC2. 새 화면·로직에 테스트가 있고 Commands가 경고 없이 통과한다

## Validation Plan

- 상세 계획 작성 시 채운다
