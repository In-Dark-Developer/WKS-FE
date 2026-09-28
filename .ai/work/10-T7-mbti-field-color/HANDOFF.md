# Handoff — 10-T7-mbti-field-color

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @gn00py48 (강근우 · `src/ui/` Owner — Select 변경 확인) · @jjjung0921 (이정진 · Phase 10 Lead)
- Date: 2026-09-28
- Phase / Task: 10/T7

## Goal

프로필 (2/2)의 MBTI 칸이 이름·학과 같은 다른 입력 칸과 같은 배경·테두리·글자 색으로 보인다.

## Goal 밖에서 찾은 것

- **원인**: 이 폼의 TextField 들은 `className="bg-surface-default"` 로 흰 배경을 덮어쓰는데, `Select` 는 `className` 을 **감싸는 div** 에 붙여 칸(트리거 버튼)에 닿지 않았다. 그래서 MBTI 만 `appearance="soft"` 기본값인 `bg-surface-subtle` 로 남았다
- `Select` 에 `className` 을 넘기는 호출부는 없었다(grep) — 트리거로 옮겨도 깨지는 곳이 없다

## Work Completed

- `src/ui/Select.tsx` — `className` 을 여는 칸에 붙인다(감싸는 요소는 `relative` 만). 주석으로 자리를 적었다
- `DetailsStep.tsx` — MBTI Select 에 `className="bg-surface-default"`
- 테스트 둘: `Select.test.tsx`(className 이 칸에 붙는지) · `DatingProfileForm.test.tsx`(MBTI·학과 배경이 같은지)

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/ui/Select.tsx`(+테스트) · `src/features/dating/profile/DetailsStep.tsx`(+`DatingProfileForm.test.tsx`)

## Decisions Made

- 전역 기본값(`soft` = Surface/Subtle)은 건드리지 않았다 — 사주 입력·사전신청 폼은 TextField 도 subtle 이라 지금이 서로 맞다. 어긋난 곳은 소개팅 프로필 폼뿐이다
- `triggerClassName` 같은 새 prop 을 만들지 않았다 — 호출부가 기대하는 자리가 칸이고, 넘기는 곳도 없었다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 115 files / 661 passed · typecheck·lint 경고 0

## Known Problems

- **같은 문제가 (1/2) '태어난 시간' 칸에도 있다** — `SajuStep.tsx` 의 TextField 는 흰 배경인데 Select 는 subtle 이다. T7 Touches 밖이라 손대지 않았다. 같이 고칠지 알려 주세요
- 눈으로 본 확인은 하지 않았다 — 테스트가 배경 토큰을 단언한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고 10/T8(카드 규격)로 넘어간다.
