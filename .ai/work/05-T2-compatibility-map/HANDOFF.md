# Handoff — 05-T2-compatibility-map

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 05/T2

## Goal

Figma 지도 최종 v2(558:2625)의 지도·등급별 인원·친구 궁합 순위·빈 상태가 props(내 닉네임·친구 목록)로만 렌더되고 `/preview/map` 에서 확인된다.

## Work Completed

- `CompatibilityMap`: 패널 배경 SVG(그라데이션·궤도·달·리본 합성) + 구슬 5자리(순위 순서, 등급별 크기) + 제목·친구 수
- `RelationStats`: 등급 4칸 인원(친구 목록에서 셈) · `FriendRanking`: 순위·닉네임·색 배지·점수, `limit`, 빈 상태 + `emptyAction`
- `CompatibilityMapScreen`: 지도·인원·순위·'친구에게 공유하고 궁합 지도 넓히기'(`onShare`)
- 측정값 `notes/figma-measurements.md`

## Work In Progress

- 없음

## Files Changed

- CURRENT Touches 그대로 (+ `CompatibilityMapScreen.test.tsx`)

## Decisions Made

- 구슬 배치 규칙 미정(Q11) — 디자인 다섯 자리를 순위대로, 여섯 번째부터는 지도에 안 그림(순위 목록엔 있음)
- 순위 숫자는 받은 순서의 번호(동점 처리는 연동 Task) · 인원은 목록에서 셈
- 결과 화면 순위 요약은 `FriendRanking limit` 을 T7 이 슬롯에 넣는다

## Tests Executed

- `pnpm test`(163) · typecheck · lint · build(dist 에 preview 없음), 브라우저 375px 6명·빈 상태·순위 요약, 구슬 중심 좌표 Figma 대조

## Test Results

- 통과

## Known Problems

- 지도 배경 SVG 267KB(손그림 궤도 path) — gzip 전송, 필요하면 WebP 로 바꿀 것
- 스탯 원 벗 색 #F2D2A1 은 토큰에 없어 apricot-200 사용
- 빈 지도 부제 '아직 지도에 그린 인연이 없어요' 는 디자인에 없는 문구
- Frame 92(713:3956, v1 스타일 '닉네임님과의 궁합 지도예요.')는 링크 방문자용인지 확인 필요
- 3000 포트의 기존 dev 서버가 새 파일의 Tailwind 클래스를 못 읽음 — 재시작 필요

## Unverified Assumptions

- 여섯 명 이상일 때 지도 구슬 다섯 개만

## Exact Next Action

PR 리뷰 후 병합 → 06/T2
