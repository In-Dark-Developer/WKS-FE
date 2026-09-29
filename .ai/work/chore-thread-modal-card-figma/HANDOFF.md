# Handoff — chore-thread-modal-card-figma

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/-

## Goal

운명의 실 재화 모달이 Figma 522:2739 와 같고, 인연 카드 앞면의 글자·정렬·버튼이 QA(카드 글자/버튼 관련)대로 보인다.

## Work Completed

- 재화 모달(Figma 522:2739): 세 번째 줄 '친구에게 공유 · 내 지도에 등록된 사람 5명 당 · +3', 받은 줄은 개수 칩 아래 '지급 완료', 칩 그라데이션은 Figma 값 그대로(소유자 지시)
- 카드 앞면: 점수 원 45px 를 관계 유형 오른쪽 16px 에 세로 가운데로(Figma 448:2833 배치 — 원이 글줄보다 커 솟아 보이던 것), MBTI·나이 라벨/값 바닥선 맞춤
- 받은·보낸 신청 카드 버튼 글줄 24px(높이 32px, Figma cardbutton) — 26px 로 납작하던 것
- 카드 면 antialiased — macOS 서브픽셀 렌더링이 어두운 사진 위 흰 글자를 두껍게 그리던 것

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/{wallet/ThreadGuideDialog.tsx,dating.css,card/CandidateFaces.tsx,requests/RequestDetail.tsx}` · `src/ui/ProfileCard.tsx` · 테스트 `DatingCards` · `CandidateFaces` · `RequestInbox`

## Decisions Made

- 출석 개수는 Figma(+10) 대신 백엔드 값(5) 유지 — 2026-09-27 결정
- 모달 로그인 버튼 영역은 두지 않는다 — 로그인한 소개팅 화면에서만 열린다(2026-09-27 결정)
- 칩 그라데이션은 소유자 지시로 Figma 값으로 되돌렸다(#312 의 흰 끝 제거를 되돌림)
- 이전 스트림 chore-qa-copy-card-flip-email 은 소유자가 바뀌어(take) 병합됐으므로 새 스트림으로 옮겼다

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- '카드 글자가 두껍다'는 Chrome 계산 굵기 400(가짜 볼드 아님) — macOS 렌더링으로 보고 antialiased 로 맞췄다. iOS 는 원래 회색조라 차이 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰.
