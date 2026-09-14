# Handoff — 04-T8-result-figma

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 04/T8

## Goal

결과 화면이 Figma 사주 카드 화면(658:5075)의 폭·순서·카드·순위 모양과 같다(04/T8).

## Work Completed

- 콘텐츠 폭 349(ReadingResult.css margin-inline -3px — 13px 은 토큰에 없다), 카드 349×461·뒷면 비율, 인스타 버튼·순위 mx-8
- 행운의 아이템→장소, 운세 연애→결혼→자녀·간격 24, Card/Lucky bg apricot-50 50%·Card/Fortune neutral-0 50%, 그림자 제거
- FriendRanking: bg neutral-0 80%, 제목 p-16, 목록 px-8 (궁합 지도 화면도 같은 컴포넌트라 함께 바뀜)
- 운명 카드 문구 칸 폭 297, 제목 맞춤 312/글자 수 · preview '문구 최대 길이'(설명 140자) (commit 2f07677)

## Work In Progress

- 없음

## Files Changed

- `src/features/saju/ReadingResult.tsx`·`.css`(신규)·`.test.tsx` · `sections/LuckySection.tsx`·`FortuneSection.tsx` · `src/features/share/card/ResultCard.tsx`·`ConnectionCard.css` · `src/features/friends/map/FriendRanking.tsx` · `src/ui/DestinyCard.css` · `src/app/preview/screens/card.tsx`

## Decisions Made

- Figma 13px 여백은 토큰에 없어 결과 화면 전용 CSS 로 -3px 되돌림
- 카드 스탬프 줄 순서(결혼·자녀·연애)는 Figma 그대로 두고 운세 카드만 연애·결혼·자녀

## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 목 모드 375px 에서 결과·카드 미리보기 좌표 측정

## Test Results

- 258 tests 통과
- 375px: 카드 x13 w349 h461 · 버튼 y481 x21 w333 (Figma 481·21·333) · 행운 y545 (Figma 545) · 운세 간격 24
- 설명 140자: 4줄. 제목 11자일 때 설명 끝 196.5, 스탬프 이미지 194·라벨 206.8 — Figma 자체도 197

## Known Problems

- 백엔드 설명 길이는 140자를 보장하지 않는다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 운영 결과 화면 실기기 확인.
