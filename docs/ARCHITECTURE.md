# Architecture — 운꿰사 (WKS) 프론트엔드

- Last updated: 2026-09-11
- Related ADRs: ADR-20260911-frontend-stack-and-repo-scope

## System Overview

브라우저에서 도는 단일 페이지 앱(SPA)이다. Vite로 빌드한 정적 자산을 호스팅하고, 모든 데이터·사주 계산·문구 생성은 별도 저장소의 백엔드 REST API가 담당한다.
프론트엔드가 소유하는 것은 화면·입력 검증·공유 흐름·클라이언트 상태뿐이며, 점수 산출 규칙 같은 도메인 로직은 화면에 두지 않는다.

```text
[브라우저]
  운꿰사 SPA (React + Vite)
    app/ 라우팅 ── features/ 화면 기능 ── ui/ 디자인 시스템
                        │
                        └── api/ REST 클라이언트 (zod 경계 검증)
                                   │ HTTPS/JSON
                          [백엔드 API — 별도 저장소]
                            만세력 계산 · 궁합 점수 · 매칭 · 인증 · 저장
```

## Major Components

| Component | Responsibility                                                        | Location        |
|-----------|-----------------------------------------------------------------------|-----------------|
| app       | 라우팅, 전역 프로바이더, 레이아웃, 에러 경계                          | `src/app/`      |
| features  | 화면 단위 기능 (intro · saju · share · friends · profile · matching)   | `src/features/` |
| ui        | 디자인 시스템 — 토큰, 버튼·인풋·모달 등 표현 전용 컴포넌트            | `src/ui/`       |
| api       | 백엔드 REST 호출과 응답 스키마 검증                                   | `src/api/`      |
| lib       | 도메인 비의존 유틸 (날짜 포맷, 이미지 생성, 클립보드 등)              | `src/lib/`      |

## Module Boundaries

| Module   | Owns (책임)                                  | Location        | Owner | Allowed access (허용 인터페이스)            |
|----------|----------------------------------------------|-----------------|-------|---------------------------------------------|
| app      | 라우트 정의 · 전역 프로바이더 · 레이아웃      | `src/app/`      | @jjjung0921 | 라우트 경로 상수                            |
| features | 화면 흐름 · 폼 상태 · 기능별 조합            | `src/features/` | @nicerjs23 | 기능별 진입 컴포넌트 (`index.ts`)만          |
| ui       | 디자인 토큰 · 표현 전용 컴포넌트             | `src/ui/`       | @gn00py48 | 공개 컴포넌트와 토큰                        |
| api      | 엔드포인트 호출 · 요청/응답 스키마            | `src/api/`      | @nicerjs23 | 함수 단위 API와 추론된 타입                 |
| lib      | 순수 유틸                                    | `src/lib/`      | @gn00py48 | 개별 함수                                   |
| docs     | spec · ADR · Phase                           | `docs/`         | @jjjung0921 | PR 리뷰                                     |

- Owner는 그 모듈 PR의 리뷰 책임자다(`.github/CODEOWNERS`는 이 표에서 `scripts/ai-stream.sh codeowners`가 만든다). 파일을 지금 누가 쓰는지는 Owner가 아니라 그 Task 스트림의 `Touches:`가 정한다 — 남의 모듈 파일이라도 내 Touches 안이면 내가 쓰고, 리뷰를 그 모듈 Owner가 한다.
- `features`는 다른 `features`를 직접 import 하지 않는다. 공유가 필요하면 `ui`·`lib`·`api`로 내리거나 `app`이 조립한다.
- `ui`는 백엔드 응답 타입을 모른다 — props로만 받는다. 도메인 규칙(등급 구간, 점수 계산)은 `ui`에 두지 않는다.

## Dependency Direction

`app → features → { ui, api, lib }`, `ui → lib`, `api → lib`.
금지: 역방향 import(`ui → features` 등), `features ↔ features` 순환, `ui → api`.

## Data Flow

1. 사주 보기 — 입력 폼(`features/saju`) → `api`가 요청 스키마로 검증해 POST → 응답을 zod로 파싱 → 결과 화면이 다섯 영역(연애·재물·학업·축제 아이템·운)을 렌더 → 공유 링크 id와 점지 카드 데이터를 `features/share`에 넘긴다.
2. 친구 궁합 — 공유 링크(`/s/:shareId`)로 진입 → 링크 주인의 요약을 조회 → 방문자가 자기 사주를 입력 → 궁합 점수 응답(점수 + 등급)을 받아 표시하고, 양쪽의 친구 점수 목록에 반영된다.
3. 운명의 실 — 추가 정보 등록·동의 후 소개팅 섹터 해제 → 후보 카드 열람 → '보내기' 호출 → 상대가 '당기기'를 하면 성립 응답에 연락처가 포함되어 화면에 공개된다.

## State Management

- 서버 상태(사주 결과, 친구 점수, 후보, 실 상태)는 백엔드가 소유하고 화면은 조회 결과를 캐시해 쓴다. 캐시/요청 라이브러리는 TBD (Phase 03에서 ADR).
- 폼·모달·블러 해제 여부 같은 화면 상태는 해당 feature 안의 지역 상태로 둔다. 전역 스토어는 도입하지 않는다.
- 세션 식별자의 보관 위치(쿠키 vs 스토리지)는 백엔드 인증 방식에 따르므로 TBD (Phase 03에서 ADR).

## Persistence

브라우저에 저장하는 것은 세션 식별자와 인트로 시청 여부뿐이다. 사용자 데이터·사주 결과·매칭 상태는 모두 백엔드가 저장하며 이 저장소에는 스키마·마이그레이션이 없다.

## External Systems

| System           | Purpose                          | Interface              | Failure Handling                                       |
|------------------|----------------------------------|------------------------|--------------------------------------------------------|
| 백엔드 API       | 사주·궁합·매칭·인증·저장          | REST/JSON (`docs/api/`) | 타임아웃 후 재시도 1회, 실패 시 보살 말투 에러 화면    |
| 인스타그램 공유  | 점지 카드 공유                    | Web Share API          | 미지원 브라우저는 이미지 다운로드 + 안내로 폴백        |
| 정적 호스팅      | SPA 배포와 공유 링크 라우팅       | TBD (Phase 08)         | TBD                                                    |

## Important Interfaces

- REST API: `docs/api/openapi.yaml` — 이 저장소의 사본은 **참조본**이다. 계약의 source of truth는 백엔드 저장소이며, 차이를 발견하면 백엔드 저장소에 이슈로 올리고 이 파일을 맞춘다.
- 디자인: Figma (PRD Constraints의 링크). 토큰·컴포넌트 명세는 Phase 02에서 `src/ui/`로 코드화한다.

## Cross-cutting Concerns

- 인증/인가: 백엔드가 발급한 세션을 그대로 사용한다. 프론트엔드는 보호된 화면 접근 시 리다이렉트만 담당한다.
- 설정: `VITE_` 접두 환경변수(`VITE_API_BASE_URL` 등)로만 주입한다. 비밀값은 프론트엔드에 두지 않는다.
- 에러 처리: 응답 스키마 검증 실패와 네트워크 실패를 구분해 사용자에게는 같은 안내 화면을, 콘솔에는 원인을 남긴다.
- 관측성: 로깅·분석 도구는 TBD (Phase 08).
