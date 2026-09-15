# Handoff — 05-T7-share-flow

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/features/`·`src/api/` Owner — 리뷰)
- Date: 2026-09-15
- Phase / Task: 05/T7

## Goal

공유 링크를 받은 사람이 `/s/:shareId` 에서 주인의 궁합 지도를 보고 '내 사주 내용도 확인하기'로 (필요하면 사주 입력 뒤) 궁합이 만들어져 자기 결과로 간다 (PLAN 05/T7).

## Work Completed

- `src/api/pendingShare.ts` — sessionStorage `wks:pending-share` `{v:1, shareId}` zod 파싱
- `shareMapLoader`(`s/:shareId`, 가드 없음) — GET /shares → 주인 닉네임·친구 목록만, shareId 보관, 404/503
- `joinShareLoader`(`s/:shareId/join`) — 내 결과 없으면 `/`, 있으면 POST compatibility → 내 결과. SELF 는 내 결과로, 404 는 공통 오류, 그 밖은 '다시 시도하기' 오류(보관값 유지)
- `sajuAction` — 보관 shareId 있으면 `/s/:shareId/join` · `routes.tsx` 조립 · 테스트 16개 추가 (commit 0a01628)

## Work In Progress

- 없음 (PR 리뷰 대기)

## Files Changed

- `src/api/pendingShare.ts`(+test) · `src/features/friends/shareMapLoader.ts`·`joinShareLoader.ts`(+test)·`index.ts` · `src/features/saju/sajuAction.ts`(+test) · `src/app/routes.tsx`(+test) · PLAN T7 체크·Owner

## Decisions Made

- 궁합 생성을 `s/:shareId/join` loader 한 곳에 모았다 — SCR-06 버튼과 사주 입력 뒤 두 입구가 같은 처리·오류 화면을 쓴다(PLAN 주석 제안 채택)
- 실패 뒤 재시도는 입력 없이(소유자 채택 2026-09-15) — 오류 화면 링크가 같은 join 주소로 간다
- 친구 목록 변환이 saju `toReadingView` 와 같은 한 줄이지만 features 끼리 import 금지라 friends 에 따로 둔다
- PLAN T7 Owner → @jjjung0921 (소유자가 직접 수행)

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build` · 운영 백엔드(5173) 브라우저: 기존 테스트 링크 `/s/5a951b51…` 로 주인 지도 표시, 세션 없이 버튼 → `/`·보관값 저장, 친구 결과 세션으로 버튼 → 궁합 200 → `/reading/9058…` 순위에 테스트주인·보관값 삭제

## Test Results

- test 299 passed, typecheck·lint 경고 없음, build 성공 · 운영 흐름 모두 기대대로, 콘솔 오류 없음. 새 결과는 만들지 않았다(사주 입력 제출은 테스트 코드로만 확인)

## Known Problems

- 없음

## Unverified Assumptions

- 사주 입력 제출 → join 경로는 운영에서 제출하지 않았다(결과·LLM 호출이 생김) — 라우트·action 테스트로만 확인

## Exact Next Action

PR 병합 → 실기기 두 대로 공유 → 입력 → 양쪽 지도 확인(SC-3, AC3)
