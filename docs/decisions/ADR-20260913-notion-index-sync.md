# ADR-20260913: Notion 요구사항·ADR 색인은 main 의 사본이다 — CI 가 갱신한다

- Status: Accepted
- Date: 2026-09-13
- Deciders: @jjjung0921 (제안) / 리뷰어는 PR 승인자

## Context

Notion 「운꿰사」에는 저장소에서 복사해 온 색인 세 개가 있다 — `✅ Task 보드`, `🙋 요구사항 색인 (PRD)`, `🏛️ ADR 색인`. Task 보드는 ADR-20260912-notion-task-board-sync 로 CI 가 맞추지만, 나머지 둘은 "에이전트에게 '노션 색인 동기화'라고 하면" 맞추는 수동 절차였다. 2026-09-13 하루 동안 PRD 가 네 번(#13·#15·#16·#18) 바뀌었고 색인은 그중 한 번만 따라갔다. 회의 중에 낡은 색인을 보고 논의하면 결정이 어긋난다.

## Problem

`docs/PRD.md` 의 FR·NFR 표와 `docs/decisions/ADR-*.md` 가 바뀔 때 Notion 색인이 사람 손 없이 따라오게 하되, 저장소가 원본이라는 원칙(Notion 페이지 머리말)을 깨지 않는다.

## Alternatives

1. **지금처럼 수동** — 잊힌다. 실제로 잊혔다.
2. **Notion 을 원본으로 하고 저장소로 내려받기** — 에이전트는 Notion 을 읽지 않는다(AGENTS.md Rule 1·2). 방향이 거꾸로다.
3. **main push 마다 CI 가 저장소 → Notion 단방향 upsert** — Task 보드와 같은 방식. 색인에서 고친 값은 다음 push 에 덮어써진다.

## Decision

3번을 택한다. `scripts/notion-index-sync.sh` 가 `docs/PRD.md` 의 `| FR-n |`·`| NFR-n |` 행과 `docs/decisions/ADR-*.md` 를 읽어 각 색인 DB 에 ID(`ID`·`번호`)로 upsert 하고, `.github/workflows/notion-index-sync.yml` 이 main 의 `docs/PRD.md`·`docs/decisions/**`·`docs/phases/**` 변경마다 실행한다(`workflow_dispatch` 로 수동 실행 가능).

- 요구사항 색인: `요구사항`(FR 본문, NFR 은 "본문 — Target") · `구분` · `우선순위`(FR 만) · `Phase`(그 ID 를 언급하는 `docs/phases/*/PLAN.md` 의 번호, `03·05`) · `상태`(그 Phase 들의 Status — 전부 DONE 이면 완료, 하나라도 IN_PROGRESS/REVIEW 면 구현중, 아니면 계획).
- ADR 색인: `결정`(H1) · `번호`(파일명) · `상태`(Status 줄) · `GitHub`(main blob 링크) · `한 줄 요약`(Decision 절 첫 두 줄). **`영역` 열만 사람이 채우고 동기화가 건드리지 않는다.**
- Notion REST 호출은 `scripts/lib/notion.sh` 로 뽑아 `notion-sync.sh` 와 공유한다.

## Consequences

- 색인을 Notion 에서 고쳐도 다음 main push 에 되돌아간다 — 고치려면 저장소를 고친다. Notion 페이지 머리말에 이 규칙을 적었다.
- FR 행 제목이 손으로 줄인 요약에서 PRD 원문 전체로 바뀐다(길지만 어긋나지 않는다).
- 색인 DB 의 열 이름·선택지(`계획/구현중/완료`, `Accepted/Superseded/Proposed`)가 스크립트와 계약이다 — 바꾸면 스크립트도 바꾼다.
- 삭제는 동기화하지 않는다. PRD 에서 FR 을 지우면 색인 행은 남는다 — 드물고, 지울 때 손으로 지운다.
