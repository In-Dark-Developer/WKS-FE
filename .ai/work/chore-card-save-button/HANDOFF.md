# Handoff — chore-card-save-button

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

결과 화면 카드 아래 버튼이 Figma 796:3862 '카드 저장하기'다.

## Work Completed

- 버튼 문구 '카드 저장하기'·download 아이콘(Figma 내보내기)
- 저장 토스트 '카드를 기기에 담았느니라'(인스타 문구 제거)
- PRD FR-5·SCR-05, 주석 갱신

## Work In Progress

- 없음

## Files Changed

- `src/features/share/card/{ResultCard.tsx,ResultCard.test.tsx,messages.ts,shareCardImage.ts}` · `src/ui/assets/icons/download.svg` · `src/app/routes.test.tsx` · `src/app/preview/screens/card.tsx` · `src/features/saju/ReadingResult.tsx` · `docs/PRD.md`

## Decisions Made

- 동작은 그대로(파일 공유 시트 → 없으면 내려받기) — iOS 에서 사진 앱에 담는 길이 공유 시트의 '이미지 저장'이라 바로 내려받기보다 낫다

## Tests Executed

- pnpm test·lint·typecheck (exit code) · iOS 시뮬레이터 결과 화면에서 버튼 탭

## Test Results

- 모두 exit 0 · test 363 · iOS 공유 시트에 PNG 와 '이미지 저장' 표시

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 fork 로 배포.
