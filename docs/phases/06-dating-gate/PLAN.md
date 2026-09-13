# Phase 06 — dating-gate

- Status: PLANNED
- Lead: @gn00py48
- Depends on: 03
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

결과 화면의 사전신청 티저에서 사전신청 모달이 열리고, 추가 정보 입력과 개인정보 동의를 마치면 완료 상태가 보이고 상대 정보 열람권을 얻는다. 동의 없이는 전송하지 않는다.

## Motivation

상세 계획은 선행 Phase가 끝난 뒤 계획 스트림(`scripts/ai-stream.sh open plan 06-dating-gate`)에서 작성한다. 지금은 Phase 그래프의 자리와 덮는 요구사항만 고정한다.

## Scope

- `docs/PRD.md`의 FR-9, FR-10, FR-17, NFR-4 를 구현하는 화면(SCR-09 사전신청 모달 5상태 · SCR-04 티저)과 상태. FR-11 쿠폰은 MVP 제외

## Out of Scope

- 다른 Phase가 덮는 요구사항

## Dependencies

- Phase 03 — 03/T1 `client.ts`, 03/T3 라우트 등록(`/reading/:id/pre-register` 조립), 03/T5 `teaser` 슬롯
- Phase 02 — T2(기본 입력), T3(Modal), T6(Select·TextArea·PhotoUpload)
- 동의 문구(수집 항목·목적·보관 기간 — PRD Q4)와 OptionalConsent 슬롯 표시 확정
- 사전신청의 정답(디자인 추가 정보 vs 백엔드 `/signups` 학교 웹메일 인증) 확정 (Q14) · 사진 형식·용량, 자기소개 최대 글자 수 (Q10)
- 디자인 확정: MBTI 입력 방식(수정본에 16개 드롭다운과 "이게 최선일까" 메모), 연락처 전화 필수·인스타 선택 반영

## Tasks

- [ ] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/06-dating-gate/` · Owner: @gn00py48

- [ ] T2. 사전신청 모달 화면 — Done when: 수정본(558-3526) 사전신청 모달의 기본·오류(이메일 형식)·로딩·연결 실패(입력값 유지 후 재시도)·완료 5상태가 렌더되고, 결과 화면 티저(`PreRegistrationTeaser`)가 `/reading/:id/pre-register` 하위 라우트의 모달을 열며, 동의 전에는 `POST /signups` 요청이 나가지 않는다 (테스트 포함). 연락처는 전화번호 필수 + 인스타그램 선택(디자인의 택1과 다름 — PRD FR-10), MBTI 입력 방식은 디자인 확정을 따른다 · Touches: `src/features/profile/`, `src/api/signups.ts`, `src/api/schema/signups.ts`, `docs/api/openapi.yaml#/paths/~1signups` · After: T1 · Owner: @jjjung0921

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
