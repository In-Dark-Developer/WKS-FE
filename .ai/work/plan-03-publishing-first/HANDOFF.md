# Handoff — plan-03-publishing-first

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/-

## Goal

디자인 있는 화면마다 props 로만 그리는 퍼블리싱 Task 가 있고, 데이터 연동은 따로 분리돼 있으며, 가짜 데이터로 화면을 볼 preview Task 가 있다.

## Work Completed

- 03/T5 → 결과 화면 퍼블리싱(@jjjung0921, After T6, `ReadingView` props, ZodiacCharacter)
- 03/T6 preview 라우트(DEV 전용, `screens/<화면>.tsx` + import.meta.glob)
- 03/T7 입력·결과 연동(@nicerjs23, After T1·T4·T5, routes.tsx 소유)
- 04/T2 인연카드·05/T2 궁합 지도 퍼블리싱(@jjjung0921), 공지 `publishing-first`

## Work In Progress

- 없음

## Files Changed

- `docs/phases/{03-saju-reading,04-share-and-card,05-friend-score}/PLAN.md`, `docs/phases/README.md`
- `.ai/team/announcements/2026-09-13-publishing-first.md`, `.ai/team/README.md`

## Decisions Made

- 소유자 지시: 퍼블리싱 먼저(A안) — 화면은 뷰 모델 props, 변환·action·loader 는 연동 Task
- preview 는 App.tsx 에서 붙이고 화면별 파일로 등록 → routes.tsx·목록 파일 충돌 없음
- 십이간지 캐릭터는 ui 로 — saju·share 가 함께 쓰고 features 끼리 import 금지
- 연동 Task 에 입력 action 도 포함(T4 는 폼만 만들었음)

## Tests Executed

- `phases --check` · `announce --check` · `pnpm lint`

## Test Results

- 통과

## Known Problems

- 03/T5 담당 변경은 @nicerjs23 동의 필요(PR 리뷰), 이슈 #30 담당자·본문은 병합 후 갱신
- 04·05 T1 상세 계획 전에 퍼블리싱 Task 를 먼저 넣음 — Lead(@gn00py48·@nicerjs23) 확인 필요
- 인연카드 디자인은 0–100 바 — 문자 등급으로 갱신 필요(Q7)

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합
