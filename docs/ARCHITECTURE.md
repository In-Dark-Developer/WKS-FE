# Architecture — 운꿰사 (WKS) 프론트엔드

- Last updated: 2026-09-13
- Related ADRs: ADR-20260911-frontend-stack-and-repo-scope, ADR-20260913-server-state-and-session-storage

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
| features  | 화면 단위 기능 (saju · share · friends · profile · matching)           | `src/features/` |
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
| docs/api | 백엔드 계약 참조본                            | `docs/api/`     | @hairyung2002 | PR 리뷰 (계약의 source of truth는 백엔드 저장소) |

- Owner는 그 모듈 PR의 리뷰 책임자다(`.github/CODEOWNERS`는 이 표에서 `scripts/ai-stream.sh codeowners`가 만든다). 파일을 지금 누가 쓰는지는 Owner가 아니라 그 Task 스트림의 `Touches:`가 정한다 — 남의 모듈 파일이라도 내 Touches 안이면 내가 쓰고, 리뷰를 그 모듈 Owner가 한다.
- `features`는 다른 `features`를 직접 import 하지 않는다. 공유가 필요하면 `ui`·`lib`·`api`로 내리거나 `app`이 조립한다.
- `ui`는 백엔드 응답 타입을 모른다 — props로만 받는다. 도메인 규칙(등급 구간, 점수 계산)은 `ui`에 두지 않는다.

## Dependency Direction

`app → features → { ui, api, lib }`, `ui → lib`, `api → lib`.
금지: 역방향 import(`ui → features` 등), `features ↔ features` 순환, `ui → api`.

## Data Flow

1. 사주 보기 — 입력 폼(`features/saju`) → `api`가 요청 스키마로 검증해 POST → 응답 봉투(`{success,data|error}`)를 zod로 파싱 → 응답과 함께 백엔드가 발급한 세션 토큰을 `api`가 보관(발급·전달 방식은 PRD Q16) → 결과 화면이 운명 카드(운명 제목·설명, 결혼운·자녀운·연애운 등급, 행운의 장소·아이템)를 렌더 → `shareId`(공유 링크 재료)와 인연카드 등급(`cardGrades` — 계약에 없어 요청 중, PRD Q3)을 `features/share`에 넘긴다.
2. 친구 궁합 — 공유 링크(`/s/:shareId`)로 진입 → 링크 주인의 공개 결과를 `GET /shares/{shareId}`로 조회(결과 전문이 오지만 화면은 닉네임만 쓰고 사주 요약은 숨긴다 — FR-15) → 방문자가 자기 사주를 입력(`POST /results`) → `POST /shares/{shareId}/compatibility`(`guestResultId`)로 궁합 점수 응답(점수 + 등급)을 받아 표시하고, 양쪽의 궁합 지도(`features/friends`: 구슬·등급별 인원·순위)에 반영된다. 등급별 인원 수는 `GET /results/{resultId}`의 `compatibilities`에서 `lib`의 순수 함수가 센다.
3. 운명의 실 — 결과 화면의 사전신청 티저 → 모달(`features/profile`)에서 추가 정보 등록·동의(동의 전에는 전송하지 않는다) → 후보 카드 열람(`features/matching`, 축제 당일 2026-09-29부터) → '보내기' 호출 → 상대가 '당기기'를 하면 성립 응답에 연락처(전화번호, 등록했다면 인스타그램 아이디)가 포함되어 화면에 공개된다. 앱 내 채팅은 없다.

## State Management

- 서버 상태(사주 결과, 친구 점수, 후보, 실 상태)는 백엔드가 소유한다. 화면은 React Router 데이터 API로 읽고 쓴다 — 읽기는 route `loader`, 쓰기는 `action`·`useFetcher`가 `src/api/` 함수를 부르고, loader·action은 feature가 export 해 `src/app/routes.tsx`가 등록한다. 요청/캐시 라이브러리는 두지 않는다. `/reading/:id` 하위 화면은 부모 loader 데이터(`useRouteLoaderData`)를 공유하고 결과 본문은 다시 부르지 않으며, `compatibilities`를 보여 주는 화면은 진입마다 다시 부른다(ADR-20260913-server-state-and-session-storage).
- 폼·모달·블러 해제 여부 같은 화면 상태는 해당 feature 안의 지역 상태로 둔다. 전역 스토어는 도입하지 않는다.
- 로그인은 없다. 백엔드가 보낸 세션 토큰만으로 '내 결과·내 신청·내 실'을 찾고 세션을 유지한다. 공유 링크 재료는 `shareId`다 — 계약의 `GET /results/{resultId}`는 토큰 계약(Q16) 전까지 본인 결과 조회에 `resultId`를 쓴다. 토큰은 `src/api/session.ts`만 읽고 쓴다: localStorage 키 `wks:session`에 `{ v: 1, token }`을 두고 읽을 때 zod로 파싱한다(실패·스토리지 예외는 세션 없음). 토큰을 받는 응답에서 쓰고 `src/api/client.ts` 한 곳에서만 요청에 싣는다. 만료는 시계로 판단하지 않고 백엔드가 세션 무효로 응답하면 `clearSession()` 후 `/`로 보낸다. 발급 시점·전달 방식·만료 코드는 백엔드 계약 갱신 대기(PRD Q16) — 그 전까지는 목 응답의 토큰으로 개발한다.

## Persistence

브라우저에 저장하는 것은 localStorage `wks:session` 한 키의 세션 토큰뿐이다(인트로는 MVP에서 제외됐다). 사용자 데이터·사주 결과·매칭 상태는 모두 백엔드가 저장하며 이 저장소에는 스키마·마이그레이션이 없다.

## External Systems

| System           | Purpose                          | Interface              | Failure Handling                                       |
|------------------|----------------------------------|------------------------|--------------------------------------------------------|
| 백엔드 API       | 사주·궁합·매칭·인증·저장          | REST/JSON (`docs/api/`) | 타임아웃 후 GET만 재시도 1회(POST는 재시도 안 함), 실패 시 route `errorElement`의 보살 말투 에러 화면 |
| 인스타그램 공유  | 인연카드 이미지 공유 · 공유 링크    | Web Share API (files · url) | 미지원 브라우저는 이미지 다운로드 · 클립보드 복사 + Toast 로 폴백 |
| 정적 호스팅      | SPA 배포와 공유 링크 라우팅       | TBD (Phase 08)         | TBD                                                    |

## Important Interfaces

- REST API: `docs/api/openapi.yaml` — 이 저장소의 사본은 **참조본**이다. 계약의 source of truth는 백엔드 저장소이며, 차이를 발견하면 백엔드 저장소에 이슈로 올리고 이 파일을 맞춘다.
- 디자인: Figma (PRD Constraints의 링크 — 「UI 최종 - 개발용」 558-2430 이 구현 기준). 토큰·컴포넌트 명세는 Phase 02에서 `src/ui/`로 코드화한다. 디자인과 spec이 어긋나면 디자인이 우선한다.

## Cross-cutting Concerns

- 인증/인가: 로그인·비밀번호는 없다. 사주 결과 생성 시 백엔드가 세션 토큰을 발급하고 프론트가 보관해 이후 요청에 실어 보내며, 내 데이터는 토큰으로만 찾는다(전달 방식은 PRD Q16). 사전신청의 학교 웹메일 매직링크는 백엔드가 처리하고 프론트 완료 페이지로 302. 보호된 화면은 route loader가 `readSession()`이 없으면, api가 세션 무효 응답을 받으면 사주 입력(`/`)으로 리다이렉트한다.
- 설정: `VITE_` 접두 환경변수(`VITE_API_BASE_URL` 등)로만 주입한다. 비밀값은 프론트엔드에 두지 않는다.
- 에러 처리: 응답 스키마 검증 실패와 네트워크 실패를 구분해 사용자에게는 같은 안내 화면을, 콘솔에는 원인을 남긴다.
- 관측성: 로깅·분석 도구는 TBD (Phase 08).
