# 2026-09-23 prd-notion-db — 요구사항 Notion 은 ⚔️ PRD DB 하나다

- Required: yes
- Applies to: all
- Change: ADR-20260923-prd-single-notion-db.md
- Action: 요구사항은 저장소 `docs/prd/` 가 원천이고, Notion 은 ⚔️ PRD DB 하나만 본다 — 🙋 요구사항 색인
  DB 는 더 이상 갱신되지 않는다. 보드에서 `상태`·`담당자`·`FE`·`BE`·`수용 기준`·`비고` 를 적는 건 자유이고
  CI 가 덮어쓰지 않는다. 반대로 `ID`·`이름`·`구분`·`우선순위` 를 Notion 에서 고치면 다음 push 에 되돌아간다
  — 요구 문구를 바꾸려면 `docs/prd/` 에 PR 을 낸다. FR 표에 `Area` 열이 생겼으니 새 FR 을 적을 때 함께 채운다.
- Until: Phase 08 종료
