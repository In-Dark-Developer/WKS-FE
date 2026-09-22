# Handoff — chore-screen-assembly-ssot

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-22
- Phase / Task: -/-

## Goal

화면 조립이 한 곳(`src/app/screens/`)에만 있고 라우트와 `/preview` 가 그것을 함께 쓴다. 겸해서 CI 러너-분을 줄인다.

## Work Completed

- `src/app/screens/` 신설: `BackRow` · `ReadingScreen` · `MyMapScreen` · `SharedMapScreen` · `ShareInputScreen` (순수 props, 라우터 훅 없음)
- `routes.tsx` 362 → 284줄. 마크업·문구 없이 loader 데이터와 이동만 잇는다
- preview 3개가 같은 조립을 쓴다. `/preview/reading` 에 없던 순위·공유·티저가 보이고, `map` 의 뒤로가기 스텁이 실제 `BackRow` 가 됐다
- 중복 preview 상태 2개 제거, SCR-06 공유 링크 입력 상태 추가
- CI: `concurrency` 취소 · 매트릭스 3 job → `commands` 1 job · 코드 없는 PR 은 node 단계 건너뜀 · `notion-sync` 의 PR `synchronize` 중복 발화 제거

## Work In Progress

- 없음

## Files Changed

- `src/app/screens/*.tsx` (신규 5) · `src/app/routes.tsx` · `src/app/preview/screens/{reading,map,saju}.tsx`
- `.github/workflows/ci.yml` · `.github/workflows/notion-sync.yml`

## Decisions Made

- 조립은 `app` 이 갖는다(ARCHITECTURE Module Boundaries 그대로) — features 끼리 import 하지 않는다. 경계 변경 없음
- `IntroGate` 는 라우트에 남겼다 — 첫 방문 게이트는 진입 관심사이지 화면이 아니다
- CI `edited` 트리거는 남겼다 — `ai-check` 가 제목·본문 규격을 보는 필수 검사라, 빼면 제목을 고쳐도 재검사가 돌지 않아 PR 이 빨간 채로 갇힌다
- 코드 없는 PR 에서 job 을 skip 하지 않고 성공으로 끝낸다 — skip 된 필수 검사는 병합을 막는다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`
- 개발 서버에서 `/preview/reading` · `/preview/map` 모바일 뷰포트 확인
- 스코프 게이트를 병합된 136개 PR 에 리플레이

## Test Results

- 371 passed / 69 files, typecheck·lint 통과. `routes.test.tsx` 28개가 그대로 통과 — 라우트 동작 불변
- 콘솔 에러 없음. 스코프 게이트: 82 실행 / 54 건너뜀(40%)

## Known Problems

- 활성 스트림 `chore-reading-back-always` 가 `src/app/routes.tsx` · `routes.test.tsx` · `preview/screens/reading.tsx` 를 함께 만진다 — 병합 전 `git merge main` 이 필요하다
- 2026-09-17 ~ 이 스트림 이전까지 Actions 가 지출 한도로 막혀 있었다(job step 0개, "The job was not started because recent account payments have failed or your spending limit needs to be increased"). 그 사이 병합분은 CI 검사를 받지 않았다

## Unverified Assumptions

- 지출 한도가 영구적으로 풀렸는지는 확인하지 못했다 — 이 스트림의 run 은 정상 실행됐다

## Exact Next Action

PR 리뷰를 받고, `chore-reading-back-always` 가 먼저 병합되면 `git merge main` 으로 `routes.tsx` 를 맞춘다.
