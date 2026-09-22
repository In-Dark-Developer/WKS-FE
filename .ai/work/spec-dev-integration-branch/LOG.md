# Work Log — spec-dev-integration-branch

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-23 · claude-code · -/- · dev 를 통합 브랜치로, main 을 릴리스 브랜치로

- Commits: c550809
- Done: `INTEG_BRANCH`/`integ_ref` 도입, 워크플로 트리거, AGENTS·README·netlify 주석, ADR·공지
- Not done: GitHub 설정 2건(main 룰셋 생성 · 기본 브랜치 변경) — 권한이 필요해 소유자 몫
- Developer changes: 없음
- Upstream changes: origin/dev 병합 (검색엔진 제외 설정)
- Spec changes: AGENTS.md Rule 4·5·7·9·15·절차·History
- Needs your attention: 룰셋을 먼저 만들고 기본 브랜치를 바꿔야 main 이 무보호가 되지 않는다
- Verification: bash -n · yaml 파싱 · ai-stream status(origin/dev 기준) · ai-end --quick

## 2026-09-23 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `spec-dev-integration-branch` 생성 (브랜치 `ws/spec-dev-integration-branch`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
