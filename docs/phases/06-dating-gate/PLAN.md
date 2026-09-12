# Phase 06 — dating-gate

- Status: PLANNED
- Lead: @gn00py48
- Depends on: 03
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

결과 화면의 사전신청 티저에서 사전신청 모달이 열리고, 추가 정보 입력과 개인정보 동의를 마치면 완료 상태가 보인다. 동의 없이는 전송하지 않는다.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 06-dating-gate`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 FR-9, FR-10, FR-17, NFR-4 를 구현하는 화면(SCR-09 사전신청 모달 5상태 · SCR-04 티저)과 상태. FR-11 쿠폰은 MVP 제외

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 03 (Phase 02 T2의 TextArea·PhotoUpload·SegmentedControl 포함)
- 동의 문구(수집 항목·목적·보관 기간 — PRD Q4)와 OptionalConsent 슬롯 표시 확정
- 사진 형식·용량, 자기소개 최대 글자 수 (Q10) · `/me/profile` 계약

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/06-dating-gate/` · Owner: @gn00py48

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-09), FR-9, FR-10, FR-17, NFR-4
- Figma 「UI 최종 - 개발용」 — 수정본 사전신청 모달 5종 · MBTI 드롭다운(Frame 83·85)
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. FR-9, FR-10, FR-17, NFR-4 가 화면에서 관찰 가능하게 동작한다 — 동의 없이 제출하면 네트워크 요청이 없다
- [ ] AC2. 새 화면·로직에 테스트가 있고 Commands가 경고 없이 통과한다

## Validation Plan

- 상세 계획 작성 시 채운다
