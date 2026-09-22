# Work Log — chore-screen-assembly-ssot

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-22 · claude-code · -/- · 화면 조립 SSoT 통합과 CI 러너 절감

- Commits: cac6f76 (refactor), 3ae89e9 (ci) — `refactor` 브랜치에서 cherry-pick
- Done: 조립을 `src/app/screens/` 로 추출해 라우트와 `/preview` 가 함께 쓴다. CI 는 취소·job 합치기·코드 없는 PR 건너뛰기·notion-sync 중복 제거
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: `chore-reading-back-always` 와 `routes.tsx` 가 겹친다. 2026-09-17 부터 Actions 가 지출 한도로 막혀 있었다
- Verification: test 371 passed · typecheck · lint · `/preview` 브라우저 확인

## 2026-09-22 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-screen-assembly-ssot` 생성 (브랜치 `ws/chore-screen-assembly-ssot`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
