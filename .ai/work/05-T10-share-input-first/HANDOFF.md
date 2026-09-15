# Handoff — 05-T10-share-input-first

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/features/`·`src/api/` Owner — 리뷰) · @gn00py48 (`src/ui/` 아이콘 — 리뷰)
- Date: 2026-09-15
- Phase / Task: 05/T10

## Goal

공유 링크가 '입력(첫 방문 인트로) → 결과 대기 → 결과·궁합 → 주인 궁합 지도(뒤로가기) → 내 사주' 로 동작한다 (PLAN 05/T10).

## Work Completed

- `/s/:shareId` = 인트로 + `SajuForm`(링크 주인 닉네임 설명·'운명 지도 확인하기') · 제출하면 결과·궁합을 한 번에 만들고 `/s/:shareId/map` · 결과 있고 이 탭 기록 없으면 입력 loader 가 궁합 후 replace 로 지도
- `/s/:shareId/map` = 뒤로가기(`navigate(-1)`) + 방문자 지도 + '내 사주 내용도 확인하기' · 결과 없으면 입력으로
- `/s/:shareId/join` = 궁합 재시도 전용(replace) · `SajuForm` 제출 중 `FortuneLoading`(`/` 도) · `joinedShares`(sessionStorage) · `createSajuAction` · 뒤로가기 아이콘 (commit 7851f37, b44fa5d)

## Work In Progress

- 없음 (PR 리뷰 대기)

## Files Changed

- `src/api/joinedShares.ts`(+test, `pendingShare` 삭제) · `src/features/friends/{shareInputLoader,shareMapLoader,joinShareLoader}.ts`(+test)·`index.ts`·`map/CompatibilityMapScreen.tsx`(+test) · `src/features/saju/{SajuForm.tsx,sajuAction.ts,index.ts}`(+test) · `src/app/routes.tsx`(+test) · `src/app/preview/screens/map.tsx` · `src/ui/assets/icons/angle-small-left.svg`

## Decisions Made

- 궁합 생성을 공유 입력 action·입력 loader 가 직접 한다 — 처음엔 join 경로를 거쳤으나 제출 뒤 loader 가 replace 로 이동하면 입력 페이지 기록까지 덮여, push 면 join 기록이 남아 뒤로가기가 다시 지도로 튕겼다(브라우저로 확인). 이제 입력→지도가 한 번의 이동이라 기록이 [입력, 지도]
- 입력을 건너뛴 진입은 replace — 기록이 [링크 누른 곳, 지도]라 뒤로가기가 채팅 앱 등으로 간다
- join 은 연결 실패 재시도 전용. 입력 파싱 중복을 피하려 `shareSajuAction.ts` 대신 `createSajuAction` 에 다음 경로를 주입
- 보관 모듈 이름 `pendingShare` → `joinedShares`(뜻이 바뀜)

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build` · 운영 백엔드(5173): 입력 화면 부제에 주인 닉네임, 기존 결과 세션으로 링크 → 지도·기록 저장 · 목 서버(3002): 입력 제출 → 지도(idx 1) → 뒤로가기 → 입력 폼(idx 0) → 앞으로 → '내 사주 내용도 확인하기' → 결과 화면, 결과 있는 새 진입 → 지도(idx 0, replace)

## Test Results

- test 315 passed, 경고 없음, build 성공 · 브라우저 흐름 모두 기대대로, 콘솔 오류 없음. 결과 대기 화면은 목 응답이 즉시라 브라우저에서는 못 봤고 컴포넌트·라우트 테스트로 확인

## Known Problems

- 링크를 새 창에서 바로 열어 이전 페이지가 없으면 지도의 뒤로가기가 아무 데도 가지 않는다(브라우저 제약) · 720:3653 부제 문구 기획 확인 필요

## Unverified Assumptions

- 실기기 인앱 브라우저(카카오톡)에서 `history.back()` 이 채팅으로 돌아가는지 — 08/T6 에서 확인

## Exact Next Action

PR 병합 → 실기기 두 대로 공유 → 입력 → 지도 → 뒤로가기 → 내 사주 확인(SC-3)
