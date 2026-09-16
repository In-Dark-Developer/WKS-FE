# Handoff — 06-T3-signup-submit

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: 06/T3 · 06/T4

## Goal

결과 화면에서 사전신청에 닿고, 동의한 신청이 `POST /signups` 로 접수되며, 매직링크가 `/verify` 로 돌아온다.

## Work Completed

- 세션 예외처리 — `getResult` 가 404 를 받으면 `forgetSession`, 결과 loader 는 사주 입력으로 redirect
- `src/api/signups.ts`·`schema/signups.ts` — 신청·재발송, 계약 길이·MBTI 형식까지 zod 로 먼저 검증
- 폼 — 연락처 택1(세그먼트+값 한 칸), 성별·찾는 인연 세그먼트, 이메일 문구, 실패 3종(연결·중복·도메인), 완료 화면의 `mailSent`
- `TermsSheet`(695:2753) — 사주 입력·사전신청 양쪽에서 연다
- 티저를 결과 화면 사전신청 섹션(873:4155)으로 교체, `/reading/:id/pre-register` 모달 라우트·`/verify`(SCR-14) 등록
- analytics `pre_register_opened`·`pre_register_submitted`·`pre_register_failed`
- spec 갱신 — openapi SignupRequest 6필드·PRD FR-10 택1·PLAN T3/T4

## Work In Progress

- 없음

## Files Changed

- `src/api/`(signups·results·session·schema) · `src/features/profile/` 전반 · `src/features/saju/SajuForm.tsx`·`readingLoader.ts` · `src/ui/TermsSheet.tsx` · `src/app/routes.tsx`·`preview/screens/pre-register.tsx` · `src/lib/analytics.ts` · `docs/` · `.claude/launch.json`

## Decisions Made

- 연락처는 택1 — 백엔드 `contactMethod` 가 하나만 저장한다(소유자 결정, PRD FR-10 되돌림)
- 동의는 체크박스 유지, 약관 시트는 읽을 거리로 병행 (ADR-20260916-signup-contract-gap)
- 사진은 전송하지 않는다 — 받는 필드가 없다
- 죽은 resultId 는 API 계층에서 비운다 — 라우팅이 아니라 응답을 본 곳이 안다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · 브라우저 수동(목 모드: 입력 → 결과 → 티저 → 모달, 약관 시트, `/verify`)

## Test Results

- test 344 통과(신규 16) · typecheck·lint 무경고 · build 성공 · 콘솔 오류 없음

## Known Problems

- 'GRAND OPEN !!' 는 디자인이 Cafe24 PRO Slim 40px 인데 그 폰트·40px 토큰이 없어 성곡 서체 32px 로 썼다
- 실제 `POST /signups` 호출은 운영 데이터를 만들므로 검증하지 않았다 — 배포 후 1건으로 확인 필요
- `joinShare` 의 RESULT_NOT_FOUND 는 내 결과가 죽은 경우와 없는 링크를 구분하지 못한다(백엔드가 같은 코드를 준다)

## Unverified Assumptions

- 백엔드 확장분(981b487)이 축제 전 운영에 배포된다 — 안 되면 이름·연락처·학과·MBTI·자기소개가 저장되지 않는다
- 운영 `verify-redirect-url` 이 `https://threadoffate.site/verify` 로 설정돼 있다

## Exact Next Action

PR merge 후 백엔드 운영 배포를 확인하고, 실제 신청 1건으로 인증 메일 → `/verify` 왕복을 점검한다.
