# Work Log — spec-prd-split

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-23 · claude-code · -/- · PRD 를 절별 파일 묶음으로 분할

- Commits: 7d1f492
- Done: `docs/PRD.md` → `docs/prd/` 6파일, 경로를 읽는 도구 6곳·참조 4곳 갱신, ADR·공지 작성
- Not done: 도메인별 재분할은 V1 요구사항이 저장소로 들어온 뒤
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: `docs/PRD.md` 삭제 → `docs/prd/` 신규 6파일, AGENTS.md Repository Map·Rule 2
- Needs your attention: 진행 중 Phase PLAN 의 옛 링크는 각 Lead 가 고쳐야 한다
- Verification: FR·NFR grep 24행(분할 전과 동일) · bash -n · typecheck · lint

## 2026-09-23 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `spec-prd-split` 생성 (브랜치 `ws/spec-prd-split`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
