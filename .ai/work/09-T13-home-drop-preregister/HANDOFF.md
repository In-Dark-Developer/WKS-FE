# Handoff — 09-T13-home-drop-preregister

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: 09/T13

## Goal

홈에 GRAND OPEN 사전신청 섹션과 그 모달 주소가 없다.

## Work Completed

- HomeScreen 티저·onPreRegister, ReadingResult teaser 슬롯·Outlet, /reading/:id/pre-register 라우트, layout.css 티저 리본 규칙 제거

## Work In Progress

- 없음

## Files Changed

- `src/app/screens/HomeScreen.tsx` · `src/features/saju/ReadingResult.tsx` · `src/app/routes/saju.routes.tsx` · `src/app/layout.css` · 미리보기·테스트

## Decisions Made

- /verify(이미 나간 사전신청 인증 메일 도착지)는 남긴다. features/profile 의 사전신청 폼·모달·티저·폰트는 앱에서 쓰이지 않게 됐지만 지우지 않았다(후속 판단). PRD FR-9 는 spec 후속

## Tests Executed

- test 622 · typecheck · lint · 브라우저 미리보기(홈이 운세에서 끝남)

## Test Results

- 전부 통과, 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음
