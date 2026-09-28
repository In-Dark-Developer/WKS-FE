# Phase 06 — dating-gate · Result

- Completed on: 2026-09-26
- Final Status: DONE
- Tag: `phase/06`

## Completed

- T1. 상세 계획 (commit 9899d2d)
- T2. 사전신청 모달·티저 퍼블리싱 — 5상태, 결과 화면 티저, `/preview/pre-register` (commit 269da6b, ea10053 — PR #63, #73)
- T3. 사전신청 제출 연동 — `POST /signups` zod 검증, 동의 게이트, 409·400 구분, 연결 실패 시 입력값 유지 (commit 2fa73e6 — PR #128)
- T4. 결과 화면 연결·이용약관 시트·`/verify` (commit 2fa73e6 — T3 과 같은 커밋, PR #128)

## Not Completed

- 없음

## Deviations from Plan

- **연락처**: 계획은 전화번호 필수 + 인스타그램 선택이었으나 FR-10 개정으로 **택1**(`contactMethod`·`contactValue`)이 됐다(82be5ca). AC2 는 택1 로 읽었다.
- **사진**: 2026-09-17 결정으로 받지 않는다(AC8).
- **T3·T4 가 한 커밋**으로 병합됐다(PR #128). T3 Owner 는 @jjjung0921.
- 사전신청 뒤 **인증 메일 재발송**이 더해졌다(chore-signup-resend-mail, PR #194)와 완료 화면의 발송 실패 문구 제거(hotfix #191).
- **V1**: FR-9 의 V1 표시대로 소개팅 진입(FR-19·24)이 사전신청을 대체할 예정이다. 2026-09-26 dev 기준 `/reading/:id/pre-register`·`/verify` 는 아직 라우트에 있다(ARCHITECTURE — 폴더는 남기고 라우트만 내린다).

## Important Decisions

- 사전신청은 계약에 있는 값만 보낸다 — ADR-20260916-signup-contract-gap (이후 BE 가 필드를 넓혀 택1 연락처까지 실었다)

## Validation Results

2026-09-26, dev `b2f25ef` 기준.

| Check | Command / Method | Result |
|-------|------------------|--------|
| Tests | `pnpm test` | ✅ 100 files / 528 tests |
| Typecheck | `pnpm typecheck` | ✅ 오류 0 |
| Lint | `pnpm lint` | ✅ |
| AC1 | `PreRegisterTeaser.test.tsx` · `PreRegisterModal.test.tsx` · `routes/index.test.tsx`('결과 화면의 사전 신청 버튼이 사전신청 모달을 연다') · `PreRegisterForm.test.tsx` 5상태 | ✅ |
| AC2 | `PreRegisterForm.test.tsx`('모든 항목에 라벨이 있고 연락처는 수단 택1', '인스타그램으로 바꾸면…', 성별·찾는 인연 오류) | ✅ |
| AC3 | `consent.ts` 수집 항목·이용 목적·보관 기간 고지 · `PreRegisterForm.test.tsx`('동의하기 전에는 제출 버튼이 잠겨 요청이 나가지 않는다') | ✅ (보관 기간 값은 미정 — Known Issues) |
| AC4 | `PreRegisterForm.test.tsx`('제출이 성공하면 완료', '연결에 실패하면 입력값을 유지') · `preRegisterAction.test.ts` | ✅ |
| AC5 | `src/app/preview/screens/pre-register.tsx` · `src/features/profile` 의 화면 컴포넌트(`PreRegister*.tsx`)는 `@/api` 를 import 하지 않는다(import 는 `formSchema`·`options`·`preRegisterAction` 뿐) | ✅ |
| AC6 | 위 Tests·Typecheck·Lint | ✅ |
| AC7 | `SajuForm.test.tsx`(약관 시트 [동의] 절) · `PreRegisterForm.test.tsx`(사전신청 시트에는 [동의] 절 없음) · `VerifyComplete.test.tsx` · `routes/index.test.tsx`('/verify 는 인증 완료를 알린다') | ✅ |
| AC8 | `PreRegisterForm.tsx` 에 사진 입력 없음(주석만) | ✅ |

- `/preview/pre-register` 375px 눈 확인(Validation Plan)은 이 종료 스트림에서 다시 하지 않았다.

## Known Issues

- 개인정보 **보관 기간**이 '확정 후 안내드려요'다 — PRD Q4 미답. 법적 고지라 임의로 정하지 않았다.
- 학교 메일 도메인 화이트리스트 미정으로 BE 가 도메인 검증을 건너뛴다(BE handoff).

## Follow-up Work

- V1 소개팅 진입이 열리면 사전신청 라우트를 내린다 — 10/T1 (Phase 10)
