# Current State — 08-T3-prod-connection-check

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 08-T3-prod-connection-check
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/08-T3-prod-connection-check
- Task: 08/T3
- Issue: none
- Touches: docs/phases/08-launch-readiness/, docs/phases/README.md, netlify.toml, docs/deploy/, docs/ARCHITECTURE.md, docs/api/openapi.yaml, docs/decisions/ADR-20260914-netlify-personal-fork.md, .ai/team/announcements/, .ai/team/README.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork

## Current Phase

08-launch-readiness — `docs/phases/08-launch-readiness/PLAN.md`

## Current Task

T3. 운영 연결 확인

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. dig·curl 로 fork 동기화·Netlify·SPA·캐시·DNS·백엔드 HTTPS·CORS 점검
- 2. 도메인 오타(threatoffate→threadoffate) 수정·RESULT 기록

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`643c4c2`

## Relevant Documents

- `docs/phases/08-launch-readiness/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

백엔드 HTTPS·CORS·Route53 레코드 뒤 RESULT 표로 재점검 → T3 체크
