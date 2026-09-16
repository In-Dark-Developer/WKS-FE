# Handoff — chore-amplitude

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

Amplitude 가 켜져 사주 입력 → 결과 → 공유 → 친구 궁합 생성 깔때기를 단계별로 본다.

## Work Completed

- `src/lib/analytics.ts` — SDK 동적 import 창구, 이벤트 이름·속성 타입 목록, init 전 no-op
- 이벤트 연결: `saju_submitted`·`saju_failed`(sajuAction) · `reading_viewed`·`map_viewed`(routes loader) · `share_clicked`(ShareLinkButton) · `compatibility_created`(joinShare)
- ADR-20260916-amplitude-product-analytics

## Work In Progress

- 없음

## Files Changed

- `src/lib/analytics.ts`(+test) · `src/main.tsx` · `src/app/routes.tsx` · `src/app/preview/screens/share.tsx` · `src/features/saju/sajuAction.ts`(+test) · `src/features/share/link/ShareLinkButton.tsx`(+test) · `src/features/friends/joinShareLoader.ts` · `package.json` · `pnpm-lock.yaml` · `docs/decisions/ADR-20260916-amplitude-product-analytics.md`

## Decisions Made

- SDK 는 동적 import — 정적이면 첫 화면 번들이 gzip 155.64 → 218.70 kB 로 는다. 지금은 +0.6 kB, SDK 는 별도 청크(gzip 63.93 kB)
- autocapture 는 attribution·pageViews·sessions 만 — formInteractions 는 사주 입력 필드를 훑어 끈다
- 화면 도착 이벤트는 컴포넌트가 아니라 loader 에서 — StrictMode 이중 마운트 중복을 피한다
- 브라우저 key 는 저장소 상수 — GA4 측정 ID 와 같은 등급의 공개 식별자다(ADR Rationale)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`

## Test Results

- test 327 통과(신규 4) · typecheck·lint 무경고 · build 성공, 메인 청크 518.91 kB(gzip 156.20)

## Known Problems

- Phase 06 사전신청 모달은 아직 라우트에 없어 전환 이벤트가 없다 — 붙을 때 이벤트 목록에 추가한다

## Unverified Assumptions

- 전달받은 key 가 Amplitude **브라우저** key 다(서버 API key 가 아니다) — 실제 이벤트 도착은 배포 후 확인
- ShareOutcome 목록이 `analytics.ts` 에 복제돼 있다(lib → features import 금지) — 공유 폴백이 바뀌면 둘을 같이 고친다

## Exact Next Action

PR 을 올리고 CI 통과 후 merge, 배포되면 Amplitude 실시간 보고서에서 `saju_submitted` 도착을 확인한다.
