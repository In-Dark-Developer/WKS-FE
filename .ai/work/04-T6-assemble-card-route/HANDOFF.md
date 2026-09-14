# Handoff — 04-T6-assemble-card-route

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (`src/app/` Owner — 이 PR 리뷰) · @gn00py48 (Phase 04 Lead — 04/T6 이 마지막 Task, 병합 후 phase-04-close)
- Date: 2026-09-14
- Phase / Task: 04/T6

## Goal

결과 화면(SCR-04)의 `share` 슬롯에서 인연카드 화면(SCR-05 `/reading/:id/card`)으로 들어가고 돌아올 수 있으며, '친구에게 공유'(04/T3)가 결과 화면에서 동작한다 — 두 화면 모두 `GET /results/{id}` 응답을 뷰 모델로 받아 그린다.

## Work Completed

- `/reading/:id/card` 라우트 등록(세션 가드 + `cardLoader`)과 결과 화면 `share` 슬롯 조립 — commit 728c168

## Work In Progress

- 없음 (소유자 push 승인 대기)

## Files Changed

- `src/app/routes.tsx` — `ResultShare`·`ConnectionCardRoute`·`protectedCardLoader`, `reading/:id/card` 등록
- `src/features/share/cardLoader.ts`(신규)·`index.ts` — `Result` → `CardView`
- `src/features/saju/readingView.ts`·`toReadingView.ts` — `shareId` 추가(Touches 밖, 소유자 승인)
- 픽스처: `src/app/preview/screens/reading.tsx`·`ReadingResult.test.tsx`·`toReadingView.test.ts`

## Decisions Made

- `/reading/:id/card` 는 `reading/:id` 의 **형제 라우트**로 등록한다(자식 아님). `ConnectionCardScreen` 은 자기 `<h1>` 을 가진 전체 화면이라 `ReadingResult` 의 `<Outlet />`(03/T5) 안에 넣으면 결과 화면 아래에 덧붙어 그려진다. `<Outlet />` 은 06/T3 의 사전신청 모달용으로 남겨 둔다.
- 카드 화면은 자기 loader(`cardLoader`)로 `GET /results/{id}` 를 다시 부른다 — 형제 라우트라 부모 loader 데이터를 못 쓴다.
- 등급 라벨(결혼운·자녀운·연애운)은 `cardLoader` 가 직접 만든다 — `features ↔ features` import 금지라 saju 의 `fortuneOrder` 를 쓸 수 없다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`
- `VITE_API_MOCK=true pnpm dev` + playwright: 입력 → 결과 → 인연카드 → 뒤집기 → 결과 복귀

## Test Results

- 247 passed (53 files) — cardLoader 5개·routes 4개 신규. typecheck·lint·build 경고 0
- 브라우저 확인: 카드 화면이 결과를 대체해 뜨고 복귀까지 동작, 콘솔 에러 0

## Known Problems

- `src/features/saju/ReadingResult.tsx`(03/T5) 주석이 "하위 라우트(인연카드·사전신청 모달)는 <Outlet /> 에 뜬다"고 적고 있으나 인연카드는 형제 라우트가 됐다 — 주석만 실제와 다르다(Touches 밖이라 고치지 않음). @jjjung0921 확인 요청.
- `ConnectionCardScreen` 의 sr-only `<h1>` 과 `DestinyCard` 의 `<h2>` 가 이름이 같아("…님의 인연카드") 접근성 트리에 같은 이름이 둘이다(04/T5 범위).

## Unverified Assumptions

- 인연카드 진입점 문구 '인연카드 보기'와 '결과로 돌아가기'는 디자인에 근거가 없다 — 디자인에 인연카드 전용 화면 자체가 없어서(04/T5 주석) 임의로 정했다.

## Exact Next Action

소유자 push 승인 → `ai-end.sh --ready --pr` 로 PR 생성.
