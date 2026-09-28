# Handoff — 10-T17-card-photo-mirror

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: nicerjs23
- To: 없음
- Date: 2026-09-28
- Phase / Task: 10/T17

## Goal

인연 카드를 뒤집어도 사진이 좌우로 뒤집혀 보이지 않는다.

## Work Completed

- 두 면에 `data-profile-card-face` 를 붙이고 `src/ui/ProfileCard.css` 를 새로 만들었다
- 접두사 붙은 `-webkit-backface-visibility: hidden` 을 건다 — Tailwind `backface-hidden` 은 접두사 없는 쪽만 낸다
- 그래도 놓치는 브라우저를 위해 뒤집기 절반(0.25s) 뒤에 보이지 않는 면을 `visibility: hidden` 으로 숨긴다

## Work In Progress

- 없음

## Files Changed

- `src/ui/ProfileCard.tsx` · `src/ui/ProfileCard.css`(새로 만듦) · `src/ui/ProfileCard.test.tsx`

## Decisions Made

- 코드에는 좌우 반전이 없다(`scale-x` 없음) — 겹쳐 둔 앞면이 뒷면에 비쳐 거울처럼 보이는 것이다. 그래서 사진을 손대지 않고 면 가리기를 고쳤다.
- 숨김은 0.25s 뒤로 미룬다 — 누르자마자 숨기면 뒤집는 절반 동안 카드가 비어 보인다. 홈 운명 카드(ConnectionCard.css)가 0.6s 뒤집기에 0.3s 를 쓴 것과 같은 규칙이다.
- 동작 줄이기 설정에서는 이 지연도 없앤다(NFR-5).

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 118 파일 693 테스트 통과, typecheck·lint 경고 없음

## Known Problems

- 실기기(iOS Safari·안드로이드 카카오톡 인앱)에서 눈으로 확인하지 못했다. 같은 증상을 홈 운명 카드가 ConnectionCard.css 주석에 남겨 뒀고 그 해법을 그대로 따랐다. 절반 뒤 숨김은 브라우저와 상관없이 먹으므로 접두사가 듣지 않아도 가려진다.

## Unverified Assumptions

- 거울 상의 원인이 WebKit 의 `backface-visibility` 누락이라는 것 — 코드에 다른 반전이 없어 남는 설명이 이것뿐이다.

## Exact Next Action

`/preview/dating-cards` 에서 카드를 뒤집어 사진 방향을 보고, 08/T6 실기기 점검 때 폰에서도 확인한다.
