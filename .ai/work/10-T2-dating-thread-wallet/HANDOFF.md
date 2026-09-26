# Handoff — 10-T2-dating-thread-wallet

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰) · @gn00py48 (강근우 · 해금이 같은 잔액을 쓴다)
- Date: 2026-09-26
- Phase / Task: 10/T2

## Goal

재화 '실'의 잔액이 백엔드 원장(`GET /api/wallet`) 하나에서 오고, 해금으로 줄어든 잔액이 화면에 바로 반영되며, 모자랄 때 소모가 막히고 안내가 뜬다. 화면은 잔액을 계산하지 않는다.

## Work Completed

- 없음

## Work In Progress

- CURRENT Progress 1~5.

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- 출석 체크(`POST /wallet/check-in`)를 누를 UI 가 내 할당이 아니다 — 디자인은 있으나 퍼블리싱 Task 몫이라 이 스트림은 API 만 두고 버튼을 만들지 않는다(소유자 결정 2026-09-26)
- 제휴 지급(FR-32)은 백엔드 미구현 — `rewardGranted` 는 당분간 항상 null
- 리롤 API 는 여전히 없다 — 리롤 비용 판정은 목 그대로다
- 11/T1 의 목 잔액이 '프로필 등록 시 10' 기준이라 백엔드(가입=최초 로그인 시 10)와 다르다 — 이 스트림에서 맞춘다

## Unverified Assumptions

- 없음

## Exact Next Action

CURRENT Progress 1 — openapi.yaml 에 `GET /wallet`·`POST /wallet/check-in` 을 넣는다.
