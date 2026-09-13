# Current State — 02-T3-overlays

- Stream: 02-T3-overlays
- Owner: nicerjs23@gmail.com
- Branch: ws/02-T3-overlays
- Task: 02/T3
- Issue: #24
- Touches: src/ui/Modal.tsx, src/ui/ShareSheet.tsx, src/ui/Toast.tsx, src/app/preview/screens/overlays.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets

## Current Phase

02-design-system — `docs/phases/02-design-system/PLAN.md`

## Current Task

T3. 오버레이

## Status

REVIEW

## Progress

- 1. 기존 ui 컴포넌트(Card·Notice·IconButton) 스타일·토큰 관례 확인, 오버레이 토큰 확인
- 2. `Modal.tsx`: `useOverlayBehavior` 공용 훅(포커스 트랩·ESC·스크롤 잠금·포커스 복원) + `OverlayBackdrop`
- 3. `ShareSheet.tsx`: 같은 훅 재사용한 바텀시트, 옵션 목록
- 4. `Toast.tsx`: 자동 닫힘 타이머, role=status
- 5. 테스트 16개 추가, `pnpm test|typecheck|lint|build` 통과 (commit 65cdc15)
- 6. `src/app/preview/screens/overlays.tsx` 추가(Touches 확장, 소유자 제안) — 3개 다 버튼으로 열어
     `pnpm dev`+playwright로 실제 확인(포커스 트랩·ESC·배경클릭·스크롤 잠금/복원·자동닫힘, 콘솔 에러 0) ←
- 7. HANDOFF·LOG 정리, PLAN Task 줄 갱신, 소유자 승인 후 push

## Last Checkpoint

`2abad56`

## Relevant Documents

- `docs/phases/02-design-system/PLAN.md` · `docs/CONVENTIONS.md`(4장 토큰, 7장 상태·문구)

## Relevant Source Files

- `src/ui/Modal.tsx:useOverlayBehavior,Modal,OverlayBackdrop`
- `src/ui/ShareSheet.tsx:ShareSheet` · `src/ui/Toast.tsx:Toast`

## Next Action

구현·테스트 끝. 소유자 push 승인 대기.
