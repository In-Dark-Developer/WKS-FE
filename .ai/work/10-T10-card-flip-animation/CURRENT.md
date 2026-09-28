# Current State — 10-T10-card-flip-animation

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T10-card-flip-animation
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T10-card-flip-animation
- Task: 10/T10
- Issue: none
- Touches: src/ui/ProfileCard.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T10. 소개팅 카드 뒤집기 애니메이션

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 홈 운명 카드(`ConnectionCard.css`)의 뒤집기 방식을 그대로 옮김 — 원근 1200px · Y축 180도 · 뒤통수 감추기
- 앞뒤 면을 겹쳐 두고 돌린다. 닫힌 면은 `aria-hidden`·`inert` 로 낭독기·탭 이동에서 뺀다
- 동작 줄이기 설정(`motion-reduce`)에서는 전환 없이 면만 바뀐다
- 테두리·모서리를 면으로 옮겨 카드째 뒤집히게 함 · 테스트 갱신·추가 · PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`2b97edd`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md` T10 · `src/features/share/card/ConnectionCard.css`(홈 카드 뒤집기)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/ProfileCard.tsx` (+`ProfileCard.test.tsx`)

## Next Action

PR 리뷰(`src/ui/` Owner @gn00py48). QA 8건이 이걸로 끝난다.
