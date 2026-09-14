# Handoff — 04-T7-card-back-first

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 04/T7

## Goal

결과 화면에 들어오면 운명 카드 뒷면부터 보이고 '카드 뒤집기'로 앞면을 연다(소유자 지시 2026-09-15).


## Work Completed

- `ResultCard` 가 `ConnectionCard initialFace="back"` · 테스트(뒷면 먼저·뒤집으면 앞면·뒷면에서도 공유는 앞면 DOM) · PRD FR-5·04 AC2 문구 (commit 3c83808)


## Work In Progress

- 없음


## Files Changed

- `src/features/share/card/ResultCard.tsx`·`.test.tsx` · `src/app/routes.test.tsx` · `docs/PRD.md` · `docs/phases/04-share-and-card/PLAN.md`


## Decisions Made

- 결과 화면에 들어올 때마다(마운트마다) 뒷면부터 — 첫 방문만 뒷면인지는 지시에 없어 매번으로 했다
- 04/T7(PR #93)이 이미 병합돼 `--reopen` 스트림으로 옮겼다


## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 목 모드 미리보기에서 뒷면·앞면 상태 각각 인스타 공유 PNG 생성, Playwright WebKit 에서 두 PNG 바이트 비교


## Test Results

- 254 tests·typecheck·lint 통과
- 들어오면 `data-face=back` · 두 상태의 PNG 가 바이트까지 같다 → 뒷면 우선이 공유 이미지에 영향 없음


## Known Problems

- 공유 PNG(1080×1920)가 헤드리스 WebKit·인앱 크로미움에서 거의 흰 이미지로 나온다 — 운영(T7 배포본)도 같은 크기라 이 변경과 무관한 기존 문제로 보인다. 실기기 확인 필요


## Unverified Assumptions

- '처음 들어오면' = 결과 화면에 들어올 때마다


## Exact Next Action

소유자 확인 후 PR. 공유 PNG 흰 이미지는 실기기로 먼저 확인.
