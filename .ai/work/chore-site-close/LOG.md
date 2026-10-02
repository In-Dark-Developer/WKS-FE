# Work Log — chore-site-close

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-10-03 · claude-code · -/- · 사이트 종료 화면 (안내·커피·피드백)

- Commits: 77ab14b 36bdd78 4940c38
- Done: VITE_SITE_CLOSE_AT(운영 2026-10-04 02:00 KST)부터 모든 주소를 종료 화면으로(Figma 610:2717·2742·2777) · 피드백은 Amplitude `feedback_submitted` · 커피 모달은 계좌 복사 · 뒤로가기로 안내 복귀 · 미리보기 `/preview/closed`
- Not done: 없음
- Developer changes: 없음 · Upstream changes: 없음 · Spec changes: 없음
- Needs your attention: 릴리스 PR 을 10/4 02:00 전에 — 종료 시각은 빌드 때 박힌다. 백엔드 API 는 닫히지 않는다. 피드백 본문이 Amplitude 에 실린다(analytics 개인정보 규칙 예외, 소유자 결정)
- Verification: pnpm test 774 · typecheck · lint · build 통과, 미리보기 375×812 측정이 Figma 값과 일치

## 2026-10-03 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-site-close` 생성 (브랜치 `ws/chore-site-close`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
