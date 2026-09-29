# ADR-20260929: 릴리스 PR(dev → main)은 스트림 규칙 검사를 받지 않는다

- Status: Accepted
- Date: 2026-09-29
- Deciders: 강근우 제안 / 리뷰어

## Context

작업 단위는 스트림이고 브랜치는 `ws/<id>` 다(AGENTS Rule 15). `scripts/ai-end.sh --ci` 가 그것을 강제하고,
`ai-check` 는 main ruleset 의 required status check 다. 배포는 dev → main 릴리스 PR 로 한다
(ADR-20260923-dev-as-default-branch).

## Problem

릴리스 PR 은 head 가 `dev` 라 `ws/*` 일 수 없다. 그래서 `ai-check` 가 항상 FAIL 하고 병합이 막혔다
(#325 · #329). 매번 `hotfix/` 브랜치를 따로 만들어 우회했고(#313 · #326), 그 브랜치는 배포 뒤 쓰레기로 남았다.

## Alternatives

1. 매번 `hotfix/` 브랜치를 만든다 — 장점: 스크립트 변경 없음 / 단점: 배포마다 사람이 기억해야 하고, 실패한 빨간 CI 를 먼저 본다
2. `ai-check` 를 required 에서 뻐다 — 장점: 간단 / 단점: 스트림 PR 까지 검사가 풀려 규칙이 죽는다
3. 릴리스 PR 만 스크립트가 알아보고 건너뛰다 — 장점: 사람이 기억할 것이 없다 / 단점: 예외가 하나 늘고 CI 가 base 를 넘겨야 한다

## Decision

3번을 택한다. base 가 `main` 이고 head 가 `dev` 인 PR 은 `ai-end.sh --ci` 가 스트림 규칙 검사를 건너뛰고
통과시킨다(`is_release_pr`). `commands` 검사(typecheck · lint · test)는 그대로 돌아 배포 품질을 막는다.
판정은 두 값이 모두 맞을 때만 한다 — `ws/foo → main` 은 면제되지 않는다.

## Rationale

릴리스 PR 의 내용은 이미 각 스트림 PR 이 dev 로 들어올 때 같은 검사를 거쳤다. 거기서 또 보는 것은
중복이고, 그 중복 때문에 배포가 막히는 것은 규칙이 목적을 반대로 하는 상황이다. `hotfix/*` 예외가 이미
같은 생각으로 있었고, 이번 변경은 그것을 릴리스 PR 에도 맞춘 것이다.

## Consequences

- 긍정: dev 에서 과 바로 릴리스 PR 을 올릴 수 있다 — 배포용 `hotfix/` 브랜치가 더 필요 없다
- 부정: `ai-end.sh --ci` 의 면제 경로가 하나 늘었다. CI 가 `GITHUB_BASE_REF` 를 넘겨야 동작한다
- 후속: `.github/workflows/ci.yml` 에 `GITHUB_BASE_REF` 추가(같은 PR), 공지
  `.ai/team/announcements/2026-09-29-release-pr-ci.md`. 기존 `hotfix/release-*` 브랜치는 배포 뒤 지운다
