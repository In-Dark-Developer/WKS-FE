# Work Log — 08-T5-perf-budget

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-24 · claude-code · 08/T5 · 크기 검사 CI + 운영 LCP 측정

- Commits: (소유자가 커밋)
- Done: check-bundle-size.mjs·check:bundle·CI 단계, Lighthouse 3회(LCP 4.77s ❌, JS 161.4KB ✓) RESULT 기록
- Not done: LCP 줄이는 변경(Touches 밖 — 승인 대기)
- Developer changes: 없음 · Upstream changes: 없음 · Spec changes: 없음
- Needs your attention: ci.yml 변경 Lead 리뷰 필요, 줄이는 변경 범위 승인
- Verification: check:bundle ok 161.4KB · 초과 가짜 산출물 exit 1 · prettier

## 2026-09-24 · ai-stream · 08/T5 · 스트림 열기

- Commits: (open)
- Done: 스트림 `08-T5-perf-budget` 생성 (브랜치 `ws/08-T5-perf-budget`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
