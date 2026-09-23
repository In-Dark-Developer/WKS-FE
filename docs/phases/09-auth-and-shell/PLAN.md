# Phase 09 — auth-and-shell

- Status: PLANNED
- Lead: @jjjung0921
- Depends on: 03
- Start: 2026-09-24 · End: <YYYY-MM-DD>

## Goal

로그인한 사용자가 어느 기기에서나 자기 궁합지도를 열고, 하단 네비게이션으로 홈·궁합지도·소개팅을 오간다.

## Motivation

V1 기획 개정(2026-09-22)이 사주 결과를 홈으로 삼고 세 영역을 하단 네비로 잇는다. 지금은 브라우저
`localStorage` 가 유일한 저장소라 기기를 바꾸거나 데이터를 지우면 궁합지도를 잃는다(US-7). 카카오 로그인과
계정 저장·복원이 그 구멍을 막고, 동시에 Phase 10·11 의 소개팅이 설 기반이 된다 — V1 의 거의 모든 요구가
`FR-20` 뒤에 줄을 선다.

## Scope

- 하단 네비게이션과 홈 분기 (FR-19)
- 카카오 로그인, JWT 쿠키 세션, 인앱 브라우저 동작 (FR-20 · NFR-7 · NFR-8)
- 로그인 시 계정 기록 우선 복원과 비로그인 기록 보존 (FR-21)
- 친구 궁합 이유 상세 화면 (FR-22)
- 공유 링크 진입의 '이전 정보 불러오기 / 새로 작성하기' 분기 (FR-23)

## Out of Scope

- 소개팅 화면 일체 — Phase 10·11 이 맡는다. 이 Phase 는 소개팅 탭을 네비에 노출하되 인트로까지만 연결한다.
- 재화 '실' (FR-31) — Phase 10/T2.
- 카카오 동의항목 수집 — 회원번호만 식별자로 쓴다(FR-20).
- 백엔드 구현 — `docs/api/openapi.yaml` 의 로그인·복원 계약이 먼저 확정되어야 한다(Dependencies).

## Dependencies

- Phase 03 (saju-reading) — 사주 결과·궁합지도가 이미 동작한다.
- 백엔드: 카카오 로그인 콜백, 계정-결과 연결, 궁합 이유 생성 API 계약. 2026-09-22 BE 회의록 기준이며
  `docs/api/openapi.yaml` 갱신이 T2 착수의 전제다.
- 운영·개발 서버 분리(NFR-10)와 Redirect URI 발급 — 백엔드 담당.

## Tasks

- [x] T1. 하단 네비게이션과 홈 분기 — Done when: 홈·궁합지도·소개팅 세 탭이 viewport 하단에 고정되고, 홈 탭이 사주 데이터 유무로 결과 또는 입력으로 분기하며, 공유 Flow(`/s/**`) 에서는 네비가 보이지 않고 '내 사주 내용도 확인하기' 이후에만 보인다 · Touches: `src/app/`, `src/ui/`, `docs/prd/30-functional-requirements.md` · Owner: 이정진 (commit 54d23a0)

- [ ] T2. 카카오 로그인과 쿠키 세션 — Done when: 카카오 로그인으로 JWT 쿠키(만료 15일)가 발급되고 새로고침·재방문에 세션이 유지되며, 카카오톡·인스타그램 인앱 브라우저에서도 로그인이 완주되고, 사주 보기·공유·친구 궁합은 비로그인으로 끝까지 동작한다 · Touches: `src/features/auth/`, `src/api/`, `docs/api/openapi.yaml` · Owner: 곽도윤

- [ ] T3. 궁합지도 계정 저장·복원 — Done when: 로그인 시 계정 기록이 우선 복원되고, 계정이 비어 있을 때만 현재 브라우저 결과를 계정에 연결하며, 로그인을 시작한 화면으로 복귀하고, 취소·실패해도 현재 지도와 비로그인 기록이 남는다 · Touches: `src/features/auth/`, `src/features/friends/`, `src/app/routes/` · After: T2 · Owner: 이정진

- [ ] T4. 친구 궁합 이유 상세 — Done when: 친구 궁합 Row 를 누르면 세 문단('왜 나에게 귀인일까요?' · '둘이 만나게 된다면?' · '둘이 싸우게 된다면?')이 보이고, 최초 열람에만 생성이 일어나며 그 동안 로딩 상태를 보여주고, 두 번째 열람은 저장값을 즉시 그린다 · Touches: `src/features/friends/map/`, `src/app/routes/map.routes.tsx` · Owner: 이정진

- [ ] T5. 공유 진입 분기 — Done when: 공유 링크로 들어온 사용자에게 브라우저에 쓸 수 있는 사주가 있으면 '이전 정보 불러오기'와 '새로 작성하기'를 고르게 하고, 이전 정보를 고르면 재입력 없이 궁합이 만들어지며, 새로 작성해도 기존 데이터가 지워지지 않는다 · Touches: `src/features/share/`, `src/features/friends/`, `src/app/routes/share.routes.tsx` · Owner: 강근우

## Relevant Specifications

- `docs/prd/` — FR-19, FR-20, FR-21, FR-22, FR-23, NFR-7, NFR-8
- `docs/prd/20-screens.md` — SCR-15, SCR-21, SCR-22
- `docs/api/openapi.yaml` — 로그인 콜백 · 계정-결과 연결 · 궁합 이유
- Figma `imSnlOGTqwtPhGyzhA8yc9`(v1.0) — `nav`, `3.1 궁합 지도 - 로그인 x`, `3.1.1 로그인`, `3.1 궁합 지도 - 로그인 o`, `3.2 친구 궁합 리스트 이유`, `4.2 기존 티저 (링크 진입 화면)`, `4.2 새로 작성하기 버튼 누를 시`

## Acceptance Criteria

- [ ] AC1. 기기 A 에서 궁합 3건을 만들고 로그인한 뒤, 기기 B 에서 로그인하면 같은 지도가 보인다 (SC-7)
- [ ] AC2. 비로그인 상태로 사주 입력 → 결과 → 공유 → 친구 궁합까지 막히는 화면 없이 끝난다
- [ ] AC3. 카카오톡·인스타그램 인앱 브라우저에서 로그인 후 궁합지도 저장까지 완주한다 (NFR-8)
- [ ] AC4. 하단 네비가 세 영역을 잇고, 공유 Flow 진행 중에는 보이지 않는다
- [ ] AC5. 같은 친구의 궁합 이유를 두 번 열면 두 번째에는 생성 요청이 0건이다 (NFR-9 의 화면 쪽 조건)

## Validation Plan

- 자동: 라우팅 가드·네비 노출 조건은 `src/app/routes/*.test.tsx` 가 덮는다(AC4). 세션 복원 분기(계정 비어 있음 / 기록 있음 / 취소)는 `src/features/auth/*.test.ts` 로 세 갈래를 모두 덮는다(AC1).
- 수동: 실기기 iOS Safari · Android Chrome 각 1대에서 AC2·AC3 을 끝까지 수행한다. 인앱은 카카오톡 대화방과 인스타그램 DM 에 링크를 붙여 넣어 연다.
- 관측: AC5 는 궁합 이유를 두 번 열며 네트워크 탭에서 생성 요청 수를 센다.
