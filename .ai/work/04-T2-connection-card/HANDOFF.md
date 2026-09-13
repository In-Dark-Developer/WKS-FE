# Handoff — 04-T2-connection-card

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 04/T2

## Goal

인연카드 앞면(731:4668·12종 731:4740)·뒷면(731:4712)과 카드 뒤집기가 props 로만 렌더되고 `/preview/card` 에서 확인된다.

## Work Completed

- ui `DestinyCard` 에 `kind='connection'`: '님의 인연카드'·'인연을 점지'·'당신의 인연 운명은..'(16px)
- `share/card/ConnectionCard`: 앞면(DestinyCard)·뒷면(card-back.webp)을 겹쳐 Y축 뒤집기(0.6s, reduced-motion 이면 즉시), 숨은 면은 aria-hidden+inert, '카드 뒤집기' aria-pressed
- `/preview/card`: 앞면·뒷면·십이간지 12종

## Work In Progress

- 없음

## Files Changed

- `src/ui/DestinyCard.{tsx,css,test.tsx}`, `src/features/share/{index.ts,card/}`, `src/app/preview/screens/card.tsx`, 04 PLAN

## Decisions Made

- 뒤집기 버튼은 옛 카드 화면(558:2788) 모양으로 카드 아래쪽 가운데에 앞·뒷면 공통으로 둔다 — 새 디자인(731)에는 버튼이 없다
- 뒷면은 글자까지 구워진 기존 이미지 — 대체 텍스트로 문구를 읽힌다

## Tests Executed

- `pnpm test`(157) · typecheck · lint · build(dist 에 preview 없음), 브라우저 375px 앞면→뒷면 뒤집기·버튼 위치 측정

## Test Results

- 통과

## Known Problems

- 카드 화면(SCR-05) 전체 배치·'인스타 스토리 공유하기'·이미지 저장(FR-5·FR-16)은 04/T1 이 정할 Task
- 등급 줄 이름: 디자인 결혼·자녀·연애 vs PRD FR-5 연애·결혼·운명운 — PRD Q3(cardGrades) 답 대기
- 12종 카드 원본(731:4741~)은 문구·스탬프가 10·11px 어긋나 있어 713 좌표를 그대로 씀
- dev 서버 포트가 03/T1 병합으로 3000 으로 바뀜 — `/preview` 는 localhost:3000

## Unverified Assumptions

- 뒤집기 버튼 위치(앞면에서도 보임)

## Exact Next Action

PR 리뷰 후 병합 → 05/T2
