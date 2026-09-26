# Handoff — 09-T9-invite-teaser

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 09/T9

## Goal

사주가 없는 방문자도 공유 링크로 들어오면 초대 머리와 링크 주인의 궁합 지도 아래에서 Figma 4.1(30:5916) 문구의 사주 입력 폼을 보고, 기존 방문자의 '새로 작성하기' 폼도 같은 문구다 (FR-15).

## Work Completed

- `ShareInvite`(초대 제목·부제·주인 궁합 지도)를 떼어 신규·기존 방문자 공통 머리로
- `ShareEntryChoice` 는 선택 영역만
- `SajuForm` 에 `sectionTitle` — 섹션 머리글(UI/18/600) + 줄바꿈 설명
- `ShareInputScreen` 문구를 30:5916 대로('사주를 입력해 인연을 확인하세요' · '내 운명을 친구 궁합 지도에 꿰기')

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/{ShareInvite,ShareEntryChoice}.tsx`(+test) · `index.ts`
- `src/features/saju/SajuForm.tsx`(+test) · `src/app/screens/ShareInputScreen.tsx`
- `src/app/routes/share.routes.tsx` · `index.test.tsx`(Touches 추가 — 문구 바뀐 조립 테스트)

## Decisions Made

- 없음

## Tests Executed

- `pnpm test` · `typecheck` · `lint`, 목 모드 `/s/:shareId` 화면 눈 확인(신규 방문자)

## Test Results

- 전부 통과(아래 커밋 시점 수치는 LOG)

## Known Problems

- 없는·만료 링크의 복구 경로(FR-15 V1 후반, 기능명세 5.16)는 디자인 미정이라 그대로 — 기존 없는 경로 화면
- 09/T10(공유 궁합 결과)이 이 화면을 이어 쓴다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 뒤 09/T10 스트림 open
