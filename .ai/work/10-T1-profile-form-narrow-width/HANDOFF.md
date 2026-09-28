# Handoff — 10-T1-profile-form-narrow-width

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: nicerjs23
- To: 없음
- Date: 2026-09-29
- Phase / Task: 10/T1

## Goal

프로필 (2/2)가 좁은 화면에서도 화면 폭을 따라 줄어든다.

## Work Completed

- `DetailsStep` 의 `<fieldset>` 에 `min-w-0` 을 줬다 (Chrome, 폭 357px 아래)
- `<fieldset>` 을 배치에서 빼고 안쪽 `div` 가 세로로 쌓게 했다 (Safari, 넓은 창에서도 남)
- 회귀 테스트 1개 — `fieldset` 이 flex 가 아니고 안쪽 div 가 쌓는지 단언한다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/profile/DetailsStep.tsx` · `DatingProfileForm.test.tsx`

## Decisions Made

- 원인은 브라우저 기본값 `fieldset { min-inline-size: min-content }` 다. 칸 너비가 325px 에 묶여, 쓸 수 있는 폭이 그보다 좁아지는 화면(약 357px 아래)에서 통째로 오른쪽으로 나갔고 `[data-app-shell]` 의 `overflow-x: clip` 이 잘라 냈다.
- 안쪽 요소는 이미 줄어들 수 있었다(`min-w-0 flex-1`) — 막고 있던 것은 `fieldset` 하나였다.
- 실측은 헤드리스 Chrome + CDP 로 했다. 320px 에서 칸이 325px, 고친 뒤에는 430·320px 모두 넘치는 요소가 없다.
- Safari 는 원인이 다르다 — `min-w-0` 만으로는 부족하고, flex 로 쓴 `fieldset` 의 폭을 WebKit 이 내용 전체 폭으로 잡는다. 그래서 `fieldset` 은 배치에서 빼고 `disabled` 묶음 역할만 남겼다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 헤드리스 Chrome 실측(430·375·360·320·280px)

## Test Results

- 118 파일 708 테스트 통과, typecheck·lint 경고 없음. 실측에서 320·280px 넘침 0

## Known Problems

- Safari 를 로컬에서 돌려 보지 못했다 — `safaridriver` 가 'Allow remote automation' 을 요구한다. 배포 미리보기(deploy-preview-324)에서 소유자가 눈으로 확인한다.
- `src/features/saju/SajuForm.tsx` 의 `<fieldset>` 도 flex 로 쓰고 있어 Safari 에서 같은 증상이 날 수 있다. Touches 밖이라 손대지 않았다. 원래 적었던 min-content 건과 같은 파일이다. 지금은 min-content 가 작아 320px 에서도 넘치지 않아 손대지 않았다(Touches 밖). 그 화면에 폭 있는 칸이 생기면 같은 증상이 난다.
- 360px 에서 칸이 325px 라 여유가 3px 뿐이었다 — 이번 수정으로 화면 폭을 따라간다.

## Unverified Assumptions

- 없음

## Exact Next Action

배포 미리보기 https://deploy-preview-324--wks-fe.netlify.app/dating/profile?step=2 를 Safari 로 열어 확인한다.
