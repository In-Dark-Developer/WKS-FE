# Handoff — chore-partner-entry-modal

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성한다. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: 10/T20

## Goal

축제 배너로 들어온 사람이 로그인해야 실을 받는다는 것을 로그인 전에 알고, 지급 결과도 소개팅 밖에서 본다.

## Work Completed

- `PartnerEntryDialog` (SCR-23 1.1, Figma 234:2797) — 메인 티저 위에 뜨고 로그인으로 보낸다
- `partnerRef.ts` — `hasPartnerRef` · `markPartnerEntrySeen` · `wasPartnerEntrySeen` 추가
- `PendingRewardDialog` 을 `DatingLayout` 에서 `RootLayout` 으로 옮김(`onDone` 으로 소개팅 이동)
- `ThreadGuideDialog` 의 '친구에게 공유' 줄 — Figma 522:2791 개정본('지도 등록한 친구가 로그인 시' · +2)

## Work In Progress

- 없음

## Files Changed

- commit c4623fd 참조 (src/features/dating/reward/, src/features/auth/, src/app/)

## Decisions Made

- 모달을 넘겨도 `wks:partner-ref` 는 지우지 않는다 — 나중에 로그인해도 받아야 한다
- 코드 보관을 `mainTeaserLoader` 에서도 한다 — RootLayout 의 effect 는 첫 렌더 뒤에 돈다
- 저장소는 sessionStorage 를 그대로 둔다 — 범위 밖 변경이다

## Tests Executed

- `npx vitest run --pool=forks` · `pnpm typecheck` · `pnpm lint`
- 브라우저: `/?ref=FESTIVAL` 진입·넘기기·재방문, `/preview/dating-cards`

## Test Results

- 717 중 716 통과 — 실패한 `openingGate.test.ts` 는 이 변경 전(stash)에도 같이 실패하는 node v24 ICU 로케일 문제다
- typecheck · lint 통과

## Known Problems

- 백엔드 `MapFriendRewardService` 는 아직 '친구 5명당 +3' 이라 화면의 '+2' 와 어긋난다 — 백엔드 수정이 필요하다(10/T18)
- 익명 결과를 반복 생성해 실을 무한히 쌓는 길이 열려 있다(공유 링크 입력 반복) — 백엔드 상한·로그인 조건이 막아야 한다
- 모달의 '보유 10개' 는 Figma 그대로지만 로그인 전에는 실제 보유가 0 이다 — 디자이너 확인 필요

## Unverified Assumptions

- 축제 배너의 실제 주소에 `?ref=FESTIVAL` 이 붙어 있다고 가정했다 — 최선우 확인 필요
- Figma 의 +2 가 백엔드가 쓸 최종 개수라고 보았다

## Exact Next Action

PR 을 dev 로 올린다.
