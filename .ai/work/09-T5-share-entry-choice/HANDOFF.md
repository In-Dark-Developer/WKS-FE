# Handoff — 09-T5-share-entry-choice

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-24
- Phase / Task: 09/T5

## Goal

공유 링크로 들어온 사용자에게 이 브라우저의 사주가 있으면 '이전 정보 불러오기'·'새로 작성하기'를 고르게 하고, 이전 정보는 재입력 없이 궁합을 만들며, 새로 작성해도 서버의 기존 결과·궁합은 지워지지 않는다 (FR-23).

## Work Completed

- 내 결과가 있는 공유 링크 진입은 궁합을 자동으로 만들지 않고 '이전 정보 불러오기 / 새로 작성하기'를 보인다
- 이전 정보 → `/s/:shareId/join`(기존 재시도 loader)이 궁합을 만들고 지도로 replace, 그동안 `ShareJoinLoading`(최소 3초)
- 새로 작성 → 기존 사주 입력 폼. 보관된 내 결과는 제출 전까지 그대로
- 입력 주소 첫 진입은 궁합을 만들지 않으므로 공통 로딩만, 3초 대기 없음

## Work In Progress

- 없음 (Figma 대조만 남음)

## Files Changed

- `src/features/friends/shareInputLoader.ts` (+test) — `ShareInputView.canReusePrevious`, 자동 join 제거
- `src/features/friends/ShareEntryChoice.tsx` (+test, 신규) · `index.ts` export
- `src/app/routes/share.routes.tsx` — `ShareInputRoute` 선택 상태, `ShareInputFallback`
- `src/app/routes/index.test.tsx` — 공유 진입 테스트 교체(Touches 추가, 소유자 승인 2026-09-24)

## Decisions Made

- 이전 정보 경로는 새 API 없이 기존 `/join` 을 재사용 — 재시도·죽은 결과 처리·대기 화면이 이미 있다
- 지도에서 뒤로가기는 전처럼 링크를 누른 곳으로 간다(join 의 replace 가 선택 화면 자리를 바꾼다)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 88 files / 442 tests 통과, typecheck 통과, lint(eslint --max-warnings=0 + prettier) 통과

## Known Problems

- 선택 화면 배치·문구는 디자인 미확인 임시안(Unverified Assumptions)
- `/preview` 에 선택 화면이 없다 — `src/app/preview/screens/share.tsx` 는 Touches 밖
- FR-15 V1(초대 티저·만료 링크 복구 경로)은 어느 Task 에도 없다 — Lead 확인 필요

## Unverified Assumptions

- Figma `4.2 기존 티저`·`4.2 새로 작성하기 버튼 누를 시` 를 보지 못했다(로그인 없음) — 선택 화면 배치·문구는 SajuForm 머리글과 기존 Button 으로 임시 구성. 디자인 확인 후 맞춘다
- "새로 작성해도 기존 데이터는 지우지 않는다" = 서버의 기존 결과·궁합을 지우지 않는다로 읽었다. 새 결과는 지금처럼 이 브라우저의 '내 결과'가 된다(`createResult` 가 덮어씀, FR-6 과 같음) — 브라우저 보관값까지 지키라는 뜻이면 `src/api/` 변경이 필요(Touches 밖)
- '쓸 수 있는 사주' = 보관된 resultId 가 있음. 죽은 id 는 joinShare 가 RESULT_NOT_FOUND 로 비우고 입력으로 보낸다(기존 동작)

## Exact Next Action

Figma `4.2` 두 화면을 받아 `ShareEntryChoice` 를 맞춘 뒤 `git merge dev` → `scripts/ai-end.sh --ready`
