# 2026-09-12 pr-body-autofill — PR 제목·본문은 스트림 초안으로 채워진다

- Required: yes
- Applies to: all
- Change: scripts/ai-end.sh · .github/workflows/ci.yml
- Action: PR 은 `scripts/ai-end.sh --ready --pr`(CLI) 또는 `--ready --web`(브라우저 — 제목·본문이 채워진 채 열린다)로 연다. 웹에서 템플릿 그대로 열어도 CI 의 `pr-body` 잡이 HANDOFF·LOG 초안으로 본문을 채우고 제목을 규격으로 바꾼다. 사람이 쓴 제목·본문은 건드리지 않는다. `--ready` 가 이제 공지 색인 불일치도 경고한다(CI 는 FAIL).
- Until: Phase 08 종료
