# Phase 06 — dating-gate

- Status: IN_PROGRESS
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

**닫힘 (2026-09-16)**

- 02/T3 `Modal` — 병합됨. `useOverlayBehavior`(포커스 트랩·ESC·스크롤 잠금)를 `Modal`·`ShareSheet` 가 함께 쓴다
- `POST /signups` 계약 — 배포돼 동작한다(WKS-BE 2553448). `email`·`gender`·`preferGender` 필수 + `resultId` nullable. 나머지 디자인 항목은 받지 않으므로 **전송하지 않고 브라우저 안에만 둔다**(소유자 결정 2026-09-16, 계약 확장 시 실어 보낸다)
- 인증 완료 경로 — `GET /signups/verify` 가 `app.frontend.verify-redirect-url`(기본 `/verify`)로 302 한다. 프론트에 SCR-14 `/verify` 가 필요하다
- 연락처·성별 — 전화번호·인스타그램 **둘 다 필수**, 성별·선호 성별은 폼에 세그먼트 두 줄로 받는다(소유자 결정 2026-09-16, FR-10)
- 동의 — 체크박스 명시 동의를 유지하고 이용약관 시트(695:2753)를 사주 입력·사전신청 양쪽에 단다(소유자 결정 2026-09-16, FR-17)
- '내 신청' 식별 — 보관된 `resultId` 를 `POST /signups` 에 싣는다(없으면 null)

**남은 제약**

- PRD Q4 보관 기간 · Q10 사진 형식·용량·자기소개 글자 수 — 고지 문구와 검증 규칙은 확정 전 문구로 둔다
- 백엔드 확장 — 이름·사진·전화번호·인스타그램·학과·MBTI·자기소개를 받는 계약이 없다(Q14). 확장되면 `src/api/signups.ts` 한 곳만 고친다
- `src/app/routes.tsx` 는 publishing-first 공지상 03/T7 소유였으나 Phase 03 종료 후 chore 스트림들이 이어 고쳐 왔다 — T4 가 `/reading/:id/pre-register`·`/verify` 를 등록한다

## Tasks

- [x] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/06-dating-gate/` · Owner: @gn00py48 (commit 9899d2d)

- [x] T2. 사전신청 모달·티저 퍼블리싱 — Done when: 수정본(558-3526) 사전신청 모달의 기본·오류(이메일 형식)·로딩·연결 실패(입력값 유지)·완료 5상태와 결과 화면 티저(`PreRegistrationTeaser`)가 feature 가 정한 뷰 모델 props 로만 렌더되고(`src/api/` 스키마를 import 하지 않는다), 동의 체크 전에는 제출 버튼이 잠기며, `/preview/pre-register` 에서 5상태를 가짜 데이터로 볼 수 있다 (테스트 포함). 연락처는 전화번호 필수 + 인스타그램 선택(디자인의 택1 세그먼트와 다름 — FR-10). 고지 문구는 `consent.ts` 한 곳에 모은다 · Touches: `src/features/profile/`, `src/app/preview/screens/pre-register.tsx` · After: 02/T3 · Owner: @jjjung0921 (commit 269da6b 본문·ea10053 모달 셸 — `PreRegisterModal` 을 결과 화면 하위 라우트에 붙이는 일은 조립 Task)

- [ ] T3. 사전신청 제출 연동 — Done when: `POST /signups` 요청·응답이 zod 로 검증되고(전송 항목은 `email`·`gender`·`preferGender`·`resultId` 뿐이다), 동의하지 않은 제출은 네트워크 요청 0건으로 막히며, 성공 시 완료 상태·연결 실패 시 입력값 유지 안내로 전환되고, 중복 신청(409)·도메인 거부(400)가 사용자 문구로 구분돼 보이며, 사전신청 전에는 상대 정보가 화면·응답 어디에도 없다 (테스트 포함) · Touches: `src/api/signups.ts`, `src/api/schema/signups.ts`, `src/features/profile/` · After: T2 · Owner: @jjjung0921

- [ ] T4. 결과 화면 연결·이용약관 시트·`/verify` — Done when: 결과 화면 맨 아래 사전신청 섹션(873:4155)이 보이고 누르면 `/reading/:id/pre-register` 모달이 열리며, 이용약관 시트(695:2753)가 사주 입력·사전신청 양쪽에서 열리고, 폼이 전화번호·인스타그램을 둘 다 필수로 받고 성별·선호 성별 세그먼트를 가지며, 백엔드 매직링크가 보내는 `/verify`(SCR-14)가 안내 화면을 그린다 (테스트 포함) · Touches: `src/app/routes.tsx`, `src/features/profile/`, `src/features/saju/SajuForm.tsx`, `src/ui/TermsSheet.tsx`, `src/app/preview/screens/pre-register.tsx` · After: T3 · Owner: @jjjung0921

<!-- 퍼블리싱 먼저(2026-09-13 공지): 기존 T2 한 덩어리를 T2(props 만 — 화면)와 T3(연동 — api·action)으로 나눴다. T2 의 담당·파일 경계는 그대로 두고 범위만 퍼블리싱으로 좁혔다.
     T3 의 Touches 에 `src/app/routes.tsx` 를 넣지 않았다 — publishing-first 로 그 파일은 03/T7 단독 소유다. `/reading/:id/pre-register` 등록 주체가 정해지면 이 줄을 계획 PR 로 고친다.
     T3 Owner 는 미정이다 — Q14(`/signups` 요청 스키마)가 닫히기 전에는 작업 크기를 알 수 없다. -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-09·SCR-04), FR-9, FR-10, FR-17, NFR-4, Q4·Q10·Q14
- Figma 「UI 최종 - 개발용」 수정본 558-3526 — 사전신청 모달 5종 · MBTI 드롭다운(Frame 83·85)
- `docs/ARCHITECTURE.md` — Data Flow 3, Module Boundaries(features·api), Cross-cutting Concerns(인증·에러)
- `docs/api/openapi.yaml` — `/signups`, `/signups/resend`, `/signups/verify` (2026-09-16 실제 백엔드로 갱신)
- Figma 사전신청 5상태 695:2614·2624·2634·2644·2654 · MBTI 695:2682·2716 · 이용약관 695:2753 · 결과 화면 사전신청 섹션 873:4155
- `.ai/team/announcements/2026-09-13-publishing-first.md` · `2026-09-13-session-token-and-contact.md`

## Acceptance Criteria

- [ ] AC1. 결과 화면의 티저를 누르면 사전신청 모달이 열리고, 기본·오류·로딩·연결 실패·완료 5상태가 디자인대로 보인다 (FR-9)
- [ ] AC2. 이름·사진·이메일·전화번호·인스타그램 아이디·학과·MBTI·자기소개·성별·선호 성별을 입력할 수 있고, 전화번호와 인스타그램 아이디는 둘 다 필수다 (FR-10)
- [ ] AC3. 수집 항목·이용 목적·보관 기간이 화면에 고지되고, 동의하지 않은 채 제출하면 네트워크 요청이 0건이다 (FR-17, NFR-4)
- [ ] AC4. 제출이 성공하면 완료 상태가 보이고, 연결에 실패하면 입력값이 남은 채 재시도 안내가 뜬다
- [ ] AC5. `/preview/pre-register` 에서 5상태를 가짜 데이터로 볼 수 있고, 화면 컴포넌트가 `src/api/` 를 import 하지 않는다 (publishing-first)
- [ ] AC6. 새 화면·로직에 테스트가 있고 Commands 4개가 경고 없이 통과한다
- [ ] AC7. 이용약관 시트가 사주 입력·사전신청 양쪽에서 열리고 닫히며, 백엔드가 보내는 `/verify` 가 오류 화면이 아니라 인증 완료 안내를 그린다 (FR-17, SCR-14)
- [ ] AC8. 계약이 받지 않는 항목(이름·사진·전화번호·인스타그램·학과·MBTI·자기소개)은 네트워크 요청 본문에 없다

## Validation Plan

- AC1·AC2: `src/features/profile/` 컴포넌트 테스트 — 라벨·역할로 필드를 찾고(`getByRole`), 전화번호 빈 값 제출 시 필드 오류가 뜨는 경로 1개
- AC3: 동의 체크 없이 제출했을 때 action(또는 fetch 대역) 호출 횟수가 0 임을 단언하는 테스트
- AC4: 가짜 action 이 성공·`connection` 실패를 각각 돌려주는 테스트 2개
- AC5: `pnpm dev` 로 `/preview/pre-register` 를 375px 에서 수동 확인 + `src/features/profile/` 의 import 를 린트(의존 방향)로 확인
- AC6: `pnpm test` · `pnpm typecheck` · `pnpm lint`
