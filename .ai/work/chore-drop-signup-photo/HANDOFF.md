# Handoff — chore-drop-signup-photo

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

사전신청 폼에 사진 칸이 없고, 고지·명세도 사진을 수집하지 않는다고 말한다.

## Work Completed

- `PreRegisterForm` 사진 칸·미리보기 URL 관리 제거
- `consent.ts` 수집 항목을 실제 입력 항목으로(사진 제외, 연락처 택1, 성별·찾는 인연 추가)
- PRD FR-10·Q4·Q10·Q14, openapi `/signups` 설명, PLAN 06 사진 문구 정리

## Work In Progress

- 없음

## Files Changed

- `src/features/profile/{PreRegisterForm.tsx,PreRegisterForm.test.tsx,consent.ts,formSchema.ts,preRegisterAction.ts,preRegisterAction.test.ts}` · `src/api/schema/signups.ts` · `docs/PRD.md` · `docs/api/openapi.yaml` · `docs/phases/06-dating-gate/PLAN.md`

## Decisions Made

- 사진을 받지 않는다(소유자 결정 2026-09-17)
- `src/ui/PhotoUpload` 는 디자인시스템 컴포넌트라 남겼다 — 이제 쓰는 화면이 없다

## Tests Executed

- pnpm test·lint·typecheck (exit code)

## Test Results

- 모두 exit 0 · test 357

## Known Problems

- `src/ui/PhotoUpload.tsx`(+test) 를 쓰는 곳이 없다 — 지울지 소유자 결정 필요

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 worktree `WKS-FE-nophoto` 정리.
