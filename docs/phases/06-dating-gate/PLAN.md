# Phase 06 — dating-gate

- Status: PLANNED
- Lead: @gn00py48
- Depends on: 03
- Start: 2026-09-13 · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

결과 화면의 사전신청 티저에서 사전신청 모달이 열리고, 추가 정보 입력과 개인정보 동의를 마치면 완료 상태가 보이고 상대 정보 열람권을 얻는다. 동의 없이는 전송하지 않는다.

## Motivation

사전신청 완료가 곧 상대 정보 열람권이고(PRD G3), 소개팅 후보 화면(Phase 07)은 축제 당일에야 열리므로 그 전에 신청을 받아 두지 않으면 당일에 보여줄 후보가 없다. 결과 화면(03/T5)에 `teaser` 슬롯과 하위 라우트 `<Outlet />` 이 이미 있어 지금 채울 수 있다.
이 Phase는 제품에서 처음으로 개인정보(이름·사진·연락처)를 다룬다 — 동의 게이트와 비노출 규칙(FR-17·NFR-4)을 여기서 한 번 고정해 두면 Phase 07의 연락처 공개가 그 위에 올라간다.

## Scope

- SCR-09 사전신청 모달 퍼블리싱 — 수정본(558-3526) 기본·오류·로딩·연결 실패·완료 5상태. 입력 항목은 이름 · 사진 · 이메일 · 전화번호(필수) · 인스타그램 아이디(선택) · 학과 · MBTI(16유형) · 자기소개 + 동의 체크 (FR-10)
- SCR-04 사전신청 티저 — `ReadingResult` 의 `teaser` 슬롯에 넣는 표현 컴포넌트, 누르면 `/reading/:id/pre-register` 로 간다 (FR-9)
- 동의 게이트 — 동의 전에는 제출 버튼이 잠기고 네트워크 요청이 나가지 않는다 (FR-17, NFR-4)
- 고지 문구(수집 항목·이용 목적·보관 기간)를 `src/features/profile/` 한 파일에 모아 기획 확정 시 한 곳만 고친다 (CONVENTIONS 7장)
- 제출 연동 — `POST /signups` 요청·응답 zod 검증, 완료·연결 실패(입력값 유지) 상태 전환
- `/preview/pre-register` 로 5상태를 가짜 데이터로 확인 (publishing-first 공지)

## Out of Scope

- 소개팅 후보 목록·운명의 실·연락처 공개 — Phase 07
- 쿠폰 지급 안내(FR-11) — MVP 제외 (PRD Non-goals)
- 학교 웹메일 매직링크의 인증 완료 리다이렉트 페이지 — 백엔드가 돌려보낼 경로가 미정(Q14), Phase 08에서 배포 경로와 함께
- 사진의 실제 업로드·저장 — 업로드 방식이 미정(Q14)이라 선택·미리보기까지만 하고 전송은 계약 확정 후
- `Modal`·`Toast` 컴포넌트 자체 — 02/T3 (이 Phase는 쓰기만 한다)
- 결과 화면 본문·라우트 등록 — 03/T5·03/T7 소유

## Dependencies

**준비됨**

- 03/T5 결과 화면 — `ReadingResult` 의 `teaser?: ReactNode` 슬롯과 하위 라우트 `<Outlet />` (병합됨, PR #57)
- 03/T6 `/preview` 라우트 — `src/app/preview/screens/<화면>.tsx` 한 파일 추가로 확인 (병합됨, PR #56)
- 02/T2·02/T6 입력 컴포넌트 — `Button`·`TextField`·`Checkbox`·`Field`·`Select`·`TextArea`·`PhotoUpload` (병합됨)

**차단 — 다른 담당자·기획·백엔드의 결정을 기다린다 (착수 전 닫혀야 한다)**

- 02/T3 `Modal` (@nicerjs23, 미착수) — T2 가 모달 셸(포커스 트랩·ESC·배경 스크롤 잠금)을 쓴다. 없으면 T2 를 시작할 수 없다
- 03/T7 라우트 연동 (@nicerjs23) — publishing-first 공지로 `src/app/routes.tsx` 는 03/T7 단독 소유다. `/reading/:id/pre-register` 자식 라우트를 누가 등록하는지 확정해야 T3 의 Touches 가 정해진다
- PRD Q14 `/signups` 계약 — 현 계약은 학교 웹메일·`gender`·`preferGender` 만 받고 이름·전화번호·사진·학과·MBTI·자기소개를 받지 않는다. 요청 스키마가 확정돼야 T3 을 시작할 수 있다
- PRD Q4 보관 기간 — 동의 고지 문구에 들어간다. 법적 고지라 임의로 정하지 않는다
- PRD Q10 사진 형식·용량 제한과 자기소개 최대 글자 수 — 검증 규칙
- 디자인 — MBTI 입력 방식(수정본 Frame 83·85 에 "이게 최선일까" 메모), 연락처는 택1 세그먼트가 아니라 전화번호 필수 + 인스타그램 선택(FR-10, 디자인 갱신 대상)
- '내 신청' 식별 — 백엔드 세션 토큰은 없다(ADR-20260914-result-ownership-in-browser). `POST /signups` 가 `resultId`(nullable)를 받으므로 브라우저에 보관된 `resultId` 를 실을지 T3 에서 정한다

## Tasks

- [x] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/06-dating-gate/` · Owner: @gn00py48 (commit 9899d2d)

- [x] T2. 사전신청 모달·티저 퍼블리싱 — Done when: 수정본(558-3526) 사전신청 모달의 기본·오류(이메일 형식)·로딩·연결 실패(입력값 유지)·완료 5상태와 결과 화면 티저(`PreRegistrationTeaser`)가 feature 가 정한 뷰 모델 props 로만 렌더되고(`src/api/` 스키마를 import 하지 않는다), 동의 체크 전에는 제출 버튼이 잠기며, `/preview/pre-register` 에서 5상태를 가짜 데이터로 볼 수 있다 (테스트 포함). 연락처는 전화번호 필수 + 인스타그램 선택(디자인의 택1 세그먼트와 다름 — FR-10). 고지 문구는 `consent.ts` 한 곳에 모은다 · Touches: `src/features/profile/`, `src/app/preview/screens/pre-register.tsx` · After: 02/T3 · Owner: @jjjung0921 (commit 269da6b 본문·ea10053 모달 셸 — `PreRegisterModal` 을 결과 화면 하위 라우트에 붙이는 일은 조립 Task)

- [ ] T3. 사전신청 제출 연동 — Done when: `POST /signups` 요청·응답이 zod 로 검증되고, 동의하지 않은 제출은 네트워크 요청 0건으로 막히며, 성공 시 완료 상태·연결 실패 시 입력값 유지 안내로 전환되고, 사전신청 전에는 상대 정보가 화면·응답 어디에도 없다 (테스트 포함) · Touches: `src/api/signups.ts`, `src/api/schema/signups.ts`, `src/features/profile/preRegisterAction.ts`, `docs/api/openapi.yaml#/paths/~1signups` · After: T2 · Owner: 미정

<!-- 퍼블리싱 먼저(2026-09-13 공지): 기존 T2 한 덩어리를 T2(props 만 — 화면)와 T3(연동 — api·action)으로 나눴다. T2 의 담당·파일 경계는 그대로 두고 범위만 퍼블리싱으로 좁혔다.
     T3 의 Touches 에 `src/app/routes.tsx` 를 넣지 않았다 — publishing-first 로 그 파일은 03/T7 단독 소유다. `/reading/:id/pre-register` 등록 주체가 정해지면 이 줄을 계획 PR 로 고친다.
     T3 Owner 는 미정이다 — Q14(`/signups` 요청 스키마)가 닫히기 전에는 작업 크기를 알 수 없다. -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-09·SCR-04), FR-9, FR-10, FR-17, NFR-4, Q4·Q10·Q14
- Figma 「UI 최종 - 개발용」 수정본 558-3526 — 사전신청 모달 5종 · MBTI 드롭다운(Frame 83·85)
- `docs/ARCHITECTURE.md` — Data Flow 3, Module Boundaries(features·api), Cross-cutting Concerns(인증·에러)
- `docs/api/openapi.yaml` — `/signups`, `/signups/resend`, `/signups/verify`
- `.ai/team/announcements/2026-09-13-publishing-first.md` · `2026-09-13-session-token-and-contact.md`

## Acceptance Criteria

- [ ] AC1. 결과 화면의 티저를 누르면 사전신청 모달이 열리고, 기본·오류·로딩·연결 실패·완료 5상태가 디자인대로 보인다 (FR-9)
- [ ] AC2. 이름·사진·이메일·전화번호·인스타그램 아이디·학과·MBTI·자기소개를 입력할 수 있고, 전화번호는 필수·인스타그램 아이디는 선택이다 (FR-10)
- [ ] AC3. 수집 항목·이용 목적·보관 기간이 화면에 고지되고, 동의하지 않은 채 제출하면 네트워크 요청이 0건이다 (FR-17, NFR-4)
- [ ] AC4. 제출이 성공하면 완료 상태가 보이고, 연결에 실패하면 입력값이 남은 채 재시도 안내가 뜬다
- [ ] AC5. `/preview/pre-register` 에서 5상태를 가짜 데이터로 볼 수 있고, 화면 컴포넌트가 `src/api/` 를 import 하지 않는다 (publishing-first)
- [ ] AC6. 새 화면·로직에 테스트가 있고 Commands 4개가 경고 없이 통과한다

## Validation Plan

- AC1·AC2: `src/features/profile/` 컴포넌트 테스트 — 라벨·역할로 필드를 찾고(`getByRole`), 전화번호 빈 값 제출 시 필드 오류가 뜨는 경로 1개
- AC3: 동의 체크 없이 제출했을 때 action(또는 fetch 대역) 호출 횟수가 0 임을 단언하는 테스트
- AC4: 가짜 action 이 성공·`connection` 실패를 각각 돌려주는 테스트 2개
- AC5: `pnpm dev` 로 `/preview/pre-register` 를 375px 에서 수동 확인 + `src/features/profile/` 의 import 를 린트(의존 방향)로 확인
- AC6: `pnpm test` · `pnpm typecheck` · `pnpm lint`
