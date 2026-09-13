# Phase 04 — share-and-card

- Status: PLANNED
- Lead: @gn00py48
- Depends on: 03
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

결과를 공유 링크('친구에게 공유')와 인연카드 이미지('인스타 스토리 공유하기', 카드 뒤집기)로 내보내 인스타·메신저에 퍼뜨릴 수 있고, Web Share 미지원 시 저장·복사 폴백이 있다.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 04-share-and-card`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 FR-4, FR-5, FR-16, NFR-3 를 구현하는 화면(SCR-05 인연카드 앞면·뒷면·십이간지 12종)과 상태

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 03
- 공유 시트·Toast 디자인(현재 없음 — 디자인시스템 ShareSheet·Toast 컴포넌트 기준으로 진행)
- 공유 링크 OG 메타·썸네일을 백엔드가 제공하는가 (Notion 결정 안건 → ADR)
- 인연카드 앞면은 수치(0–100 바)가 아니라 문자 등급(B0~SS) — 디자인 갱신 필요 (2026-09-13 기획 피드백, PRD FR-5·Q7)

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/04-share-and-card/` · Owner: @gn00py48

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-05), FR-4, FR-5, FR-16, NFR-3
- Figma 「UI 최종 - 개발용」 — 점지 카드 · 십이간지 카드 섹션
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. FR-4, FR-5, FR-16, NFR-3 가 화면에서 관찰 가능하게 동작한다
- [ ] AC2. 새 화면·로직에 테스트가 있고 Commands가 경고 없이 통과한다

## Validation Plan

- 상세 계획 작성 시 채운다
