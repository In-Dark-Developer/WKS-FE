# Handoff — 03-T7-connect-results

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/T7

## Goal

`/`가 SajuForm+action(POST /results → redirect `/reading/:id`, 연결 실패는 `{formError:'connection'}`)으로, `/reading/:id`가 세션 가드+loader(GET /results/{id} → ReadingView)로 동작하고, 404/기타 실패가 errorElement로 가며, `VITE_API_MOCK=true`로 백엔드 없이 입력→결과가 완주된다.

## Work Completed

- `toReadingView.ts`: `Result`(api) → `ReadingView`(feature) — fortunes 를 category 로 찾아 매핑(순서 무관, 누락 시 throw)
- `sajuAction.ts`: `/` action. 요청 본문을 좁혀(`unknown`→타입가드) `createResult` 호출, 성공 시 `/reading/:resultId` redirect, 실패는 모두(네트워크·스키마·백엔드 에러) 콘솔 로그 + `{formError:'connection'}`
- `readingLoader.ts`: `/reading/:id` loader. `RESULT_NOT_FOUND`는 404 Response, 그 외 실패는 콘솔 로그 + 503 Response(둘 다 errorElement 로)
- `routes.tsx`: index 라우트에 SajuForm+action, `reading/:id`에 세션가드(`requireSession`)+loader+`ReadingResult` 연결. `src/features/saju/index.ts`에 `sajuAction`·`readingLoader` re-export 추가(app은 feature index로만 접근 — ARCHITECTURE)
- `routes.test.tsx`·`App.test.tsx` 갱신 — Placeholder 제거로 깨진 기존 단언(heading "운꿰사")을 실제 화면 문구로 교체, getResult mock 추가
- **`pnpm dev`(VITE_API_MOCK=true) 를 실제로 띄우고 playwright로 입력→제출→결과 화면까지 브라우저에서 확인함** — 콘솔 에러 0개

## Work In Progress

- 없음 — 구현·테스트·실제 구동 확인 끝, push 승인 대기

## Files Changed

- `src/features/saju/toReadingView.ts`, `.test.ts`, `sajuAction.ts`, `.test.ts`, `readingLoader.ts`, `.test.ts`
- `src/features/saju/index.ts`, `src/app/routes.tsx`, `routes.test.tsx`, `src/app/App.test.tsx`(Touches 밖 — 아래 참고)

## Decisions Made

- action 실패는 kind 구분 없이 전부 `{formError:'connection'}`으로 통일했다(ARCHITECTURE Cross-cutting: "스키마 위반·네트워크 실패도 사용자에게는 같은 안내") — SajuForm이 이 모양 하나만 처리하게 만들어져 있어 새 UI 상태를 만들지 않음
- `FortuneLoading`을 `/` 제출 중 화면에 조립하지 않았다 — T7 Done-when이 "SajuForm과 action"만 명시하고 FortuneLoading 조립을 요구하지 않으며, SajuForm 자체가 이미 `submitting` 상태에서 필드 비활성+버튼 로딩을 보여준다

## Tests Executed

- `pnpm test`(37개 파일, 신규 12개 포함)·`typecheck`·`lint`·`build`
- `pnpm dev` 실사용 확인: chromium(playwright)로 `/` 접속 → 폼 작성·제출 → `/reading/:id` 도착 → 운명 카드·운세 3장·행운 장소/아이템 렌더 확인, `console --errors` 0건

## Test Results

- 165/165 통과, typecheck·lint·build 전부 통과. 실제 구동 확인도 통과

## Known Problems

- `App.test.tsx`는 Touches 밖이지만 Placeholder 제거로 기존 단언이 깨져 최소 수정(문구 1줄)했다

## Unverified Assumptions

- 없음

## Exact Next Action

소유자 push 승인 → `git merge main`(필요 시) → `scripts/ai-end.sh --ready`로 PR. 병합되면 Phase 03 전체 Task 완료.
