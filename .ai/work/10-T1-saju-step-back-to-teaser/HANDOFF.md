# Handoff — 10-T1-saju-step-back-to-teaser

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: nicerjs23
- To: 없음
- Date: 2026-09-29
- Phase / Task: 10/T1

## Goal

프로필 (1/2)의 뒤로가기가 QA 가 말한 곳 — 메인 티저(SCR-01 `/`)로 간다.

## Work Completed

- (1/2)의 뒤로가기 목적지를 `/dating` 인트로 → `/` 메인 티저로 바꿨다 (PR #318 에서 잘못 잡은 곳을 고친다)
- (2/2)의 뒤로가기는 손대지 않았다 — 전처럼 들어온 길로 간다
- 테스트 두 개의 기대 경로를 `/` 로 바꾸고, 메모리 라우터에 `/` 자리를 더했다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/entry/DatingProfileScreen.tsx` · `DatingProfileScreen.test.tsx`

## Decisions Made

- QA 의 '0. 사이트 진입'이 어느 화면인지는 `docs/prd/20-screens.md` 가 정한다 — SCR-01 이 「0. 사이트 진입(teaser)」이고 주소는 `/` 다.
- 티저 경로는 `MAIN_TEASER_PATH` 상수로 이 파일에 둔다 — 소개팅 경로가 아니라 `datingEntry.ts` 에 넣지 않았다.
- `replace: true` 는 그대로다. 인트로 영상은 첫 방문에만 뜨므로(`IntroGate`) 돌아가도 다시 재생되지 않는다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 118 파일 706 테스트 통과, typecheck·lint 경고 없음

## Known Problems

- 10/T1 은 여전히 `[ ]` 다 — 실서버 검증이 남아 있다.

## Unverified Assumptions

- 없음

## Exact Next Action

목 모드 로컬에서 `/dating` → (1/2) → 뒤로가기가 메인 티저로 오는지 본다.
