# Current State — 09-T16-home-fortune-order

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T16-home-fortune-order
- Owner: nicerjs23@gmail.com
- Branch: ws/09-T16-home-fortune-order
- Task: 09/T16
- Issue: none
- Touches: src/features/saju/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T16. 홈 운세 표시 순서

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 찾음: 운세 카드 섹션은 이미 연애·결혼·자녀였고 **카드 위 등급 스탬프 줄만** 백엔드 순서(결혼·자녀·연애)였다
- 고침: `fortuneOrder` 하나가 순서를 정하고 둘이 같이 쓴다 — 연애 → 결혼 → 자녀
- 순서를 지키는 테스트 추가(FortuneSection) · 검증 4종 · PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`19c59e3`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md` T16 · `docs/prd/30-functional-requirements.md` FR-3 · Figma v1.0 `8:794`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/saju/readingView.ts:fortuneOrder` · `sections/FortuneSection.tsx` · `ReadingResult.tsx:face.grades`

## Next Action

PR 리뷰. 다음 QA 는 10/T13(리롤 시트 문구).
