# Work Log — chore-replace-card-back-and-loading-video

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-17 · claude-code · -/- · 카드 뒷면·대기 영상 교체 반영과 용량 정리

- Commits: (커밋 예정)
- Done: 교체본에 맞춰 `ConnectionCard.css` 의 그림자 여백 보정을 없애고(`inset:0` + `object-fit: cover`) 칸 비율은 앞면과 같은 349/461 로 뒀다. 무손실로 온 카드를 q90 으로 재인코딩해 1160KB → 160KB 로 줄였다(PSNR 42.7dB).
- Not done: 없음
- Developer changes: 소유자가 `card-back.webp`·`fortune-loading.mp4` 를 교체했다
- Upstream changes: 없음 (main 에서 분기)
- Spec changes: 없음
- Needs your attention: 디자이너 기준 343×461 과 구현 앞면 349×461 이 다르다 — 1.2% 라 흡수했지만 디자인에서 하나로 맞추는 게 낫다
- Verification: test 354 · typecheck · lint 0 · build(card-back 164KB · 초기 JS gzip 160.25KB)

## 2026-09-17 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-replace-card-back-and-loading-video` 생성 (브랜치 `ws/chore-replace-card-back-and-loading-video`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
