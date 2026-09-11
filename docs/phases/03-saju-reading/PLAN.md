# Phase 03 — saju-reading

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 02
- Start: TBD · End: TBD

## Goal

인트로에서 시작해 사주를 입력하면 연애·재물·학업·축제 아이템·운 다섯 영역의 결과 화면이 뜨고, 그 결과가 백엔드 응답에서 온다.

## Motivation

제품의 첫 관문이자 이후 모든 기능(공유·궁합·소개팅)이 딛고 서는 데이터다. 백엔드 호출 계층과 경계 검증 방식도 이 Phase에서 한 번 정해두면 나머지 Phase가 따라 쓴다.

## Scope

- 인트로 화면 (영상 + 문구 + 시작 버튼, 1회 노출)
- 사주 입력 폼: 생년월일·태어난 시간·지역·성별·닉네임, 시간·지역 '모름' 처리
- 결과 화면: 다섯 영역 렌더, 보살 말투 문구 표시
- `src/api/` 클라이언트: 요청/응답 zod 스키마, 에러·타임아웃 처리, 서버 상태 캐시 방식 결정(ADR)
- 백엔드 준비 전 개발을 위한 목(mock) 응답 경로

## Out of Scope

- 공유 링크·점지 카드 (Phase 04)
- 궁합 점수 (Phase 05)
- 로그인/세션 UI — 백엔드 인증 방식 확정 전까지 최소로만

## Dependencies

- Phase 02
- 백엔드의 `POST /readings` 계약 (`docs/api/openapi.yaml`)

## Tasks

- [ ] T1. API 클라이언트 계층 + 경계 검증 — Done when: 요청/응답이 zod로 검증되고 실패가 타입으로 구분되며 테스트가 통과 · Touches: `src/api/client.ts`, `src/api/readings.ts`, `src/api/schema/`, `docs/api/openapi.yaml#/paths/~1readings` · Owner: @nicerjs23

- [ ] T2. 서버 상태 캐시·세션 보관 방식 ADR — Done when: ADR이 병합되고 `docs/ARCHITECTURE.md` State Management의 TBD가 사라진다 · Touches: `docs/decisions/`, `docs/ARCHITECTURE.md` · Owner: @jjjung0921

- [ ] T3. 인트로 화면 + 라우트 등록 — Done when: 영상·문구·버튼이 뜨고 두 번째 방문에는 건너뛰며, `src/app/routes.tsx`에 이 Phase의 라우트가 모여 있다 · Touches: `src/features/intro/`, `src/app/routes.tsx` · Owner: @jjjung0921

- [ ] T4. 사주 입력 폼 — Done when: 필수 검증·'모름' 처리가 동작하고 잘못된 입력에 에러 메시지가 뜬다 (테스트 포함) · Touches: `src/features/saju/SajuForm.tsx`, `src/features/saju/formSchema.ts` · Owner: @gn00py48

- [ ] T5. 결과 화면 — Done when: 다섯 영역이 응답대로 렌더되고 로딩·에러 상태가 있다 · Touches: `src/features/saju/ReadingResult.tsx`, `src/features/saju/sections/` · Owner: @nicerjs23

<!-- T1은 T4·T5보다 먼저 병합한다(호출 계약이 먼저 있어야 한다). T3·T4·T5는 서로 겹치지 않는다.
     라우트 파일은 충돌 지점이라 T3이 단독으로 소유한다 — 다른 Task는 자기 화면 컴포넌트만 export 하고 등록은 T3이 한다. -->

## Relevant Specifications

- `docs/PRD.md` — FR-1, FR-2, FR-3, NFR-2, NFR-4
- `docs/ARCHITECTURE.md` — Data Flow 1, State Management, Cross-cutting Concerns
- `docs/api/openapi.yaml` — `/readings`

## Acceptance Criteria

- [ ] AC1. 인트로 → 입력 → 결과를 이탈 없이 완주할 수 있다
- [ ] AC2. 태어난 시간·지역을 비워도 결과를 받을 수 있다
- [ ] AC3. 백엔드 응답이 스키마와 다르면 화면이 깨지지 않고 에러 안내가 뜬다
- [ ] AC4. 입력 폼과 결과 화면에 단위·컴포넌트 테스트가 있다
- [ ] AC5. `src/app/routes.tsx`를 T3 외의 Task가 수정하지 않았다

## Validation Plan

- AC1·AC2: 목 응답으로 흐름 수동 확인 + 폼 테스트
- AC3: 스키마 위반 응답을 주입한 테스트
- AC4: `pnpm test`
