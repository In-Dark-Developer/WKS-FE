# 2026-09-29 release-pr-ci — 릴리스 PR 은 dev 에서 바로 올린다

- Required: no
- Applies to: all
- Change: `scripts/ai-end.sh` · `scripts/lib/common.sh:is_release_pr` · `.github/workflows/ci.yml` (스트림 chore-release-pr-ci, ADR-20260929-release-pr-skips-stream-rules)
- Action: 운영 배포는 `dev → main` PR 을 그대로 올리면 된다 — `ai-check` 가 더는 'ws/* 가 아니다' 로 FAIL 하지 않는다. 배포만을 위한 `hotfix/release-*` 브랜치는 더 만들지 않는다(진짜 긴급 수정은 여전히 `hotfix/*`). `commands` 검사는 그대로 돌아 typecheck · lint · test 가 빨간 채로는 병합되지 않는다. 스트림 PR(ws/* → dev) 규칙은 바뀜 것이 없다.
- Until: 상시
