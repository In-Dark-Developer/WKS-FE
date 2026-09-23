# Current State — 11-T3-dating-thread-publish

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 11-T3-dating-thread-publish
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/11-T3-dating-thread-publish
- Task: 11/T3
- Issue: none
- Touches: src/features/dating/, src/ui/, src/app/preview/screens/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-dating-publishing-split, _template

## Current Phase

11-dating-thread — `docs/phases/11-dating-thread/PLAN.md`

## Current Task

T3. 해금·운명의 실·요청함 퍼블리싱

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- Figma 76-3401·76-3400 읽기, 에셋 6개 · ui LockedValue·Tabs
- 해금 모달(다중 선택·합계·이미 연 항목·잔액 부족) · 구매 완료(1~4개)
- 운명의 실 모달 · DatingDialog · 카드 면 CandidateFaces 분리(항목별 알약)
- 요청함 목록·탭·상세 카드(대기 취소·실패·수락/거절) · preview 3화면 · test 442

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`2c7a29d`

## Relevant Documents

- `docs/phases/11-dating-thread/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/card/CandidateFaces.tsx:CandidateBack` · `unlock/UnlockDialog.tsx` · `thread/ThreadDialogs.tsx` · `requests/RequestInbox.tsx` · `src/ui/LockedValue.tsx` · `src/ui/Tabs.tsx`

## Next Action

PR 리뷰 대응. 병합 뒤 11/T1(강근우)·T2 가 이 컴포넌트에 데이터를 잇는다.
