# Handoff — chore-grand-open-band

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

결과 화면 사전신청 띠의 글자 색이 Figma 와 같고 띠 뒤에 별자리 리본이 없다.

## Work Completed

- 제목: Primary 500 글자 칠 + Primary 200→700 방사형 20% + 청록 그림자 두 겹
- 날짜·서비스명 Neutral 0, 안내 Neutral 50
- 띠 높이 428px(위 64px 비움), `layout.css` 가 `:has([data-pre-register-teaser])` 일 때 리본을 띠 윗변에서 끝낸다

## Work In Progress

- 없음

## Files Changed

- `src/features/profile/PreRegisterTeaser.tsx` · `src/features/profile/PreRegisterTeaser.css` · `src/app/layout.css`

## Decisions Made

- 리본 종료점은 띠 높이 + ReadingResult pb-24 + 콘텐츠 아래 여백으로 계산한다 — JS 측정 없이 CSS 로 끝낸다

## Tests Executed

- test·lint·typecheck·build (exit code) · 목 모드 브라우저에서 리본 끝과 띠 윗변 측정

## Test Results

- 모두 exit 0 · 리본 bottom 468px = 띠 윗변~main 아래 468px

## Known Problems

- Figma 띠에는 달·연꽃 패턴(873:4063)이 있으나 요청 범위 밖이라 넣지 않았다
- ReadingResult 의 pb-24 나 콘텐츠 여백이 바뀌면 layout.css 의 계산식도 고쳐야 한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 배포본에서 결과 화면 맨 아래를 눈으로 확인한다.
