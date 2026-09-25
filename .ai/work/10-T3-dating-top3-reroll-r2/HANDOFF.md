# Handoff — 10-T3-dating-top3-reroll-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰)
- Date: 2026-09-26
- Phase / Task: 10/T3

## Goal

추천 카드의 잠긴 사진이 백엔드가 주는 `blurredPhotoUrl` 로 흐리게 보이고, 프로필 계약 사본이 백엔드 최신(dev 0c6c772 — 쿠키 전환·프로필 수정 제거)과 맞는다.

## Work Completed

- 없음

## Work In Progress

- CURRENT Progress 1~3. 확정된 변경만 반영한다 — 리롤·실·해금 API 는 아직 없어 손대지 않는다.

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- 실(`/api/wallet/**`)·리롤·정보 해금 API 는 여전히 BE 미구현 — 리롤은 목 전용 그대로다
- `GET /dating/recommendations` 는 학교 메일 인증 연동 전까지 `DATING_NOT_VERIFIED` 403 이라 실제 모드 확인은 아직이다
- 카카오 콜백 주소가 백엔드 화이트리스트에 등록됐는지 확인 전이다

## Unverified Assumptions

- 없음

## Exact Next Action

CURRENT Progress 1 — `datingCandidateSchema` 에 `blurredPhotoUrl` 을 넣고 `toCandidateView` 가 잠긴 사진에 싣는다.
