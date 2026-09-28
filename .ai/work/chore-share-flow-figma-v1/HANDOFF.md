# Handoff — chore-share-flow-figma-v1

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

공유 링크로 들어온 친구가 보는 화면(Figma 4.1~4.2.3)의 색·배경·글꼴·글자색이 Figma v1.0 과 같다.

## Work Completed

- SCR-24(15:1089): 제목·설명 흰 글자(SectionHeader), 위 336px Primary-500→투명 그라데이션(58:2886), 간격 20·12·16·32
- RankingList(8:384): 판 흰색 50%(80→50), 제목 줄 pt-16 pb-8 — 3.1·3.2·4.x 모두 같은 컴포넌트
- RelationStat(8:71): 원 44px 표면색(스침은 흰색) + UI/20/700 검정 숫자 — 옛 파일(558) 색을 v1.0 으로
- 이유 카드(Card/Fortune): 그림자·블러, 결과 페이지 본문 UI/16(시트는 UI/14 그대로, `bodySize`)
- SCR-13(16:1827): 뒤로가기 셸 여백 16 에 바로(지도 56 시작), 순위→버튼 32
- 4.1·4.2·4.2 새로 작성하기: #278(배경)·#298(구슬)로 이미 일치 — 확인만
- 4.1.3 내 사주(30:6851): 잘 맞는 오행 카드 불투명 #eeebe1(39:2481 도 같음)·'(土)' 일반 굵기·운세 아래 '지도 보기 >'(방문자만, `mapLink`) · 목 결과에 elementMatch

## Work In Progress

- 없음

## Files Changed

- `src/app/screens/{SharedResultScreen,SharedMapScreen}.tsx` · `src/app/routes/share.routes.tsx`(bodySize 한 줄) · `src/features/friends/map/{FriendRanking,RelationStats,CompatibilityMapScreen}.tsx` · `src/features/friends/reason/CompatibilityReasonSheet.tsx` · `docs/phases/09-auth-and-shell/PLAN.md`(T19 [x])

## Decisions Made

- 배경 그라데이션(164.75deg)은 Figma 4.x 의 153.17deg 와 각도만 달라 그대로 둔다(사주 결과와 공유하는 layout.css 밖 Touches)
- 순위 줄 배지는 구슬 그림 그대로(Figma 는 4.1.2 구슬 · 4.1.1/3.2 흰 원 두 가지) · Touches 에 share.routes.tsx 추가

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 4.1.3 은 카드 앞면(운명 카드)부터 보이고 '뒤로가기' 줄이 없다 — 구현은 뒷면부터(PRD FR-5)·뒤로가기(FR-6)라 spec 결정 없이 바꾸지 않았다
- 4.2.3 은 잘 맞는 오행 카드 없이 그려져 있다 — 옛 결과(elementMatch null)면 그 카드만 빠지는 구현과 같다
- 4.1.2 의 '친구 이름을 눌러…' 안내는 방문자가 남의 이유를 못 열어 두지 않았다

## Unverified Assumptions

- 없음

## Exact Next Action

PR #301 리뷰 · 카드 면·뒤로가기 spec 판단
