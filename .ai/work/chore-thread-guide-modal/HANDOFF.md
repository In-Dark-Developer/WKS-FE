# Handoff — chore-thread-guide-modal

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

소개팅 상단 운명의 실을 누르면 재화 안내 모달이 뜨고, 사이트 접속 때 출석 실이 지급된다.

## Work Completed

- `ThreadGuideDialog` — 획득 방법 4행, 받은 방법은 지급 완료(445:2701), X·배경으로 닫기
- `DatingHeader` 운명의 실 버튼, `DatingCards` 가 모달 상태를 가진다
- `ensureDailyCheckIn` — RootLayout 접속 시 1회, 카드 loader 는 끝난 뒤 잔액을 읽는다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/wallet/` · `recommendation/{DatingHeader,DatingCards,cardsView,recommendationsLoader}` · `src/api/wallet.ts` · `src/app/RootLayout.tsx` · `src/ui/assets/dating/earn-*.webp`·`thread-guide-yarn.webp` · 미리보기·테스트

## Decisions Made

- 2026-09-27 소유자: 개수는 백엔드 값(10·5·3·10), 하단 로그인 버튼 없이 닫기만, 출석은 사이트 접속 시 자동
- Figma 원시 색 #f9ede9·#e96143 은 토큰이 아니라 rose-100 · rose-200/rose-700 으로 대신했다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 브라우저 /preview/dating-cards 재화 안내 2상태, 목 모드 접속 출석

## Test Results

- 622 passed, 경고 없음. 모달 Figma 대조 확인

## Known Problems

- 목 모드 출석은 비로그인이어도 지급한다(기존 목 동작) — 실서버는 401 로 넘긴다

## Unverified Assumptions

- 없음

## Exact Next Action

없음
