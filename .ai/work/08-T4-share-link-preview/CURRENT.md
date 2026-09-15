# Current State — 08-T4-share-link-preview

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 08-T4-share-link-preview
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/08-T4-share-link-preview
- Task: 08/T4
- Issue: none
- Touches: index.html, public/og/, docs/decisions/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

08-launch-readiness — `docs/phases/08-launch-readiness/PLAN.md`

## Current Task

T4. 공유 링크 미리보기

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. index.html 제목 운꿰사 → 운명도 꿰어야 사랑이다, 공통 OG·Twitter 메타(이미지 제외)
- 2. og:image 썸네일 — 디자인 전달 대기 — `public/og/og.jpg` 1200×675 (commit b19cf37)
- 3. shareId 별 동적 미리보기 ADR (Netlify Edge Functions vs 백엔드 렌더) — 공통 메타 채택, 동적 기각 (ADR-20260915-share-preview-static-meta)
- 4. 카카오·인스타·메신저 미리보기 확인 → PLAN T4 체크

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`b19cf37`

## Relevant Documents

- `docs/phases/08-launch-readiness/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `index.html` (head 메타)

## Next Action

PR 병합(fork 소유자) → Netlify 배포 뒤 카카오 공유 디버거·인스타·메신저에 `https://threadoffate.site/s/test` 붙여 미리보기 확인 → PLAN T4 체크
