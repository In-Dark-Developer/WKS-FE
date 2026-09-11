# Phase 02 — design-system

- Status: PLANNED
- Lead: TBD
- Depends on: 01
- Start: TBD · End: TBD

## Goal

Figma의 디자인 토큰과 공통 컴포넌트가 `src/ui/`에 코드로 존재해, 이후 화면 Phase들이 색·타이포·간격을 직접 쓰지 않고 조립만 하면 되는 상태.

## Motivation

화면 Phase(03~07)를 여러 사람이 병렬로 만들면 같은 버튼이 여러 번 다르게 태어난다. 공통 표현 계층을 먼저 고정해야 병렬 작업이 합쳐진다. NFR-1(모바일 우선)·NFR-5(접근성)의 기준도 여기서 한 번만 잡는다.

## Scope

- Figma에서 토큰 추출: 색·타이포·간격·라운드·그림자 → Tailwind 테마 설정
- 공통 컴포넌트: 버튼, 텍스트 인풋, 셀렉트, 체크박스, 모달, 카드, 로딩·에러 상태
- 앱 셸: 모바일 폭 기준 레이아웃, 안전 영역, 전역 배경
- 컴포넌트별 렌더 테스트와 접근성 기본(라벨·포커스 링) 확인

## Out of Scope

- 기능 화면(사주 입력·결과·매칭) — Phase 03 이후
- 점지 카드 이미지 생성 — Phase 04
- 애니메이션·인트로 영상 재생 — Phase 03에서 인트로와 함께

## Dependencies

- Phase 01 (T3 제약 층, T4 스켈레톤)
- Figma 디자인 시스템 확정 (담당: 디자인)

## Tasks

- [ ] T1. Figma 토큰 → Tailwind 테마·CSS 변수 — Done when: 색·타이포·간격 토큰이 한 곳에 정의되고 임의 색상 사용을 린트가 막는다 · Touches: `src/ui/tokens/`, `src/index.css` · Owner: 미정

- [ ] T2. 폼 컴포넌트 (인풋·셀렉트·체크박스·버튼) — Done when: 각 컴포넌트가 라벨·에러·비활성 상태를 지원하고 렌더 테스트가 통과 · Touches: `src/ui/` · Owner: 미정

- [ ] T3. 모달·카드·상태 컴포넌트 (로딩·에러·빈 상태) — Done when: 모달이 포커스 트랩·ESC 닫기를 지원하고 테스트가 통과 · Touches: `src/ui/` · Owner: 미정

- [ ] T4. 앱 셸 레이아웃 — Done when: 360–430px에서 가로 스크롤 없이 렌더되고 데스크톱에서 중앙 정렬된다 · Touches: `src/app/`, `src/ui/` · Owner: 미정

## Relevant Specifications

- `docs/PRD.md` — NFR-1, NFR-5, NFR-6
- `docs/ARCHITECTURE.md` — Module Boundaries(ui), Dependency Direction
- Figma (PRD Constraints)

## Acceptance Criteria

- [ ] AC1. 화면 코드가 색·폰트·간격을 토큰으로만 참조한다
- [ ] AC2. 공통 컴포넌트가 모두 렌더 테스트를 갖는다
- [ ] AC3. 모달과 폼을 키보드만으로 조작할 수 있고 모든 입력에 라벨이 있다
- [ ] AC4. `src/ui/`가 `src/api/`·`src/features/`를 import 하지 않는다

## Validation Plan

- AC1·AC4: 린트 규칙(import 경계, 임의 색상 금지)과 `pnpm lint`
- AC2: `pnpm test`
- AC3: 키보드 조작 수동 확인 + 라벨 단위 테스트
