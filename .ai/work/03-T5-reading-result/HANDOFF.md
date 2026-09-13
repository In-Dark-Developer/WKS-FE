# Handoff — 03-T5-reading-result

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/T5

## Goal

Figma 결과 화면(713:4021)의 운명 카드·행운·운세 3장·결과 대기·에러가 `ReadingView` props 로만 렌더되고 `/preview/reading` 에서 확인된다.

## Work Completed

- `ReadingResult`(view + share·ranking·teaser 슬롯 + Outlet) · `LuckySection` · `FortuneSection` · `FortuneLoading`(loading·delayed·error)
- ui `DestinyCard`(343×461 비례 축소, 좌표는 Figma px × --u) · `ZodiacCharacter`(12종·보살 이름)
- 에셋: 성곡체 woff2 원본 + `font-sungkok`, 등급 스탬프 SVG 6, 카드 장식 SVG(Figma 별·리본 합성)
- `/preview/reading`: 결과·긴 제목·십이간지 12종·대기·지연·에러

## Work In Progress

- 없음

## Files Changed

- CURRENT Touches 그대로 (+ 각 테스트)
- `docs/phases/03-saju-reading/PLAN.md`(T5 줄), `docs/phases/04-share-and-card/PLAN.md`(T2 가 DestinyCard 재사용)

## Decisions Made

- 소유자: 성곡체 추가(원본 woff2), 경찰감성체는 1MB 라 스탬프 6개만 SVG 로 — 폰트 파일 미커밋
- 소유자: 공유 버튼·친구 궁합 순위는 슬롯 prop 자리만
- 카드 앞면은 인연카드(04/T2)와 같아 ui 로 — features 간 import 금지 때문에
- 카드 치수는 CSS 파일에서 cqw 비례 — 임의값 클래스 없이 Figma 좌표 그대로

## Tests Executed

- `pnpm test`(127) · `typecheck` · `lint` · `build`(dist 에 preview 없음)
- 브라우저 375px: 카드 패널 323×439·캐릭터·스탬프 줄 좌표가 Figma 와 일치(DOM 측정), 긴 제목 말줄임, 12종, 에러

## Test Results

- 통과

## Known Problems

- Figma 는 'Sungkok Semi-Serif', 배포본은 'Sungkok Serif' — 글자 굵기 미세 차이
- 카드 텍스쳐는 배경 이미지에 구워져 리본 아래에 깔림(Figma 는 리본 위 overlay 60%) — 차이 미미
- `docs/CONVENTIONS.md` 폰트 표·디자인 토큰 ADR 에 `font-sungkok` 미기재(Touches 밖) — 후속 chore
- 애니메이션 슬롯은 점 3개 임시(십이지신 애니메이션 대기)
- Figma 결과 섹션의 Frame 91(링크 진입)·92(궁합 지도 확인)는 담당 Task 확인 필요

## Unverified Assumptions

- 보살 이름은 십이간지 카드(731:4740) 기준 — 결과 화면 예시는 '돼지보살'
- 스탬프 원 색: SS·S 노랑 · A+·A 빨강 · B+·B 파랑 (디자인 예시 SS 노랑·A+/C+ 빨강·B 파랑에서 추정)

## Exact Next Action

PR 리뷰 후 병합 → 04/T2
