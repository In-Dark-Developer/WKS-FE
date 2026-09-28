# Work Log — 09-T1-home-tab-back

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-26 · claude-code · 09/T1 · 같은 탭 재선택이 뒤로 가기를 막던 결함

- Commits: 03286e9
- Done: 이미 홈일 때 홈 탭을 누르면 같은 주소가 기록에 한 번 더 쌓여 뒤로 가기가 제자리에 머물렀다 — `BottomNavBar` 가 현재 주소로는 이동하지 않는다. 다른 화면 → 홈 → 뒤로 가기는 원래 맞았고 테스트로 고정했다
- Not done: 사주가 없을 때 홈 탭은 FR-19 대로 사주 입력(`/`)으로 간다 — 결과가 없어 결과 화면을 보일 수 없다
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 배포 `main` 에는 하단 네비가 아직 없다(Phase 09 미릴리스) — 확인은 dev 배포나 PR preview 로
- Verification: pnpm test 531/531 · typecheck · lint(경고 0) · 추가 테스트 2건은 수정 전 실패 확인(`/reading/…` 에 머묾)

## 2026-09-26 · ai-stream · 09/T1 · 스트림 열기

- Commits: (open)
- Done: 스트림 `09-T1-home-tab-back` 생성 (브랜치 `ws/09-T1-home-tab-back`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
