# Handoff — chore-kakao-inapp-external

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

카카오톡 인앱 브라우저로 들어온 방문자는 첫 화면이 뜨기 전에 기본 브라우저(iOS Safari·Android Chrome)로 넘어가, '내 결과'가 인앱 저장소에 갇히지 않는다.

## Work Completed

- 카카오톡 UA 감지 → `kakaotalk://web/openExternal?url=현재 주소` 이동 (48171b0)

## Work In Progress

- 없음

## Files Changed

- `src/lib/inAppBrowser.ts`·`src/lib/inAppBrowser.test.ts` 신규
- `src/main.tsx` 렌더 전 이동
- `docs/ARCHITECTURE.md` Persistence 한 줄

## Decisions Made

- 스킴을 모르는 구버전이면 이동이 없으므로 앱은 그대로 렌더한다(막지 않는다).
- 인스타그램 인앱은 같은 스킴이 없어 대상에서 뺐다. 안내 배너는 디자인이 필요해 이번 범위 밖.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 69 files / 369 tests 통과, typecheck·lint 경고 0

## Known Problems

- 인스타그램 인앱 방문자는 여전히 인앱 저장소에 결과가 남는다.
- 이미 카카오톡 인앱에서 만든 결과는 옮겨지지 않는다.

## Unverified Assumptions

- 카카오톡 iOS·Android 현행 버전이 `web/openExternal` 스킴을 지원한다 — 실기기 미확인.
- 이동 후 인앱 웹뷰에도 앱이 한 번 떠서 첫 페이지뷰가 두 번 잡힐 수 있다.

## Exact Next Action

병합 후 카카오톡 실기기(iOS·Android)에서 공유 링크를 열어 기본 브라우저로 넘어가는지 확인한다.
