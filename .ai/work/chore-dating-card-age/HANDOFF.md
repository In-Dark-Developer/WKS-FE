# Handoff — chore-dating-card-age

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

추천 카드와 요청함 상세 앞면에 MBTI 옆 나이(02년생)가 보이고, age 가 없으면 칸이 숨는다.

## Work Completed

- `age` 를 추천·요청 상대 스키마에 nullish 로 추가, `toBirthYearLabel`
- CandidateFront: 점수를 관계 유형 옆으로, 아래 줄에 MBTI·나이(Figma 448:2833)

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `src/api/schema/{dating,matchRequests}.ts` · `src/api/{dating,matchRequests}.ts`(목) · `src/features/dating/{card,recommendation,requests}/` · 미리보기

## Decisions Made

- 2026-09-27 소유자: `age` 는 생년월일 `2002-03-14` 로 가정

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · redocly · 브라우저 미리보기

## Test Results

- 625 passed, 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- WKS-BE `age` 는 아직 원격에 없다 — 형식이 다르면 스키마 파싱이 실패한다(nullish 라 없으면 괜찮다)

## Exact Next Action

WKS-BE age 배포 뒤 형식(YYYY-MM-DD) 확인.
