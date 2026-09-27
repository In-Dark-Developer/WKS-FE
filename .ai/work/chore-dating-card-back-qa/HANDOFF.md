# Handoff — chore-dating-card-back-qa

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

QA(카드 뒷면) — 해금 알약이 카드 가운데 한 줄로 서고, 긴 궁합 이유가 줄을 바꾸고, 연 값이 해금 직후 바로 보인다.

## Work Completed

- 이름·학과 알약을 글줄이 아닌 카드 가운데에 둔다(Figma 112:3241 · QA '해금 시 버튼 정렬 바뀜')
- 연 값(궁합 이유 등)에 `wrap-anywhere break-keep`(QA '궁합사유 줄 바꿈')
- 해금 응답 `values` 를 loader 재조회 전 카드·잔액에 얹는다(QA '해금 시 새로고침 바로 안 됨') — loader 값이 바뀌면 버린다
- 해금됐는데 값이 null(까닭 생성 지연)인 항목은 '0개로 열기' 대신 '다시 열기'(QA '3개로 열기… 0개로')

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/card/CandidateFaces.tsx` · `recommendation/DatingCardsScreen.tsx` · `unlock/unlockFlow.ts` + 각 테스트

## Decisions Made

- 알약 가운데 정렬은 LockedValue 를 `static` 으로 두어 행(relative) 기준으로 겹친다 — ui 컴포넌트는 고치지 않았다

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 받은 신청 상세의 궁합 이유 블러는 BE 목록 응답에 까닭이 없어서다(WKS-BE §11.1 counterpart 에 reason 없음) — BE 추가 필요

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 확인
