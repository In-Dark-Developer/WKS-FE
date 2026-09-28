# 2026-09-24 ci-sync-warn — PR CI 는 dev 미병합을 경고로만 알린다

- Required: no
- Applies to: all
- Change: `scripts/ai-end.sh` `chk_sync` (스트림 chore-ci-sync-check-warn)
- Action: PR 을 연 뒤 dev 에 다른 PR 이 들어와도 `ai-check` 가 더는 FAIL 하지 않고 `[warn] dev 브랜치가 앞서 있다` 만 낸다. 병합 직전에 `git merge dev` 또는 PR 의 Update branch 로 맞춘다. 로컬 `ai-end.sh --ready` 는 그대로 dev 미병합이면 FAIL 이다. 메시지의 "main" 은 실제 기준 브랜치(dev) 이름으로 바뀌었다.
- Until: Phase 10 종료
