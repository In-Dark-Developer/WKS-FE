# Work Log — 01-T3-toolchain

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-12 · claude-code · 01/T3 · 제약 층 구성

- Commits: 0061995 외 1
- Done: pnpm·Vite 8·TS 6·Vitest 5·Tailwind 4·ESLint 10·Prettier 설치와 버전 고정, strict tsconfig, 의존 방향 린트 규칙, 클린 설치 검증
- Not done: `pnpm build`는 T4의 `index.html` 이후에 성립
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: TS는 6.0.3으로 간다 — typescript-eslint가 TS 7을 아직 지원하지 않는다
- Verification: 클린 설치 후 test·typecheck·lint 통과, 경계 규칙은 임시 파일로 error 확인

## 2026-09-12 · ai-stream · 01/T3 · 스트림 열기

- Commits: (open)
- Done: 스트림 `01-T3-toolchain` 생성 (브랜치 `ws/01-T3-toolchain`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
