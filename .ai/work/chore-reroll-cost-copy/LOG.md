# Work Log — chore-reroll-cost-copy

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-29 · claude-code · 10/T3 · 리롤 비용 표기를 20실로 맞춤

- Commits: b5b5c27
- Done: 미리보기 고정값 3 → 20, PLAN '실 5개' 2곳 · RerollSheet 주석 갱신
- Not done: 운영 코드는 고칠 것이 없었다 — 이미 서버 값을 쓴다
- Developer changes: 없음
- Upstream changes: BE REROLL_COST 5 → 20(49d8c32)
- Spec changes: 없음
- Needs your attention: 해금 비용(10·7·5·3)은 BE 와 이미 같다. 테스트 고정값은 Touches 밖이라 두었다
- Verification: vitest(741/742) · typecheck · lint · 브라우저 확인 2개 상태

## 2026-09-29 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-reroll-cost-copy` 생성 (브랜치 `ws/chore-reroll-cost-copy`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
