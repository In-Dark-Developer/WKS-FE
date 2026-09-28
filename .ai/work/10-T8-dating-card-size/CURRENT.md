# Current State — 10-T8-dating-card-size

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T8-dating-card-size
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T8-dating-card-size
- Task: 10/T8
- Issue: none
- Touches: src/ui/ProfileCard.tsx, src/features/dating/recommendation/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T8. 소개팅 카드 규격

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- Figma 확인: 앞면 `96:1876`·뒷면/인연x `134:2527` 모두 **343×433**, radius 12, 흰 테두리
- 원인: 높이만 433px 로 고정돼 폭이 바뀌면 비율이 깨졌다(레이아웃 최대 430px → 카드 328~398px)
- 고침: `aspect-[343/433] w-full` — 375px 에서 정확히 343×433, 다른 폭에서도 모양이 같다
- 테스트 2건(카드·빈 카드) · 검증 4종 · PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`8ab0495`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md` T8 · Figma v1.0 `96:1876`·`134:2527` · `src/app/layout.css`(최대 430px)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/ProfileCard.tsx` · `src/features/dating/recommendation/DatingCards.tsx:EmptyCard` (+각 테스트)

## Next Action

PR 리뷰(`src/ui/` Owner @gn00py48). 다음은 10/T9(글래스)·T10(뒤집기).
