# Phase 07 — matching-thread

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 06
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

소개팅 후보를 점지 카드로 열람하고 운명의 실을 주고받아 성립 시 연락처가 공개된다.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 07-matching-thread`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 FR-12, FR-13, NFR-4 를 구현하는 화면과 상태

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 06
- SCR-10 소개팅 후보 · SCR-11 운명의 실 디자인 — 현재 없음 (PRD Q9). 없으면 착수하지 않는다
- 후보 선정 기준(Q5) · `/matching/candidates` · `/me/threads` · `/me/threads/{id}/pull` 계약

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/07-matching-thread/` · Owner: @nicerjs23

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-10·11), FR-12, FR-13, NFR-4
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. FR-12, FR-13, NFR-4 가 화면에서 관찰 가능하게 동작한다
- [ ] AC2. 새 화면·로직에 테스트가 있고 Commands가 경고 없이 통과한다

## Validation Plan

- 상세 계획 작성 시 채운다
