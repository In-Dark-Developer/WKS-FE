# Handoff — 10-T1-profile-form-narrow-width

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: nicerjs23
- To: 없음
- Date: 2026-09-29
- Phase / Task: 10/T1

## Goal

프로필 (2/2)가 좁은 화면에서도 화면 폭을 따라 줄어든다.

## Work Completed

- `DetailsStep` 의 `<fieldset>` 에 `min-w-0` 을 줬다
- 회귀 테스트 1개 — 칸 묶음이 줄어들 수 있는지 클래스로 단언한다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/profile/DetailsStep.tsx` · `DatingProfileForm.test.tsx`

## Decisions Made

- 원인은 브라우저 기본값 `fieldset { min-inline-size: min-content }` 다. 칸 너비가 325px 에 묶여, 쓸 수 있는 폭이 그보다 좁아지는 화면(약 357px 아래)에서 통째로 오른쪽으로 나갔고 `[data-app-shell]` 의 `overflow-x: clip` 이 잘라 냈다.
- 안쪽 요소는 이미 줄어들 수 있었다(`min-w-0 flex-1`) — 막고 있던 것은 `fieldset` 하나였다.
- 실측은 헤드리스 Chrome + CDP 로 했다. 320px 에서 칸이 325px, `min-w-0` 뒤에는 넘치는 요소가 없다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 헤드리스 Chrome 실측(430·375·360·320·280px)

## Test Results

- 118 파일 708 테스트 통과, typecheck·lint 경고 없음. 실측에서 320·280px 넘침 0

## Known Problems

- `src/features/saju/SajuForm.tsx` 의 `<fieldset>` 도 같은 기본값을 쓴다. 지금은 min-content 가 작아 320px 에서도 넘치지 않아 손대지 않았다(Touches 밖). 그 화면에 폭 있는 칸이 생기면 같은 증상이 난다.
- 360px 에서 칸이 325px 라 여유가 3px 뿐이었다 — 이번 수정으로 화면 폭을 따라간다.

## Unverified Assumptions

- 없음

## Exact Next Action

QA 가 쓴 기기 폭을 확인하고, 그 폭에서 다시 본다.
