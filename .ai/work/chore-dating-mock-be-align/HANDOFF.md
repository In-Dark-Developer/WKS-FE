# Handoff — chore-dating-mock-be-align

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-24
- Phase / Task: -/-

## Goal

소개팅 카드·프로필 가짜 데이터와 뷰 타입이 WKS-BE dev ff16041 의 추천·프로필 계약으로 표현 가능한 값만 갖는다.

## Work Completed

- 잠긴 사진 썸네일 nullable(없으면 어두운 바탕), mbti 필수, preview mbti null 제거, 전화번호 앞자리 01[016789] (2bd05f5)

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/{recommendation/cardsView.ts,card/CandidateFaces.tsx,requests/requestsView.ts,requests/RequestInbox.tsx,profile/profileSchema.ts}` + 테스트 · `src/app/preview/screens/dating-{cards,requests}.tsx`

## Decisions Made

- 뷰 모델 필드 이름(id·isLocked)은 BE 이름(candidateId·locked)으로 바꾸지 않았다 — 변환은 연동 Task 몫(03/T5·T7 분담). 값 범위만 맞췄다
- 요청함 preview 의 썸네일은 그대로 — 요청함 API 가 아직 없다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 446 테스트 통과, 타입·린트 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합. 10/T1·T3 연동 때 응답 → 뷰 모델 변환에서 thumbnailUrl 은 null 로 채운다.
