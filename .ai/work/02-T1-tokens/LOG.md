# Work Log — 02-T1-tokens

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-13 · claude-code · 02/T1 · 토큰 밖 클래스 린트 · CONVENTIONS 표 · PR

- Commits: ada94b7, 60ad436
- Done: eslint-plugin-better-tailwindcss(no-unknown-classes) 도입, CONVENTIONS 4장 클래스 이름 표, PLAN T1 Owner → @jjjung0921, ADR·공지 갱신, 원본 OTF 휴지통으로 이동·dist 삭제, PR 생성
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: ADR·PLAN(Owner·SHA) · docs/CONVENTIONS.md 4장
- Verification: test 22 통과 · typecheck · lint(규칙 위반 임시 파일로 실패 확인) · build

## 2026-09-13 · claude-code · 02/T1 · Figma 토큰 @theme · 폰트 번들 · cn()

- Commits: 32a858d
- Done: Figma 토큰(램프 41·시맨틱 54·Space/Radius 16·타이포 21) → `src/ui/tokens/theme.css`, Pretendard·동국체 번들, `cn()`, 임의 색상 린트, prettier 플러그인, ADR·공지
- Not done: 없음 (PR 생성은 소유자 확인 후)
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: ADR-20260913-design-tokens-and-fonts (docs/decisions), PLAN T1 체크
- Needs your attention: Touches 추가(cn.test.ts·공지·색인), 동국체 웹 사용 라이선스, PLAN Owner(@gn00py48) 표기
- Verification: test 22 통과 · typecheck · lint · build · 브라우저 폰트 로드

## 2026-09-13 · ai-stream · 02/T1 · 스트림 열기

- Commits: (open)
- Done: 스트림 `02-T1-tokens` 생성 (브랜치 `ws/02-T1-tokens`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
