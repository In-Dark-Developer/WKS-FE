# Work Log — chore-dating-photo-rules

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-28 · claude-code · -/- · 소개팅 사진 조건

- Commits: f41f06e
- Done: webp 차단, 10MB 선검사, 파일 선택 JPG·PNG, (2/2) 사진 안내·오류 문구
- Not done: 해상도(2천만 픽셀) 검사
- Upstream changes: 없음
- Spec changes: docs/api/openapi.yaml /dating/profile/photo contentType 에서 image/webp 제거(BE api-spec §10.1 에 맞춤)
- Verification: test 640 · typecheck · lint · 미리보기

## 2026-09-28 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-dating-photo-rules` 생성 (브랜치 `ws/chore-dating-photo-rules`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
