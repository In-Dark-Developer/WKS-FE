# Current State — chore-partner-entry-modal


- Stream: chore-partner-entry-modal
- Owner: gn00py48@gmail.com
- Branch: ws/chore-partner-entry-modal
- Task: -/-
- Issue: none
- Touches: src/features/auth/,src/features/dating/,src/app/routes/,src/app/RootLayout.tsx,docs/phases/10-dating-onboarding/PLAN.md
- Supersedes: none
- Acked: none

## Current Phase

10 (QA 후속 — T20)

## Current Task

chore: partner-entry-modal

## Status

REVIEW

## Progress

- Figma 522:2756 · 234:2797 대조 뒤 재화 모달 '친구에게 공유' 줄 갱신
- PartnerEntryDialog(SCR-23 1.1) 작성 · partnerRef 노출 조건 헬퍼 추가
- 메인 티저 loader·화면에 연결 · 지급 알림 모달을 RootLayout 으로
- test · typecheck · lint · 브라우저 확인
## Last Checkpoint

`c4623fd`

## Relevant Documents

- `AGENTS.md` · `docs/phases/10-dating-onboarding/PLAN.md` (T18, T20)

## Relevant Source Files

- `src/features/dating/reward/PartnerEntryDialog.tsx` · `PendingRewardDialog.tsx`
- `src/features/auth/partnerRef.ts:hasPartnerRef`
- `src/app/routes/saju.routes.tsx:mainTeaserLoader` · `src/app/RootLayout.tsx`
- `src/features/dating/wallet/ThreadGuideDialog.tsx:others`

## Next Action

PR 을 dev 로 올리고, 백엔드(MapFriendRewardService)의 '친구 로그인 시 +2' 규칙 반영을 담당자에게 넘긴다.
