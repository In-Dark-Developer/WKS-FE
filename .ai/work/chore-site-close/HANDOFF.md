# Handoff — chore-site-close

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-10-03
- Phase / Task: -/-

## Goal

운영 배포에서 2026-10-04 02:00 KST 이후 어떤 주소로 들어와도 종료 안내가 보이고, 피드백은 Amplitude 로 가고, 커피 모달은 계좌번호를 복사한다.

## Work Completed

- 종료 게이트(`App.tsx`·`openingGate.ts:readSiteCloseAt`) · `SiteClosed.tsx`(안내·커피 모달·피드백, 뒤로가기 복귀) · `analytics.ts:feedback_submitted` · `netlify.toml` 운영 VITE_SITE_CLOSE_AT · preview `closed.tsx`

## Work In Progress

- 없음 (dev PR → release PR 만 남음)

## Files Changed

- `src/app/App.tsx` · `src/features/intro/{SiteClosed,openingGate,index}.ts(x)` · `src/lib/analytics.ts` · `src/ui/assets/closing/coffee.webp` · `src/vite-env.d.ts` · `netlify.toml` · `src/app/preview/screens/closed.tsx` + 테스트

## Decisions Made

- 소유자(2026-10-03): 시각 게이트(예약 병합 아님) · 사이트 전체 · 피드백은 Amplitude `feedback_submitted` · 피드백 화면은 뒤로가기로 안내 복귀
- 소유자(2026-10-03): 빈 입력이면 버튼 비활성(디자인은 노란 버튼) · 커피 모달은 정중앙(디자인은 37px 아래) — 지금대로 둔다

## Tests Executed

- pnpm test · typecheck · lint · build, 브라우저 preview 측정·뒤로가기

## Test Results

- 774 통과, 경고 없음. 피드백 제출은 dev 에서도 실제 Amplitude 로 가서 브라우저로는 누르지 않았다(단위 테스트만)

## Known Problems

- 백엔드 API 는 종료 시각 뒤에도 열려 있다(FE 만 닫힘). Amplitude 가 차단되면 피드백은 사라지지만 성공 토스트가 뜬다

## Unverified Assumptions

- 없음

## Exact Next Action

dev PR 병합 뒤 dev → main 릴리스 PR 을 10/4 02:00 전에 병합한다.
