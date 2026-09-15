# Handoff — 05-T3-map-route

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 05/T3

## Goal

결과 화면 순위의 '지도 보기'로 `/me/map` 궁합 지도에 들어가고, 친구 목록이 백엔드 실제 궁합 응답으로 그려진다(05/T3).

## Work Completed

- `compatibilitySummarySchema` = { score, tier, originNickname, guestNickname } (옛 모양이면 스키마 위반 → 결과 화면 전체 오류였다)
- `ReadingView.compatibilities` → `friends`(상대 닉네임·점수 높은 순) — toReadingView
- `requireMyResultId()` · `/me/map` loader 는 보관된 resultId 로 readingLoader 재사용, backdrop result
- `CompatibilityMapScreen` onShare → `share` 슬롯, app 이 `ShareLinkButton label='친구에게 공유하고 궁합 지도 넓히기'` 로 채움
- `FriendRanking headerAction` · 결과 화면에 '지도 보기 >' Link (commit ea218bd)

## Work In Progress

- 없음

## Files Changed

- `src/api/schema/result.ts`·`.test.ts` · `src/features/saju/readingView.ts`·`toReadingView.ts`·`.test.ts` · `src/app/requireSession.ts` · `src/app/routes.tsx`·`.test.tsx` · `src/features/friends/map/CompatibilityMapScreen.tsx`·`.test.tsx`·`FriendRanking.tsx` · `src/features/share/link/ShareLinkButton.tsx`·`.test.tsx`

## Decisions Made

- 상대 닉네임은 '내 닉네임이 아닌 쪽' — 응답에 내가 origin 인지 없다. 두 닉네임이 같으면 글자가 같아 문제없다
- 지도 화면 공유 버튼도 실제 공유 링크(ShareLinkButton)로 연결 — 이전엔 onShare 가 비어 동작하지 않았다

## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 목 모드 dev 서버에서 입력 → 결과 → '지도 보기' → /me/map

## Test Results

- 264 tests 통과 · 브라우저: /reading/:id 에 '지도 보기' href=/me/map, 누르면 '달빛토끼님의 궁합 지도'·공유 버튼 표시, 오류 없음

## Known Problems

- 실제 친구 궁합이 있는 운영 데이터로는 미확인(공유 랜딩 SCR-06 이 아직 없어 궁합을 만들 경로가 없다)
- 백엔드 api-spec.md 의 compatibilities 모양 불일치 — 백엔드 담당에게 알릴 것

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 운영에서 결과 → 지도 보기 → 궁합 지도 확인.
