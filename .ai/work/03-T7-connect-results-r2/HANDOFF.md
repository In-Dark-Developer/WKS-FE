# Handoff — 03-T7-connect-results-r2

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 03/T7

## Goal

결과 화면(`/reading/:id`)의 `ranking` 슬롯에 `FriendRanking`(05/T2)이 실제 궁합 데이터로 채워진다 — 03/T5 Done-when·05/T2 커밋 메모가 요구했지만 최초 T7 merge에서 빠졌던 부분.

## Work Completed

- `readingView.ts`: `ReadingView`에 `compatibilities?: readonly CompatibilitySummary[]` 추가(api 타입 재사용 — saju는 friends feature를 import하지 않으므로 friends 쪽 `Friend` 타입 대신 api 계약 타입을 그대로 씀)
- `src/api/schema/result.ts`: `CompatibilitySummary` 타입을 export하도록 한 줄 추가(원래 스키마만 export, 인퍼드 타입이 없었음 — Touches 밖이지만 최소·비파괴적 추가)
- `toReadingView.ts`: `result.compatibilities`를 그대로 전달
- `routes.tsx`: `@/features/friends`에서 `FriendRanking` import, `ReadingResultRoute`가 `ranking={<FriendRanking friends={view.compatibilities ?? []} limit={3} />}`로 조립
- 테스트: `toReadingView.test.ts`에 compatibilities 전달 확인 테스트 추가(+기존 스냅샷형 테스트 갱신), `routes.test.tsx`에 빈 상태·데이터 있는 상태 둘 다 렌더 확인 추가
- **`pnpm dev`(VITE_API_MOCK=true)+playwright로 실제 결과 화면에 "친구 궁합 순위" 섹션이 뜨는 것 확인**(목 응답은 항상 compatibilities:[]라 빈 상태만 실제 확인, 데이터 있는 경우는 유닛 테스트로 커버). 콘솔 에러 0

## Work In Progress

- 없음 — 구현·테스트·실사용 확인 끝, push 승인 대기

## Files Changed

- `src/features/saju/readingView.ts`, `toReadingView.ts`, `toReadingView.test.ts`
- `src/app/routes.tsx`, `routes.test.tsx`
- `src/api/schema/result.ts`(Touches 밖, 타입 export 한 줄)

## Decisions Made

- `ReadingView.compatibilities`를 `friends` feature의 `Friend` 타입이 아니라 `api/schema/result`의 `CompatibilitySummary`로 뒀다 — saju가 다른 feature를 import하면 안 되기 때문(ARCHITECTURE). `CompatibilitySummary`(4필드: nickname·score·tier·createdAt)는 `Friend`(3필드)의 구조적 상위집합이라 `routes.tsx`에서 캐스트 없이 그대로 넘길 수 있다(app 레이어는 두 feature 다 import 가능)
- `emptyAction`(FriendRanking의 "인연 없을 때" 버튼 슬롯)은 비워뒀다 — 공유 버튼(Phase 04)이 아직 결과 화면에 조립 안 됨, 별도 스코프

## Tests Executed

- `pnpm test`(45개 파일, 203 tests)·`typecheck`·`lint`·`build`
- `pnpm dev` 실사용 확인(playwright): 입력→제출→결과 화면에서 순위 섹션 렌더 확인

## Test Results

- 203/203 통과, typecheck·lint·build 전부 통과. 실제 구동 확인도 통과(콘솔 에러 0)

## Known Problems

- 목 응답이 compatibilities를 항상 빈 배열로 줘서, 데이터가 있는 실제 화면은 브라우저로 직접 보지 못했다(유닛 테스트로만 확인) — 실제 백엔드 연동 후 재확인 필요

## Unverified Assumptions

- 없음

## Exact Next Action

소유자 push 승인 → `scripts/ai-end.sh --ready`로 PR(원본 03/T7 PR #68을 참고로 남김).
