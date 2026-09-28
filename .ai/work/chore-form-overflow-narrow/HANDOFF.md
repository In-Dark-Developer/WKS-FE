# Handoff — chore-form-overflow-narrow

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/-

## Goal

폭 320px 폰에서도 소개팅·사주·사전신청 입력 화면의 요소가 화면 안에 있다.

## Work Completed

- 원인: 입력창(input)이 기본 폭(글자 20자 ≈ 235px)을 최소 폭으로 잡아, 메일 줄(입력 + 120px '인증' 버튼)이 365px 아래로 줄지 않았다. fieldset 은 기본 min-inline-size: min-content 라 그 폭으로 넓어져 이름·사진·메일 칸이 모두 화면 밖으로 밀렸다 — 폭 400px 이하(360·375·393 등) 폰에서 재현
- TextField 입력창 w-0(칸 폭을 따른다), 입력 화면 fieldset 3곳 min-w-0
- 목 모드 iframe 320·360·375·393·412px 에서 넘치는 요소 0, (1/2)·(2/2)·메일 인증 4상태·사주 입력·공유 입력·사전신청 모두 확인

## Work In Progress

- 없음

## Files Changed

- `src/ui/TextField.{tsx,test.tsx}` · `src/features/dating/profile/{DetailsStep.tsx,DatingProfileForm.test.tsx}` · `src/features/profile/PreRegisterForm.tsx` · `src/features/saju/SajuForm.tsx`

## Decisions Made

- 원인 한 곳(메일 줄)만이 아니라 같은 구조(fieldset·TextField)를 모두 막았다 — 다음에 버튼 달린 줄이 생겨도 넘치지 않게

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 버튼 폭 120px 고정(#306, 메일 칸 흔들림 수정)이 이 넘침을 드러냈다 — 폭 고정은 유지

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰.
