# Handoff — 09-T4-compatibility-reason

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: 09/T4

## Goal

궁합 지도의 친구 줄을 누르면 궁합 이유 세 문단이 바텀시트로 뜨고, 첫 생성 동안 로딩을 보인다(FR-22).

## Work Completed (d40bab0)

- `api/compatibilities.ts` getCompatibilityReason(목 모드는 1.5초 지연), `schema/compatibility.ts`, ErrorCode 에 COMPATIBILITY_NOT_FOUND·UNAUTHENTICATED·KAKAO_UNAVAILABLE
- 궁합 요약·생성 응답의 `id` 를 optional 로 — V0.5 운영 BE 는 안 준다. 없는 줄은 누를 수 없다
- `FriendRanking` onSelect + `RankingRow` 추출(선택 줄은 등급 색), 지도에 안내 문구(Figma 30:5789)
- `CompatibilityReasonSheet` + `ReasonAnswers` — 시트는 한 번만 뜨고 답 자리만 로딩 → 답/오류
- `/me/map/:friendId` — 부모 `my-map` 데이터로 친구·순위, 이유는 기다리지 않고 promise(React Router Await). 목록에 없는 id 는 지도로

## Work In Progress

- 없음

## Files Changed

- `src/api/{compatibilities,schema/compatibility,schema/envelope,schema/result,schema/share}.ts`
- `src/features/friends/{map/FriendRanking,map/CompatibilityMapScreen,map/tiers,reason/*,index}`
- `src/features/saju/{readingView,toReadingView}.ts` · `src/app/routes/map.routes.tsx` · `src/app/screens/MyMapScreen.tsx` · preview

## Decisions Made

- 별도 페이지가 아니라 지도 위 시트(Figma 3.2)
- 선택 줄 색은 등급 카드 테두리 색(Primary·Rose·Apricot·Neutral/300) — Figma 는 귀인(#91bdc8)만 있다
- 재시도는 revalidate — 부모 지도도 다시 부른다

## Tests Executed

- `pnpm test`(428) · typecheck · lint
- 라우트: 줄 누름 → 시트 먼저·로딩 → 답, 실패 → 오류·다시 시도, 모르는 id → 지도
- 브라우저 375×812 `/preview/compatibility-reason` 답·생성 중

## Test Results

- 전부 통과

## Known Problems

- 시트 모서리는 BottomSheet 의 20px(Figma 24px, radius 스케일에 24 없음)
- 친구의 궁합 지도(공유 Flow, 4.1.2·4.2.2 자세히 보기)는 이 Task 밖이라 줄을 누를 수 없다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합.
