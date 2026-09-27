# Work Log — spec-prd-reroll-cost-20

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-28 · claude-code · -/- · 리롤 비용을 20 으로 맞춤

- Commits: 73d3ef5 (spec)
- Done: PRD FR-27 · openapi 설명 · 목 비용 20 · 목 유료 리롤이 402 인 규칙으로 테스트 정정
- Not done: 백엔드 REROLL_COST(5) 변경은 곽도윤님 몫
- Developer changes: 소유자가 Figma 시안(실 20개)으로 확정값을 알려 줬다 · Upstream changes: 없음
- Spec changes: docs/prd/30-functional-requirements.md · docs/api/openapi.yaml (이 스트림의 목적)
- Needs your attention: 목 모드에서는 유료 리롤을 눌러 볼 수 없다(목 잔액 최대 15 < 20)
- Verification: test 651 passed · typecheck · lint 0 경고 · redocly 새 문제 없음

## 2026-09-28 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `spec-prd-reroll-cost-20` 생성 (브랜치 `ws/spec-prd-reroll-cost-20`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
