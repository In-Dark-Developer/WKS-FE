# Handoff — 04-T7-merge-card-into-result

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 04/T7

## Goal

결과 화면이 Figma Frame 93 순서(카드 뒤집기 버튼이 있는 운명 카드 → 인스타 스토리 공유 → 행운 → 운세 → 순위, 빈 상태에 친구에게 공유)로 그려지고 `/reading/:id/card` 가 없어진다(04/T7).

## Work Completed

- `ResultCard`(구 ConnectionCardScreen): 카드 뒤집기 + 인스타 스토리 공유, 친구에게 공유·h1 제거. 앞면은 운명 카드 문구
- `ReadingResult` 가 `renderCard(face)` 슬롯으로 카드를 받음(saju 가 뷰→앞면 값, app 이 ResultCard 조립)
- routes: `/reading/:id/card`·`cardLoader`·인연카드 보기 삭제, 순위 빈 상태 `emptyAction` 에 친구에게 공유
- DestinyCard: 제목·설명 말줄임/2줄 제한 제거, connection kind 삭제 · preview '문구 120자' 상태 (commit 737b218, WIP)


## Work In Progress

- 없음


## Files Changed

- `src/features/share/card/ResultCard.tsx`·`.test.tsx`(rename) · `ConnectionCard.tsx`·`.css`·`.test.tsx` · `share/index.ts` · `cardLoader.ts`·`.test.ts`(삭제) · `saju/ReadingResult.tsx`·`.test.tsx`·`index.ts` · `app/routes.tsx`·`.test.tsx` · `app/preview/screens/card.tsx`·`reading.tsx` · `ui/DestinyCard.tsx`·`.css`·`.test.tsx`


## Decisions Made

- 카드는 render prop 슬롯 — saju 가 앞면 값, app 이 ResultCard 조립(features 끼리 import 없음) · `DestinyCard.test.tsx` Touches 추가
- 긴 제목(소유자 선택): `font-size: min(29.565, 298 / --title-chars) × u` — 10자 이하는 Figma 크기, 14자는 21.3. 띄어쓰기 없는 긴 제목은 두 줄로 내려갈 수 있다


## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 목 모드 `/preview/card` 360px 측정


## Test Results

- 253 tests·typecheck·lint 통과
- 백엔드 제목 8종 × 설명(합 120자), 360·430px: 제목 모두 한 줄, 설명 끝과 결혼운 스탬프 사이 11.7~18.5u


## Known Problems

- `src/lib/cardImage.ts` 파일 이름이 `…-인연카드.png` (Touches 밖)
- 카카오톡 카드 치우침 원인 미확정(최신 WebKit 재현 안 됨)


## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 운영 결과 화면에서 카드 뒤집기·인스타 공유 실기기 확인.
