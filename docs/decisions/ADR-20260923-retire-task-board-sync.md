# ADR-20260923: Notion Task 보드 동기화를 걷어낸다

- Status: Accepted
- Date: 2026-09-23
- Deciders: @jjjung0921 (제안) / 리뷰어는 PR 승인자
- Supersedes: ADR-20260912-notion-task-board-sync

## Context

`notion-sync.yml` 은 `ws/**` push 와 PR open·reopen·close 마다 스트림 상태를 Notion `✅ Task 보드`(`10aa90e7-…`)에
복사했다. 그 보드는 옛 워크스페이스에 있고, 2026-09-23 에 요구사항 Notion 을 ⚔️ PRD DB 하나로 모으면서
(ADR-20260923-prd-single-notion-db) 새 통합에는 옛 DB 접근 권한을 주지 않기로 했다.

## Problem

그래서 이 워크플로는 스트림 PR 마다 반드시 실패한다:

```
Notion POST /databases/10aa90e7-…/query → HTTP 404: Could not find database with ID: 10aa90e7-…
```

필수 검사는 아니라 병합은 막지 않지만, 모든 PR 의 검사 목록에 빨간 `sync` 가 남는다. 빨간 검사가 늘 있으면
진짜 실패를 알아보지 못한다 — 검사는 초록이거나 없거나 둘 중 하나여야 쓸모가 있다.

## Decision

`notion-sync.yml` 과 `scripts/notion-sync.sh` 를 지운다. 스트림 현황은 저장소와 GitHub 이 이미 갖고 있다 —
`.ai/work/<id>/CURRENT.md` 의 `Status:`·`Owner:`, 브랜치 `ws/<id>`, PR, 그리고 `scripts/ai-stream.sh status`.
Notion 에 사본을 두지 않는다.

`scripts/lib/notion.sh` 는 남긴다 — `notion-index-sync.sh` 가 계속 쓴다.

## Alternatives

- **새 통합을 옛 보드에 연결한다** — 보드 자체를 더 쓰지 않기로 했으므로 살려 둘 이유가 없다.
- **보드를 새 워크스페이스로 옮긴다** — 스트림 현황은 `ai-stream.sh status` 로 충분하고, ⚔️ PRD 보드와 역할이
  겹친다. 옮기는 비용만큼의 값이 없다.
- **워크플로를 두고 실패를 무시한다** — 기각. 상시 빨간 검사가 진짜 실패를 가린다.

## Consequences

- 스트림 PR 의 검사 목록에서 `sync` 가 사라진다.
- `✅ Task 보드` 는 2026-09-23 이후 갱신되지 않는다 — 옛 기록으로만 남는다.
- 스트림 현황을 보려면 `scripts/ai-stream.sh status` 를 쓴다.
