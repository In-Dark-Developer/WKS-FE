# 2026-09-13 notion-index-sync — Notion 요구사항·ADR·Phase 색인을 CI 가 main 에서 자동으로 맞춘다

- Required: yes
- Applies to: all
- Change: docs/decisions/ADR-20260913-notion-index-sync.md · scripts/notion-index-sync.sh · scripts/lib/notion.sh · .github/workflows/notion-index-sync.yml · PR (chore-notion-index-sync)
- Action: Notion 「요구사항 색인 (PRD)」·「ADR 색인」·「Phase 색인」(신규)을 손으로 고치지 않는다 — `docs/PRD.md`·`docs/decisions/`·`docs/phases/` 가 main 에 병합될 때마다 CI 가 덮어쓴다(ADR 색인의 `영역` 열만 사람이 채운다). 요구사항 행의 `Phase`·`상태` 는 PLAN 이 그 FR 을 언급하는지와 Phase Status 에서 나오므로, PLAN 에 FR ID 를 적어야 색인에 잡힌다. Notion REST 호출은 `scripts/lib/notion.sh` 로 옮겼다 — `notion-sync.sh` 를 고칠 때 참고.
- Until: Phase 08 종료
