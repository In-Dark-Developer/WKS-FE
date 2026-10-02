# Current State — chore-site-close

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-site-close
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-site-close
- Task: -/-
- Issue: none
- Touches: netlify.toml,src/vite-env.d.ts,src/app/App.tsx,src/app/App.test.tsx,src/features/intro/,src/lib/analytics.ts,src/lib/analytics.test.ts,src/ui/assets/closing/,src/app/preview/screens/,docs/api/openapi.yaml#/feedbacks,src/api/feedbacks.ts,src/api/feedbacks.test.ts,src/api/schema/feedback.ts
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled, 2026-09-29-release-pr-ci, _template

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: site-close — 2026-10-04 02:00 KST 부터 사이트 전체를 종료 안내(Figma 610:2717·2742·2777)로 바꾼다: 피드백(Amplitude)·커피 모달

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1–5. 게이트·화면·preview·컨펌 (완료) · 6. 피드백을 BE `POST /feedbacks`(WKS-BE #165)로 (완료) · 7. dev PR(#341) → release PR(10/4 02:00 전) ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`14a2092`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/App.tsx:App` · `src/features/intro/openingGate.ts:readOpenAt` · `src/features/intro/OpeningSoon.tsx` · `src/lib/analytics.ts:EventProps` · `src/ui/Modal.tsx:useOverlayBehavior`

## Next Action

dev PR 병합 뒤 dev → main 릴리스 PR 을 10/4 02:00 전에 병합한다.
