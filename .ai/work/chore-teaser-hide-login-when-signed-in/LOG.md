# Work Log — chore-teaser-hide-login-when-signed-in

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-27 · claude-code · -/- · dev CI 복구 — 앱 셸 테스트가 티저 loader 를 기다림

- Commits: c8b58d8
- Done: App.test 가 GET /me 를 경계에서 대체하고 티저를 기다린다(목 모드가 꺼진 CI 에서 실제 요청을 보내 실패)
- Not done: 없음
- Developer changes: #239 가 CI 실패 상태로 병합됨 — 이 PR 이 dev 를 다시 초록으로
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 로컬 `.env.local` 의 VITE_API_MOCK=true 로는 재현되지 않는다
- Verification: `VITE_API_MOCK=false pnpm test` 575 · 목 모드 test · typecheck · lint

## 2026-09-27 · claude-code · -/- · 티저 로그인 링크 숨김

- Commits: 6906230
- Done: 로그인 상태에서 메인 티저의 '이미 아이디가 있어요' 숨김(index loader `GET /me`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: `/` 첫 화면이 `GET /me` 응답 뒤에 그려진다
- Verification: test 575 · typecheck · lint · 목 모드 브라우저 로그인/비로그인

## 2026-09-27 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-teaser-hide-login-when-signed-in` 생성 (브랜치 `ws/chore-teaser-hide-login-when-signed-in`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
