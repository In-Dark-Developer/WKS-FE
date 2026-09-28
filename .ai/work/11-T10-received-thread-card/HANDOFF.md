# Handoff — 11-T10-received-thread-card

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 11/T10

## Goal

상대가 먼저 운명의 실을 보낸 추천 카드가 잠긴 채로 남지 않고, 받은 신청처럼 사진·이름·학과·궁합 까닭이 실 없이 보인다.

## Work Completed

- 방식을 정해 PLAN T10 줄에 적었다 — 추천에서 빼지 않고 받은 신청처럼 열어 보인다
- `datingCardsLoader` 가 받은 요청을 id 집합이 아니라 `Map<candidateId, 요청 행>` 으로 읽는다
- 그 행의 `counterpart` 가 준 열린 사진·이름·학과·까닭으로 추천 카드를 덮는다(`openedByReceivedRequest`)
- 까닭이 아직 없으면(`locked:false` + `value:null`) 11/T9 과 같은 '만드는 중' 안내를 쓴다
- `/preview/dating-cards` 의 '상대가 먼저 실을 보냄' 상태 fixture 도 열린 값으로 맞췄다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/recommendation/recommendationsLoader.ts` · `recommendationsLoader.test.ts`
- `src/app/preview/screens/dating-cards.tsx`

## Decisions Made

- 추천에서 빼지 않는다 — Top 3 가 비어 보이고, 상대가 이미 나를 골랐다는 사실이 화면에서 사라진다.
- 해금 시트는 그대로 막아 둔다(`onOpenUnlock` 없음) — 이미 열린 항목에 비용을 물리지 않는다.
- 내가 보낸 신청(`isThreadSent`)의 잠긴 프로필은 건드리지 않는다 — 보낸 뒤에는 더 열 수 없다(FR-29). 테스트로 못 박았다.
- 11/T9 브랜치를 병합했다 — 받은 목록의 `reason` 계약과 `REASON_PENDING` 이 거기 있다. T9 의 스트림 디렉터리는 뺐다(04/T5 선례).

## Tests Executed

- `npx vitest run src/features/dating/recommendation` · `pnpm test` · `npx vitest run --pool=forks` · `pnpm typecheck` · `pnpm lint` · `pnpm build`
- 미리보기 육안 확인: `/preview/dating-cards` '상대가 먼저 실을 보냄'

## Test Results

- `--pool=forks` 전체 통과 — 116 files / 675 tests. 기본 풀에서는 `previewScreens`·`routes/index` 가 번갈아 한 번씩 실패했다가 단독 실행·forks 에서 모두 통과한다(이 기계 node 24 의 지연 import flake, 내 변경과 무관)

## Known Problems

- 없음

## Unverified Assumptions

- 11/T9 이 dev 에 먼저 병합돼야 이 PR 이 깔끔하게 올라간다 — 순서가 바뀌면 병합 충돌은 없지만 diff 에 T9 변경이 섞여 보인다.

## Exact Next Action

11/T9 병합 뒤 이 PR 을 올린다.
