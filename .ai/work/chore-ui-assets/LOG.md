# Work Log — chore-ui-assets

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-13 · claude-code · -/- · AppShell 배경 달을 moon.svg로 교체

- Commits: ad58c02
- Done: backdrop radial-gradient 달 제거, `::before`에 `moon.svg` 배치
- Not done: 없음
- Developer changes: 소유자가 moon-body·craters·rim SVG를 `moon.svg` 하나로 교체 — 그대로 반영
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 헤더 '운꿰사' 글자가 어두운 배경에서 잘 안 보임(범위 밖)
- Verification: test 32·typecheck·lint·build 통과, 브라우저에서 달 확인

## 2026-09-13 · claude-code · -/- · Figma 에셋 src/ui/assets 추가

- Commits: b20f7ad
- Done: 12지신·배경·카드 WebP, 달·구슬·아이콘 SVG 30개(2.1MB)
- Not done: 인트로 영상·손글씨 등급(Figma에 이미지 없음)
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: night-lake 원본이 반투명(평균 alpha 240)
- Verification: lint·typecheck·build 통과, 미리보기 확인

## 2026-09-13 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-ui-assets` 생성 (브랜치 `ws/chore-ui-assets`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
