# Handoff — chore-last-day-sale

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-30
- Phase / Task: -/-

## Goal

백엔드가 할인된 실 비용을 주는 동안(2026-10-01 10시~자정) 사진·이름·학과·궁합 이유·리롤 비용 옆에 정가가 취소선으로 보인다.

## Work Completed

- 정가(사진 10·이름 7·학과 5·궁합 이유 3·리롤 20)보다 서버 비용이 싸면 정가에 취소선을 긋는 `CostText`
- 카드 뒷면 알약, 해금 모달 칸, 리롤 시트 버튼에 적용. 미리보기 상태 3개 추가

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/unlock/{CostText,unlockView,unlockFlow,UnlockDialog}` · `card/CandidateFaces.tsx` · `recommendation/RerollSheet.tsx` · `src/ui/LockedValue.tsx`(label ReactNode) · preview 2개

## Decisions Made

- 할인 시각을 화면이 따로 보지 않는다 — 서버 비용 < 정가일 때만 긋는다. 백엔드가 10시에 바꾸고 자정에 되돌리면 화면이 그대로 따라가며, 백엔드가 늦어도 거짓 할인을 보이지 않는다.
- 무료(0)는 긋지 않는다(무료 점지·다시 열기).

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 미리보기(`/preview/dating-unlock`·`dating-cards` 마지막 날 할인 상태) 모바일 폭 스크린샷

## Test Results

- 124 files / 760 tests 통과, typecheck·lint 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 백엔드가 10/1 10:00 KST 에 비용을 10·5·3·2·1 로 바꾸고 자정에 되돌린다(소유자 확인, 2026-09-30).

## Exact Next Action

dev 배포에서 할인 비용이 올 때 취소선이 보이는지 확인한다(백엔드 dev 가 할인을 켠 뒤).
