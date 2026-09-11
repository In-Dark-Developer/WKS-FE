# Work Log — chore-bootstrap

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-11 · claude-code · 01/T1 · 템플릿 → 운꿰사 프론트엔드 초기화

- Commits: b7304ab
- Done: PRD·ARCHITECTURE·openapi 참조본·스택 ADR·공지·Phase 01~08 계획·AGENTS/README 교체, BOOTSTRAP 삭제, 기획 메모를 `docs/product-brief.md`로 이동
- Not done: main 보호 규칙 — private 저장소 + GitHub Free 라 API가 403 (Pro 이거나 public 이어야 함). 병합 방식(merge commit 전용·PR 제목/본문)은 적용됨. 브랜치 자동 삭제는 소유자 요청으로 제외
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: docs/PRD.md·docs/ARCHITECTURE.md 신규 작성, docs/api/openapi.yaml 을 백엔드 계약 참조본 초안으로 교체
- Needs your attention: 모듈 Owner(GitHub 핸들), 백엔드 저장소·계약 공개 시점, Node 버전, main 보호 대안
- Verification: 문서 변경만 — `ai-stream.sh phases --check`, `announce --check` 통과

## 2026-09-11 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-bootstrap` 생성 (브랜치 `ws/chore-bootstrap`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
