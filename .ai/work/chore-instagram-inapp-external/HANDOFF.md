# Handoff — chore-instagram-inapp-external

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

인스타그램 인앱 방문을 기본 브라우저로 넘긴다

## Work Completed

- 인스타그램 UA 면 iOS `x-safari-https://`, Android Chrome intent 로 이동 (9e594ee)
- 기본 브라우저에서 만든 결과로 자기 링크를 인스타에서 열면 다시 사주를 입력하던 문제 대응

## Work In Progress

- 없음

## Files Changed

- `src/lib/inAppBrowser.ts`(`kakaoTalkExternalUrl` → `externalBrowserUrl`)·테스트
- `src/main.tsx` · `docs/ARCHITECTURE.md` Persistence

## Decisions Made

- Android intent 는 `#Intent` 와 겹쳐 원래 주소의 해시를 뺀다(라우팅은 경로만 쓴다).
- intent 에 fallback 주소를 두지 않는다 — 인앱에서 다시 열려 이동이 반복된다. Chrome 이 없으면 이동이 없다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 69 files / 371 tests 통과, typecheck·lint 경고 0

## Known Problems

- iOS 16 이하 인스타 인앱은 넘기지 못한다.
- iOS 에서 Chrome 으로 만든 결과는 Safari 로 넘어가도 저장소가 달라 다시 입력한다.

## Unverified Assumptions

- 인스타그램 iOS 인앱이 `x-safari-https://` 이동을 막지 않는다 — 실기기 미확인.
- 인스타그램 Android 인앱이 Chrome intent 를 연다 — 실기기 미확인.

## Exact Next Action

병합 후 인스타그램 인앱 iOS·Android 실기기에서 자기 공유 링크를 열어 기본 브라우저로 넘어가는지 확인한다.
