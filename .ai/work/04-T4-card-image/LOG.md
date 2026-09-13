# Work Log — 04-T4-card-image

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-14 · claude-code · 04/T4 · 인연카드 → 스토리 PNG · html-to-image ADR

- Commits: f0c9a39
- Done: `renderCardImage`(화면 밖 1080×1920 프레임에 카드 사본 → `toBlob`)·`cardImageFileName`·테스트 7개, ADR-20260914 로 대안 4개 기록, `html-to-image` 동적 import 추가.
- Not done: 실제 PNG 눈 확인 — jsdom 에 foreignObject·캔버스가 없다. T5·실기기 몫.
- Developer changes: 없음
- Upstream changes: 없음 (main 932b8f0 에서 분기)
- Spec changes: 없음 (ADR 신규 1건 — Touches 안)
- Needs your attention: 런타임 의존성 1개 추가다. 승인은 이 PR 병합(ADR Status=Accepted)으로 본다.
- Verification: test 213 passed · typecheck · lint 0 · 청크 gzip 5.10KB / 초기 JS 147.20KB 유지

## 2026-09-14 · ai-stream · 04/T4 · 스트림 열기

- Commits: (open)
- Done: 스트림 `04-T4-card-image` 생성 (브랜치 `ws/04-T4-card-image`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
