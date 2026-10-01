# Current State — chore-dating-close

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-dating-close
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-dating-close
- Task: -/-
- Issue: none
- Touches: netlify.toml,src/vite-env.d.ts,src/features/dating/registrationClose.ts,src/features/dating/registrationClose.test.ts,src/features/dating/profile/,src/features/dating/intro/,src/features/dating/entry/DatingIntroScreen.tsx,src/features/dating/entry/DatingIntroScreen.test.tsx,src/app/preview/screens/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled, 2026-09-29-release-pr-ci, _template

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: dating-close — 2026-10-02 02:00 KST 부터 소개팅 신규 등록 마감: 로그인 인트로·프로필 (2/2) 시작 버튼 비활성과 마감 안내

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 마감 시각·(2/2) 비활성·안내(소유자 patch 2개) (완료) · 2. 인트로 안내·모듈 이동 (완료) · 3. dev PR → release PR(02:00 전) ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`7ba058d`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/registrationClose.ts:readDatingCloseAt,useIsClosed,closedNotice`
- `src/features/dating/intro/DatingIntro.tsx:DatingIntro` · `entry/DatingIntroScreen.tsx`
- `src/features/dating/profile/DetailsStep.tsx` · `DatingProfileForm.tsx`

## Next Action

PR 병합 뒤 dev → main 릴리스 PR 을 02:00 KST 전에 올린다 — 마감 시각은 빌드 때 박힌다(VITE_DATING_CLOSE_AT).
