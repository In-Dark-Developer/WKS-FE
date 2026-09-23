# 2026-09-23 prd-owner-drift — PRD `담당` 이 보드와 어긋나면 CI 가 막는다

- Required: yes
- Applies to: all
- Change: scripts/notion-index-sync.sh (`--check-owners`) · .github/workflows/notion-index-sync.yml
- Action: `docs/prd/**` 를 건드리는 PR 에 `owner-drift` 검사가 새로 돈다. ⚔️ PRD 보드의 `담당자` 가
  원본이고 저장소 FR·NFR 표의 `담당` 열은 사본이라는 규칙은 그대로다(ADR-20260923-prd-single-notion-db) —
  검사는 읽기만 하고 아무것도 쓰지 않는다. 배정을 바꿀 때는 **보드를 먼저 고치고** 저장소 표를 맞춘다.
  순서를 바꾸면 이 검사가 빨갛게 된다. 보드 표시 이름(예: `정진 이`)과 저장소 표기(예: `이정진`)가 달라
  `scripts/lib/notion-owners.tsv` 가 둘을 잇는다 — 검사가 모르는 표시 이름을 만나면 그 이름을 알려주니
  탭으로 구분한 한 줄을 추가한다. 로컬에서 돌리려면
  `NOTION_TOKEN=… NOTION_PRD_DB=… bash scripts/notion-index-sync.sh --check-owners` 이고,
  토큰이 없으면 경고만 내고 통과한다.
- Until: V1 종료
