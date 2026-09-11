# Handoff — 01-T2-owners

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: 01/T2

## Goal

모든 Task에 소유자가 있고, 두 사람이 같은 파일을 동시에 건드릴 일이 없다.

## Work Completed

- `docs/ARCHITECTURE.md` Module Boundaries Owner: app·docs @jjjung0921 / ui·lib @gn00py48 / api·features @nicerjs23
- `.github/CODEOWNERS` 생성 (표에서 생성 — 손으로 고치지 않는다)
- Phase 01~08 Lead와 Task Owner 배정, `docs/phases/README.md` 표 재생성
- Notion 보드 Task 행 21개의 Owner 열을 같은 배정으로 채움

## Work In Progress

- 없음

## Files Changed

- `docs/ARCHITECTURE.md` · `.github/CODEOWNERS` · `docs/phases/0{1..8}-*/PLAN.md` · `docs/phases/README.md`

## Decisions Made

- **모듈 Owner = 리뷰 책임**, **Touches = 쓰기 배타성**. 둘을 분리했다 — 남의 모듈 파일이라도 내 Touches 안이면 내가 쓰고 리뷰만 그 모듈 Owner가 한다. ARCHITECTURE에 한 줄로 적었다
- 한 Phase의 Lead와 그 Phase Task를 한 사람에게 몰지 않았다. Phase 02·03은 세 명이 동시에 들어간다
- 03/T3이 `src/app/routes.tsx`를 단독 소유한다(기존 설계) — 라우트 파일 충돌을 막는 유일한 방법이라 Owner도 app 모듈 소유자에게 줬다

## Tests Executed

- `ai-stream.sh codeowners --check`, `ai-stream.sh phases --check`, Task별 Touches 교차 확인

## Test Results

- 둘 다 통과. 동시에 열릴 수 있는 Task들(02 T2~T5, 03 T1~T5) 사이에 겹치는 파일 없음

## Known Problems

- **@gn00py48·@nicerjs23 가 저장소 Collaborator 가 아니다.** CODEOWNERS 는 쓰기 권한 있는 사람만 인식하므로 초대 전까지 그 줄들은 무시된다 (GitHub 이 CODEOWNERS 경고를 띄운다)
- Collaborator 목록에 @hairyung2002 가 있는데 이번 배정에는 없다 — 팀원이면 배정이 필요하고 아니면 권한을 내려야 한다
- Phase 01 T4 의 Touches 가 `src/`, `tests/` 로 넓다. 01 이 끝난 뒤 02·03 이 시작하므로 충돌하지 않지만, T4 가 늦어지면 모두가 막힌다

## Unverified Assumptions

- 세 사람의 가용 시간이 비슷하다고 보고 Task 수를 7·6·8로 맞췄다. 실제 부하는 Phase 02·03 진행 후 재조정
- @gn00py48·@nicerjs23 의 GitHub 핸들이 이 사람들 계정이 맞다 (핸들 존재는 확인, 본인 여부는 미확인)

## Exact Next Action

두 사람을 Collaborator로 초대하고, PR을 병합한 뒤 01/T3·T4를 연다.
