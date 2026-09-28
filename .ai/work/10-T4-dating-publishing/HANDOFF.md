# Handoff — 10-T4-dating-publishing

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: 10/T4

## Goal

소개팅 인트로·프로필 2단계·Top 3 카드(앞·뒷면·인연x·리롤 시트·실 잔액)가 feature 뷰 모델 props 로만 그려지고 `/preview/dating-*` 에서 가짜 데이터로 보이며, 새 표현 컴포넌트 5개가 도메인 규칙 없이 `src/ui/` 에 있다.

## Work Completed

- ui: BottomSheet·ProfileCard·ThreadCount·Avatar·BlurredPhoto(+테스트), SegmentedControl `appearance="rose"`, Figma 에셋 7개(`src/ui/assets/dating/`)
- dating: `intro/DatingIntro`(+LoginSheet) · `profile/DatingProfileForm`(zod 검증, `onSubmit(input)`, `submitState`) · `recommendation/DatingCards`(헤더 잔액·CandidateCard·인연x·RerollSheet) · `index.ts`
- preview: `dating-intro` · `dating-profile` · `dating-cards`

## Work In Progress

- 없음

## Files Changed

- `src/ui/{BottomSheet,ProfileCard,ThreadCount,Avatar,BlurredPhoto}.tsx`(+test), `src/ui/SegmentedControl.tsx`, `src/ui/assets/dating/*`
- `src/features/dating/**`, `src/app/preview/screens/dating-{intro,profile,cards}.tsx`

## Decisions Made

- 잠긴 항목은 `LockableField` (잠김이면 `{isLocked:true,cost}`, 아니면 `{isLocked:false,value}`), 잠긴 사진은 `thumbnailUrl` 만 — 값이 들어올 자리가 없다.
- 상단 잔액: Figma top_nav 에 숫자가 없어 해금 모달의 '보유 N개' pill(110:2660)을 ThreadCount 로 만들어 '운명의 실' 옆에 둠.
- 배경은 AppShell(app/, Touches 밖) 대신 `features/dating/DatingBackdrop` 고정 레이어 + `dating.css`(Figma 원본 색, 토큰 없음). 카카오 노랑도 이 CSS.
- 리롤 잔액 부족은 디자인에 없어 시트 안 문구 한 줄 + 버튼 비활성(FR-31).
- 사주 옵션(12시진·MBTI)은 features 간 import 금지라 `dating/profile/options.ts` 로 복제.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`, `/preview/dating-*` 375px 눈 확인

## Test Results

- 79 files / 404 tests 통과, typecheck·lint(0 경고) 통과

## Known Problems

- 인트로 배경 카드 벽은 Figma 샘플 인물 사진 대신 장식 타일로 그림(사진 에셋 미반입).
- 로그인 바텀시트는 ARCHITECTURE 상 `features/auth`(09/T2) 몫인데 PLAN T4 가 dating 에 요구 — 09/T2 와 중복 여부 확인 필요.
- 연락처: FR-25·디자인은 전화/인스타 택1, 11/T2 Done when 은 '전화번호 + (등록했다면) 인스타' — 스펙 불일치.

## Unverified Assumptions

- 글자 수 제한: 이름 20(임의), 학과 14·자기소개 170(Figma 주석). 학교 메일 도메인 검사는 백엔드 몫으로 둠.
- (2/2) 항목을 모두 필수로 봄(디자인에 '선택' 표시 없음).

## Exact Next Action

PR 리뷰 대응. 연동 Task(10/T1·T2·T3)는 `@/features/dating` 뷰 모델 타입에 응답을 변환해 붙인다.
