# Handoff — chore-qa-copy-card-flip-email

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

Notion QA(2026-09-28) 강근우 담당 항목이 요청대로 보인다. 2026-09-28 이정진이 인수해 dev 와 충돌을 풀었다 — 겹친 항목은 dev 를 따른다.

## Work Completed

- dev 병합(07a2045) 뒤 이 PR 에 남은 것: +3·+10 칩 그라데이션(10/T19) · 메일 재발송 버튼 120px 고정(#309 의 숫자 고정폭 위에 폭까지)
- dev 를 따른 것: 공유 문구(#307) · 연락처 안내(#308) · 카드 뒤집기 사진(#310, ProfileCard.css 방식 — 이 브랜치의 visibility 방식은 뺐다)
- 뺀 것: 지도 별 '5명 당 3개' 문구 — WKS-BE §12·FR-31 은 '친구 1명 등록당 3' 이라 백엔드 결정 전에는 넣지 않는다(10/T18)
- 공유 시트 문구 → '부처님이 우리를 어떻게 이어놨는지 궁금하면 지금 등록해봐!' (닉네임 인자 제거)
- 소개팅 (2/2) 연락처 안내 → '상대방에게 공개될 정보예요'
- 실 획득 방법 '지도 별 달성' 설명 → '내 지도에 등록된 사람↵5명 당 3개', 줄은 82px 최소로 늘어남
- +3·+10 칩: Figma 그라데이션의 오른쪽 흰(rose-50) 끝을 rose-200 50% 로 — 줄 바탕에 묻혀 잘려 보이던 것
- 메일 인증 재발송 카운트다운에 버튼 폭이 1~3px 씩 흔들려 메일 칸이 줄었다 늘었다 — 버튼 120px·tabular-nums 고정
- 소개팅 카드: 안 보이는 면을 회전 절반(250ms) 뒤 visibility 로 숨김 — WebKit 이 흐림 사진에 backface-hidden 을 안 먹여 앞면 사진이 뒷면에 좌우 반전으로 비치던 것

## Work In Progress

- 없음

## Files Changed

- `src/features/share/link/*` · `src/app/screens/MyMapScreen.tsx` · `src/app/preview/screens/share.tsx` · `src/features/dating/{dating.css,profile/*,wallet/ThreadGuideDialog.tsx,recommendation/DatingCards.test.tsx}` · `src/ui/ProfileCard.{tsx,test.tsx}`

## Decisions Made

- 지도 별 문구는 QA 요청 그대로(칩 +3 과 '3개'가 겹치지만 요청 문구 유지)
- 칩 그라데이션은 Figma 값에서 흰 끝만 바꿨다 — 디자이너 확인 필요

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 병합 뒤 702 passed · typecheck · lint 경고 0 · 375px 재발송 버튼 120px, 글자 넘침 없음

## Known Problems

- 10/T18 문구는 백엔드 규칙 결정 대기
- 카드 사진 반전은 #310 방식으로 dev 에 들어갔다 — 실기기(iPhone Safari·카카오톡 인앱) 확인 전

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합. 10/T18 은 백엔드 결정 뒤 따로
