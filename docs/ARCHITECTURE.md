# Architecture — 운꿰사 (WKS) 프론트엔드

- Last updated: 2026-09-23
- Related ADRs: ADR-20260911-frontend-stack-and-repo-scope, ADR-20260913-server-state-and-session-storage, ADR-20260914-result-ownership-in-browser, ADR-20260923-v1-account-and-kakao-login

## System Overview

브라우저에서 도는 단일 페이지 앱(SPA)이다. Vite로 빌드한 정적 자산을 호스팅하고, 모든 데이터·사주 계산·문구 생성은 별도 저장소의 백엔드 REST API가 담당한다.
프론트엔드가 소유하는 것은 화면·입력 검증·공유 흐름·클라이언트 상태뿐이며, 점수 산출 규칙 같은 도메인 로직은 화면에 두지 않는다.
V1(Phase 09~11)에서 카카오 로그인과 소개팅이 더해진다. 로그인은 백엔드가 카카오와 주고받고 프론트에는 `HttpOnly` 쿠키로만 온다 — 아래 표의 **(V1)** 표시는 spec 으로 확정됐고 아직 구현되지 않은 것이다.

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
| features  | 화면 단위 기능 (intro · saju · share · friends · profile · **(V1)** auth · dating) | `src/features/` |
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
- `ui`는 백엔드 응답 타입을 모른다 — props로만 받는다. 도메인 규칙(등급 구간, 점수 계산, 해금 비용)은 `ui`에 두지 않는다. 등급과 비용은 백엔드 응답에서 온다.
- `features/profile`(V0.5 사전신청)은 V1 흐름에서 라우트에서만 내리고 폴더는 남긴다 — 백엔드 `signup` 구조가 그대로다(FR-9 의 V1 표시).
- **(V1)** 소개팅은 `features/dating/` 하나로 두고 그 안에서 `intro`·`profile`·`recommendation`·`unlock`·`thread`·`request` 단계 폴더로 나눈다. 단계끼리 같은 흐름을 공유하므로 feature 를 쪼개면 금지된 `features ↔ features` import 가 생긴다.
- **(V1)** `api/` 는 엔드포인트 묶음마다 파일을 나눈다 — `me.ts`(계정·프로필·로그인 여부, 로그인 판단의 단일 출처) · `auth.ts` · `dating.ts` · `unlocks.ts` · `matchRequests.ts` · `threads.ts` · `uploads.ts` · `compatibilityReasons.ts`. 화면은 `fetch` 를 직접 부르지 않는다.
- **(V1)** `ui/` 신규 표현 컴포넌트: `BottomNav`(FR-19) · `BottomSheet` · `Tabs`(FR-30) · `LockedValue`(FR-28) · `ThreadCount`(FR-31) · `Avatar`·`BlurredPhoto`(FR-25) · `ProfileCard`(FR-26). 기존 `Button`·`Field`·`Select`·`TextField`·`TextArea`·`Checkbox`·`PhotoUpload`·`Modal`·`Toast`·`SegmentedControl` 은 그대로 재사용한다 — 사주 입력과 소개팅 프로필 입력이 같은 컨트롤을 쓰되 폼은 각 feature 가 갖는다.

## Dependency Direction

`app → features → { ui, api, lib }`, `ui → lib`, `api → lib`.
금지: 역방향 import(`ui → features` 등), `features ↔ features` 순환, `ui → api`.

## Data Flow

1. 사주 보기 — 입력 폼(`features/saju`) → `api`가 요청 스키마로 검증해 POST → 응답 봉투(`{success,data|error}`)를 zod로 파싱 → 응답의 `resultId`를 `api`가 이 브라우저의 '내 결과'로 보관 → `/reading/:id`로 이동해 loader가 보관된 `resultId`와 `:id`가 같은지 확인한 뒤 `GET /results/{id}` → 결과 화면이 운명 카드(운명 제목·설명, 결혼운·자녀운·연애운 등급, 행운의 장소·아이템)를 렌더 → `shareId`(공유 링크 재료)와 인연카드 등급(`cardGrades` — 계약에 없어 요청 중, PRD Q3)을 `features/share`에 넘긴다.
2. 친구 궁합 — 궁합 지도(`/me/map`)의 '친구에게 공유하고 궁합 지도 넓히기'가 `/s/:shareId` 를 공유 → 받은 사람이 `/s/:shareId`(가드 없음, 첫 방문이면 인트로)로 진입해 `GET /shares/{shareId}` 로 링크 주인 닉네임을 받아 사주 입력(`features/saju` 폼 + 공유용 문구)을 본다. 보관된 내 `resultId` 가 있고 이 탭에서 이 링크로 궁합을 만든 적이 없으면 입력을 건너뛴다 → 제출하면 결과 대기 화면을 보이며 `POST /results`(내 `resultId` 보관) → `/s/:shareId/join` loader 가 `POST /shares/{shareId}/compatibility`(`guestResultId` = 보관된 내 `resultId`) → 이 탭에서 궁합을 만든 링크로 sessionStorage 에 기록 → `/s/:shareId/map` 에서 다시 `GET /shares/{shareId}` 로 링크 주인의 궁합 지도(`features/friends`: 구슬·등급별 인원·순위, 사주 요약은 숨긴다 — FR-15)를 본다 → '내 사주 내용도 확인하기'로 `/reading/:resultId`. 궁합은 두 결과의 `compatibilities` 에 모두 들어가 양쪽 결과 화면 순위와 궁합 지도에 보인다. `SELF_COMPATIBILITY` 면 자기 결과로, 그 밖의 실패는 오류 안내(다시 시도는 join 만 다시 부른다). 등급별 인원 수는 `compatibilities` 에서 `lib`의 순수 함수가 센다.
3. 운명의 실 (V0.5 운영본) — 결과 화면의 사전신청 티저 → 모달(`features/profile`)에서 추가 정보 등록·동의(동의 전에는 전송하지 않는다) → 후보 카드 열람(`features/matching`, 축제 당일 2026-09-29부터) → '보내기' 호출 → 상대가 '당기기'를 하면 성립 응답에 연락처(전화번호, 등록했다면 인스타그램 아이디)가 포함되어 화면에 공개된다. 앱 내 채팅은 없다. V1 에서는 4·5 가 이 흐름을 대체한다(FR-9·FR-12·FR-13 의 V1 표시).
4. **(V1)** 로그인과 계정 복원 — 궁합 지도(`/me/map`)의 저장 유도나 소개팅 인트로에서 로그인 바텀시트(`features/auth`) → 현재 경로를 복귀 지점으로 넘기며 백엔드의 카카오 인증으로 나간다 → 복귀 loader 가 `GET /me`(`api/me.ts`)로 계정·프로필 유무를 확인한다 → 계정에 기록이 있으면 그 기록을 복원하고 브라우저 기록은 그대로 두며, 계정이 비어 있을 때만 보관된 `resultId` 를 계정에 연결한다 → 로그인을 시작한 화면으로 돌아간다. 취소·실패해도 현재 지도와 비로그인 기록은 남는다 (FR-20·FR-21, ADR-20260923-v1-account-and-kakao-login).
5. **(V1)** 소개팅 — 하단 네비의 소개팅 탭 → `features/dating/intro` 가 비로그인이면 로그인을, 프로필이 없으면 등록을 안내(FR-24) → 프로필 2단계 등록(사주 정보 / 이름·사진·학교 메일·연락처·학과·MBTI·자기소개, 사진은 업로드 URL 발급 → 업로드 → 저장 순서, FR-25) → 오늘의 인연 Top 3 카드(FR-26)에서 잠긴 항목은 값 대신 잠금 상태와 비용을 받는다 → 해금(FR-28)·리롤(FR-27)이 재화 '실'(FR-31)을 차감하고, 잔액과 비용은 모두 백엔드가 준다 → '운명의 실 보내기'(FR-29) 후에는 그 상대의 미해금 항목을 해금할 수 없다 → 요청함(FR-30)에서 수락하면 양쪽 연락처가 공개된다. 잠긴 사진의 원본 주소는 화면·응답 어디에도 없다(FR-28, NFR-4).

## State Management

- 서버 상태(사주 결과, 친구 점수, 후보, 실 상태)는 백엔드가 소유한다. 화면은 React Router 데이터 API로 읽고 쓴다 — 읽기는 route `loader`, 쓰기는 `action`·`useFetcher`가 `src/api/` 함수를 부르고, loader·action은 feature가 export 해 `src/app/routes/`의 영역별 파일(`saju.routes.tsx`·`share.routes.tsx`·`map.routes.tsx`)이 등록하고 `src/app/routes/index.tsx`가 합친다. 라우트 가드는 `src/app/routes/guards.ts`만 갖는다. 요청/캐시 라이브러리는 두지 않는다. `/reading/:id` 하위 화면은 부모 loader 데이터(`useRouteLoaderData`)를 공유하고 결과 본문은 다시 부르지 않으며, `compatibilities`를 보여 주는 화면은 진입마다 다시 부른다(ADR-20260913-server-state-and-session-storage).
- 폼·모달·블러 해제 여부 같은 화면 상태는 해당 feature 안의 지역 상태로 둔다. 전역 스토어는 도입하지 않는다.
- **(V1)** 로그인은 카카오이고 세션은 백엔드가 `HttpOnly` 쿠키로 주는 JWT 다(만료 15일, NFR-7). 프론트는 쿠키를 읽지 않고 `src/api/me.ts` 의 `GET /me` 응답으로만 로그인 여부를 판단한다 — 쿠키를 읽을 수 없는 것과 인앱에서 쿠키가 막힌 것을 같은 경로로 다루기 위해서다(NFR-8). `src/api/client.ts` 는 `credentials: 'include'` 로 보내고 401 을 로그아웃 상태로 다룬다. 계정 기록이 게스트 기록을 이긴다(FR-21). 가드는 `src/app/routes/guards.ts` 가 세 개를 갖는다 — `requireSaju`(쓸 수 있는 사주 기록) · `requireAuth`(로그인) · `requireDatingProfile`(프로필 등록), 각각 사주 입력 · 소개팅 인트로 · 프로필 등록으로 리다이렉트한다(ADR-20260923-v1-account-and-kakao-login).
- 비로그인 경로에는 백엔드 세션 토큰이 없다 — 백엔드는 사주·궁합에 인증을 두지 않는다. '내 결과'는 이 브라우저가 `POST /results`로 만든 `resultId` 하나다. `src/api/session.ts`만 읽고 쓴다: localStorage 키 `wks:session`에 `{ v: 2, resultId }`를 두고 읽을 때 zod로 파싱한다(실패·스토리지 예외는 세션 없음, 파싱 실패면 키를 지운다). `src/api/results.ts`의 `createResult`가 성공 응답(목·실제 공통)에서 쓰고, 새 결과가 이전 값을 덮어쓴다. 공유 링크 재료는 `shareId`이고 `resultId`는 본인 결과 조회와 `guestResultId`에만 쓴다. 요청에 싣는 인증 헤더는 없다(ADR-20260914-result-ownership-in-browser).

## Persistence

브라우저에 저장하는 것은 localStorage 두 키와 sessionStorage 두 키다: localStorage `wks:session` 이 브라우저가 만든 내 결과의 `resultId`(`src/api/session.ts`)과 `wks:intro-seen` 인트로를 봤는지 여부(`src/features/intro/introSeen.ts`, FR-1), sessionStorage `wks:joined-shares` 에 이 탭에서 궁합을 만든 공유 링크의 `shareId`(`src/api/joinedShares.ts` — 탭을 닫으면 사라진다, 뒤로가기로 돌아온 입력 화면이 입력을 건너뛰지 않게 한다, FR-6)와 **(V1)** `wks:kakao-login` 에 카카오 인가 왕복의 CSRF `state`·로그인 뒤 돌아갈 경로(`src/features/auth/kakaoLogin.ts` — 콜백에서 한 번 읽고 지운다, 같은 origin 절대 경로만 받는다, FR-20·FR-21). 메인 티저를 지났는지는 저장하지 않고 페이지 메모리에만 둔다 — 티저는 접속마다 먼저 보인다(FR-1, 2026-09-26; 예전 localStorage `wks:teaser-passed` 는 더 읽지 않는다). 목 모드(`VITE_API_MOCK=true`)에서만 localStorage `wks:mock-account` 가 쿠키 세션을 흉내 낸다(`src/api/me.ts` — 실제 배포에서는 쓰지 않는다). 인앱 브라우저의 저장소는 기본 브라우저와 따로이므로, 카카오톡·인스타그램 인앱으로 들어오면 `src/main.tsx`가 렌더 전에 기본 브라우저로 넘긴다(`src/lib/inAppBrowser.ts` — 카카오톡은 `kakaotalk://web/openExternal`, 인스타그램은 iOS `x-safari-https://`(iOS 17 이상)·Android Chrome intent). **(V1)** 여기에 로그인 세션 쿠키 `wks_token`(JWT, `HttpOnly; Secure; SameSite=Lax`, API 호스트 전용, 15일)이 더해지는데, `HttpOnly` 라 이 저장소의 코드가 읽거나 쓰지 않는다 — 백엔드가 심고 지우며(`POST /auth/logout`) 브라우저가 `credentials: 'include'` 요청에 실어 보낸다(NFR-7, `docs/api/openapi.yaml` cookieAuth). 사용자 데이터·사주 결과·매칭 상태는 모두 백엔드가 저장하며 이 저장소에는 스키마·마이그레이션이 없다.

## External Systems

| System           | Purpose                          | Interface              | Failure Handling                                       |
|------------------|----------------------------------|------------------------|--------------------------------------------------------|
| 백엔드 API       | 사주·궁합·매칭·인증·저장          | REST/JSON (`docs/api/`) — 운영 `https://api.threadoffate.site/api` | 타임아웃 후 GET만 재시도 1회(POST는 재시도 안 함), 실패 시 route `errorElement`의 보살 말투 에러 화면 |
| **(V1)** 카카오 로그인 | 계정 식별 (회원번호만, 동의항목 없음) | 백엔드가 카카오와 주고받고 프론트는 로그인 시작 URL 로 나갔다 복귀 경로로 돌아온다. 세션은 `HttpOnly` 쿠키 (FR-20 · NFR-7) | 취소·실패해도 현재 지도와 비로그인 기록을 유지하고 로그인을 시작한 화면으로 돌아간다 (FR-21) |
| 인스타그램 공유  | 인연카드 이미지 공유 · 공유 링크    | Web Share API (files · url) | 미지원 브라우저는 이미지 다운로드 · 클립보드 복사 + Toast 로 폴백 |
| 정적 호스팅      | SPA 배포와 공유 링크 라우팅       | Netlify(무료) — 이 저장소의 `main` 을 빌드, 병합이 곧 배포. DNS Route53(apex A `75.2.60.5`), 모든 경로 → `index.html` (ADR-20260922-netlify-org-repo-direct, `docs/deploy/netlify.md`) | 빌드 실패 시 직전 배포 유지(Netlify 원자적 배포). 공유 링크 미리보기(NFR-3)는 Phase 08 |

## Important Interfaces

- REST API: `docs/api/openapi.yaml` — 이 저장소의 사본은 **참조본**이다. 계약의 source of truth는 백엔드 저장소이며, 차이를 발견하면 백엔드 저장소에 이슈로 올리고 이 파일을 맞춘다.
- 디자인: Figma (PRD Constraints의 링크 — 「UI 최종 - 개발용」 558-2430 이 구현 기준). 토큰·컴포넌트 명세는 Phase 02에서 `src/ui/`로 코드화한다. 디자인과 spec이 어긋나면 디자인이 우선한다.

## Cross-cutting Concerns

- 인증/인가: 비로그인 경로에는 로그인·비밀번호·세션 토큰이 없다. 백엔드는 사주·궁합 조회를 추측할 수 없는 링크 키(`resultId`·`shareId`, UUIDv4)만으로 허용한다. 사전신청의 학교 웹메일 매직링크는 백엔드가 처리하고 프론트 완료 페이지로 302. 보호된 화면은 route loader 의 `requireSaju` 가 가드한다 — 주소에 결과 id 가 있는 화면(`/reading/:id` 하위)은 보관된 `resultId` 가 `:id` 와 같을 때만, 주소에 id 가 없는 화면(`/me/map`)은 보관된 `resultId` 가 있을 때만 통과하고, 아니면 사주 입력(`/`)으로 리다이렉트한다. 공유 랜딩(`/s/:shareId`)은 가드하지 않는다. 이 가드는 브라우저 안의 안내이며, 보안 경계는 백엔드가 소유한 링크 키의 추측 불가능성이다.
- **(V1)** 로그인 경로가 더해진다 — 소개팅 화면은 `requireAuth`·`requireDatingProfile` 이 가드하고, 권한 판단의 근거는 쿠키가 아니라 `GET /me` 응답이다. 잠긴 상대 정보(사진 원본 주소 포함)는 해금 전까지 화면에도 응답에도 없어야 하므로 프론트가 가리는 것으로 처리하지 않는다 — 백엔드가 값을 주지 않는다(FR-28 · NFR-4).
- 설정: `VITE_` 접두 환경변수(`VITE_API_BASE_URL` 등)로만 주입한다. 비밀값은 프론트엔드에 두지 않는다.
- 에러 처리: 응답 스키마 검증 실패와 네트워크 실패를 구분해 사용자에게는 같은 안내 화면을, 콘솔에는 원인을 남긴다.
- 관측성: 로깅·분석 도구는 TBD (Phase 08).
