# Current State — chore-partner-claim-alert


- Stream: chore-partner-claim-alert
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-partner-claim-alert
- Task: -/-
- Issue: none
- Touches: src/app/RootLayout.tsx,src/app/RootLayout.test.tsx,src/features/auth/partnerRef.ts,src/features/auth/partnerRef.test.ts,docs/phases/10-dating-onboarding/PLAN.md
- Supersedes: none
- Acked: none

## Current Phase

10 (QA 후속 — T22)

## Current Task

chore: partner-claim-alert

## Status

REVIEW

## Progress

- dev 사이트에서 `?ref=FESTIVAL` 재현 · 원인 확인(지급 알림이 응답보다 먼저 마운트)
- claim 지급 여부 반환 · RootLayout 이 알림을 다시 그림 · 500 이면 ref 유지
- test · typecheck · lint

## Last Checkpoint

`1901ab9`

## Relevant Documents

- `AGENTS.md` · `docs/phases/10-dating-onboarding/PLAN.md` (T20, T22)

## Relevant Source Files

- `src/app/RootLayout.tsx:RootLayout` · `src/features/auth/partnerRef.ts:claimPendingPartnerRef`
- `src/features/dating/reward/PendingRewardDialog.tsx` · `src/features/dating/wallet/ThreadGuideDialog.tsx`

## Next Action

PR 을 dev 로 올린다. 백엔드가 `GET /wallet` 에 제휴 지급 여부를 내주면 `ThreadGuideDialog` 축제 줄에 잇는다.
