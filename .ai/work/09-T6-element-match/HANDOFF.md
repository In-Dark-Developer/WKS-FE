# Handoff — 09-T6-element-match

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: 09/T6

## Goal

결과(= 홈)에 잘 맞는 오행과 이유가 보이고 'OO 기운의 사람 만나보기'가 소개팅으로 가며, 옛 결과는 그 영역만 없다.

## Work Completed

- `elementMatchSchema` + `resultSchema.elementMatch` — `.nullish()`: null(옛 결과)과 키 없음(V1 이전 운영 BE)을 둘 다 받는다. 공유 응답 스키마에서는 뺐다
- 뷰 모델 `elementMatch`(element key·korean·reason | null), `ElementMatchSection`(Figma 39:2481), `ReadingResult` 의 `elementMatchAction` 슬롯
- `HomeScreen` 이 입구 링크(`/dating`)를 채운다 — 공유 Flow 뒤 내 사주도 같은 HomeScreen

## Work In Progress

- 없음

## Files Changed

- `src/api/schema/{result,share}.ts`(+test) · `src/features/saju/{readingView,toReadingView,ReadingResult}.ts(x)`(+test) · `sections/ElementMatchSection.tsx`
- `src/app/screens/HomeScreen.tsx` · `src/app/preview/screens/reading.tsx`

## Decisions Made

- 카드 배경은 Figma raw `#eeebe1` 대신 이웃 행운 카드와 같은 `bg-opacity-card-apricot-50-50` + `border-apricot`
- 입구 글자 Display/15 는 스케일에 없어 `font-display text-ui-14`
- 한자(土 등)는 BE 가 주지 않아 element key 로 화면에서 붙인다

## Tests Executed

- `pnpm test`(382) · typecheck · lint
- 브라우저 375×812 `/preview/reading` — 순서(오행 → 잘 맞는 오행 → 행운)·문구 확인

## Test Results

- 전부 통과

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합. /dating 은 아직 빈 자리라 입구 링크도 빈 화면으로 간다 — 10/T4·10/T1 뒤에 채워진다.
