# Handoff — chore-release-pr-ci

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/- (chore)

## Goal

dev → main 릴리스 PR 을 우회 브랜치 없이 그대로 올릴 수 있다.

## Work Completed

- `common.sh` — `PROD_BRANCH`(기본 main) 와 `is_release_pr` (base, head 두 인자) 추가
- `ai-end.sh --ci` — base=main · head=dev 면 스트림 규칙 검사를 건너뛰고 exit 0
- `ci.yml` — ai-check 스텝에 `GITHUB_BASE_REF` 전달(없으면 판정 불가)
- ADR-20260929-release-pr-skips-stream-rules · 공지 2026-09-29-release-pr-ci

## Work In Progress

- 없음

## Files Changed

- commit 참조 (scripts/ai-end.sh, scripts/lib/common.sh, .github/workflows/ci.yml, docs/decisions/, .ai/team/announcements/)

## Decisions Made

- base 와 head 둘 다 맞을 때만 면제한다 — `ws/foo → main` 은 면제되지 않는다
- `commands`(typecheck · lint · test)는 그대로 둔다 — 배포 품질 검사는 남아야 한다
- `hotfix/*` 예외는 그대로 둔다 — 진짜 긴급 수정에 여전히 필요하다

## Tests Executed

- detached HEAD 워크트리에서 CI 와 같은 조건으로 7가지 경우를 직접 실행

## Test Results

- dev→main 통과(exit 0) · hotfix→main 통과 · ws/*→dev 기존대로 검사
- feature/oops→dev 거절 · ws/nonexistent→main 거절 · env 없는 로컬 실행 변화 없음

## Known Problems

- 이 PR 자체는 아직 옵은 ci.yml 로 돌아 효과는 병합 뒤 다음 릴리스부터다
- `origin/hotfix/release-*` 브랜치 3개가 남아 있다 — 배포 뒤 지우면 된다

## Unverified Assumptions

- `github.base_ref` 가 PR 이벤트에서 항상 채워진다고 보았다(GitHub 문서 기준)

## Exact Next Action

PR 을 dev 로 올린다.
