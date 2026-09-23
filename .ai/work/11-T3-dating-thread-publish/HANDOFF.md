# Handoff — 11-T3-dating-thread-publish

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: 11/T3

## Goal

해금·운명의 실·요청함 화면이 뷰 모델 props 로만 그려지고 `/preview/dating-unlock`·`dating-thread`·`dating-requests` 에서 보인다.

## Work Completed

- `src/ui/LockedValue`(흐린 자리 + 자물쇠 알약) · `src/ui/Tabs`(분홍 선택 탭) — 도메인 규칙 없음
- 해금 모달 `UnlockDialog`(여러 항목 선택, 버튼에 합계, 이미 연 항목 비활성, 잔액 부족 알림) · `UnlockDoneDialog`(1~3개 한 줄, 4개 2×2)
- `SendThreadDialog`·`ThreadSentDialog` · 공용 `DatingDialog`/`DialogActions`
- 카드 앞·뒷면을 `card/CandidateFaces` 로 분리 — 아무것도 안 열었으면 '열람하기', 일부 열었으면 항목마다 알약, onUnlock 없으면(실 보낸 뒤) 흐리게만
- `RequestInbox`(뒤로가기·탭·목록·빈 목록) · `RequestDetail`(대기=요청 취소, 실패=매칭에 실패했어요, 받은 신청=수락/거절)

## Work In Progress

- 없음

## Files Changed

- `src/ui/{LockedValue,Tabs}.tsx`·`Tabs.css` · `src/features/dating/{DatingDialog.tsx,card/,unlock/,thread/,requests/}` · `recommendation/CandidateCard.tsx` · `dating.css` · `index.ts` · preview 3화면 + `dating-cards.tsx` 상태 2개

## Decisions Made

- 해금 모달 hover 와 selected 는 같은 모습(Figma 주석 'hover 디자인'). 이미 연 항목 그림은 grayscale 로 낸다 — Figma 에 회색 그림이 사진 하나뿐이다
- 받은 신청의 궁합 점수는 `score: null` 로 숨긴다(Q17 미정, PLAN Out of Scope)
- 분홍 #f6868f·점수 알약 그라데이션은 Figma 변수가 없어 CSS 원본 값(`Tabs.css`·`dating.css`)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 브라우저 미리보기 375×812 로 Figma 프레임과 대조

## Test Results

- 87 files / 442 tests 통과(exit 0), typecheck·lint 경고 없음

## Known Problems

- 수락 후 연락처 공개 화면·실패 행 배지는 Figma 에 없어 만들지 않았다(PLAN 의 '행 배지' 문구와 다름) — 디자인 확인 필요
- 빈 목록 문구('아직 보낸 신청이 없어요.')는 디자인에 없어 임시로 넣었다

## Unverified Assumptions

- 잠긴 이름의 요청함 행은 '○○○' 흐림으로 보인다 — 백엔드가 표시 이름을 따로 줄지 11/T2 에서 확인

## Exact Next Action

PR CI 확인 후 병합. 11/T1·T2 담당에게 컴포넌트 props 를 알린다.
