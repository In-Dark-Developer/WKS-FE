# Work Log — spec-prd-owner-column

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-23 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: FR·NFR 표 맨 끝에 `담당` 열을 붙이고 V1 배정 19건 기입 (이정진 7 · 이동건 5 · 강근우 5 · 곽도윤 2)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: `docs/prd/30-functional-requirements.md`·`docs/prd/40-quality.md` 에 `담당` 열 추가 (요구 문구·구분·우선순위는 그대로)
- Needs your attention: 보드가 원본이라 배정 변경은 보드 먼저 — 이 표는 손으로 맞춘다
- Verification: `notion-index-sync.sh --prd --dry-run` → `PRD: 41행`, 파싱 변화 없음
