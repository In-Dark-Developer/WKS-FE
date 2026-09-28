# Current State — 09-T17-birthdate-today-notice

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T17-birthdate-today-notice
- Owner: nicerjs23@gmail.com
- Branch: ws/09-T17-birthdate-today-notice
- Task: 09/T17
- Issue: none
- Touches: src/features/saju/, src/features/dating/profile/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T17. 생년월일 오늘 입력 안내

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 원인 확인: dev 백엔드에 실제 호출 — 오늘 400 INVALID_INPUT · 어제 201. 폼은 오늘을 통과시켜 엉뚱한 안내가 떴다
- 고침: 받는 마지막 날을 어제로, 문구에 이유를 넣음. 사주 입력·공유 입력(SajuForm 공통)·소개팅 (1/2) 같은 규칙·문구
- 테스트: 오늘 막힘·어제 통과·양쪽 문구 동일 · 검증 4종 · PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`b5c553b`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md` T17 · `docs/prd/30-functional-requirements.md` FR-2 · WKS-BE api-spec §2

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/saju/formSchema.ts:lastAllowedIso,sajuErrorMessages` · `src/features/dating/profile/profileSchema.ts` (+각 테스트)

## Next Action

PR 리뷰. 다음 QA 는 09/T16(홈 운세 순서).
