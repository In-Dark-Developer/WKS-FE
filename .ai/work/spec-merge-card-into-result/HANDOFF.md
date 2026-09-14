# Handoff — spec-merge-card-into-result

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

PRD·04 PLAN 이 '인연카드 화면을 결과 화면에 합친다(카드 뒤집기 버튼·인스타 공유가 결과 화면)'와 '운명 카드 문구 120자·말줄임 없음'을 기술하고, 구현 Task 04/T7 이 있다.


## Work Completed

- PRD: SCR-04 관련 FR·Figma 출처, SCR-05 는 'SCR-04 에 합침', FR-3 문구 120자·말줄임 없음, FR-4 결과 화면 공유 버튼 위치, FR-5 결과 화면 카드 뒤집기·인스타 공유, FR-18 문구, Q3 카드 등급 닫힘 (commit 1ae48ed)
- 04 PLAN: Scope·Dependencies, T7 추가(Owner @jjjung0921), AC1·AC2, 메모 주석, phases 표


## Work In Progress

- 없음


## Files Changed

- `docs/PRD.md` · `docs/phases/04-share-and-card/PLAN.md` · `docs/phases/README.md`


## Decisions Made

- 소유자 결정(2026-09-15): 카드 뒤집기는 자동 연출이 아니라 버튼, `/reading/:id/card` 는 결과 화면에 합친다, 결과 화면 '친구에게 공유'는 Figma 대로 순위 빈 상태에만(인연이 생긴 뒤 진입은 추후 네비게이션 바), 운명 카드 문구는 합 120자 이내·말줄임 없음
- 카드 등급 줄은 결혼운·자녀운·연애운(`fortunes[]`) — FR-5 의 '운명운'과 Q3 `cardGrades` 를 정리했다


## Tests Executed

- 없음 (문서만). 운영 결과(제목 11자·설명 100자)를 375px 에서 말줄임 없이 그려 3줄로 스탬프와 겹치지 않음을 눈으로 확인


## Test Results

- 없음


## Known Problems

- 120자에 가까운 문구·좁은 화면(360px)에서 설명이 4줄이 되면 스탬프와 겹칠 수 있다 — 04/T7 Done when 에 '겹치지 않는다'로 넣었다
- 백엔드는 120자를 보장하지 않는다(코드·api-spec 에 제한 없음) — 필요하면 백엔드 담당에게 요청


## Unverified Assumptions

- 없음


## Exact Next Action

PR 병합 후 `scripts/ai-stream.sh open 04/T7 merge-card-into-result`.
