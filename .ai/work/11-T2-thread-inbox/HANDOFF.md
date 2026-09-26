# Handoff — 11-T2-thread-inbox

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 11/T2

## Goal

카드에서 운명의 실을 보내고(미해금 항목이 남았으면 확인), 요청함에서 보낸·받은 신청을 보고 수락·거절하며, 성립하면 상대 연락처가 보인다 (FR-29 · FR-30).

## Work Completed

- api `matchRequests.ts`·`schema/matchRequests.ts` — 보내기·목록·수락·거절 + 목 요청함(받은 신청 하나 미리 옴)
- 카드: 미해금 항목 있으면 확인 모달 → 전송 → 보낸 뒤 모달('보러가기' → `/dating/requests?tab=sent`). 보낸 상대는 버튼 '운명의 실을 보냈어요'(비활성)·해금 버튼 없음. loader 가 `box=sent` 로 표시
- `/dating/requests` 라우트 + `DatingRequestsScreen`·`requestsLoader` — 보낸 신청은 지금 Top 3 카드로 채움, 수락·거절, 성립 시 카드 버튼 자리에 연락처

## Work In Progress

- 없음 — #225(11/T1) 가 먼저 병합돼야 한다(이 브랜치에 병합해 쌓았다)

## Files Changed

- `src/api/matchRequests.ts`(+test) · `src/api/schema/matchRequests.ts`
- `src/features/dating/requests/{requestsLoader.ts,DatingRequestsScreen.tsx}`(+test) · `RequestDetail.tsx` · `RequestInbox.tsx` · `requestsView.ts`
- `src/features/dating/recommendation/{DatingCardsScreen,DatingCards,CandidateCard,cardsView,recommendationsLoader}` · `index.ts` · `src/app/routes/dating.routes.tsx`

## Decisions Made

- PLAN After: T1 — T1 은 PR #225 로 리뷰 중이라 그 브랜치를 병합해 쌓았다(마감 9/27, 소유자 자동 진행 지시)
- BE 목록에는 상대 프로필이 없다 — 보낸 신청은 지금 Top 3 카드에서 찾아 채우고, 받은 신청은 프로필 없이(가린 채) 보인다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 104 files / 558 tests 통과, 오류·경고 0

## Known Problems

BE 갭(api-spec §11) — 답이 오면 고친다:
- 받은 신청에 상대 프로필이 없다 → 가린 카드(○○○)로 보인다. FR-30 '전부 공개' 미충족
- 요청 취소 API 없음 → '준비 중' 안내만
- '매칭에 실패했어요'(상대가 다른 사람과 성립)는 못 만든다 — 거절만 실패로 보인다
- 성립 후 화면은 디자인이 없어 카드 버튼 자리에 연락처 한 줄
- 실제 BE·실기기 확인 안 함(학교 메일 인증까지 마친 계정 2개 필요, SC-9)

## Unverified Assumptions

- 없음

## Exact Next Action

#225 병합 확인 → 이 PR 리뷰 반영, BE 답에 따라 받은 신청 프로필 연결
