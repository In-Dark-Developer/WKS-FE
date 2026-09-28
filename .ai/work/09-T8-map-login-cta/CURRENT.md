# Current State — 09-T8-map-login-cta

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T8-map-login-cta
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/09-T8-map-login-cta
- Task: 09/T8
- Issue: none
- Touches: src/features/friends/map/, src/features/dating/intro/LoginSheet.tsx, src/app/screens/MyMapScreen.tsx, src/app/routes/map.routes.tsx, src/ui/assets/friends/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T8. 궁합지도 로그인 저장 유도

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1~5 완료. 실제 모드 로그인 확인은 BE 쿠키 전환 뒤(09/T2)

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`c2bcf5e`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/friends/map/MapSaveCard.tsx` · `src/app/screens/MyMapScreen.tsx` · `src/app/routes/map.routes.tsx:protectedMapLoader`

## Next Action

BE 쿠키 전환 후 실제 모드에서 로그인 → /me/map 복귀·카드 사라짐 확인.
