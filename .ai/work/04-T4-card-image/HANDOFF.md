# Handoff — 04-T4-card-image

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 04/T4

## Goal

`src/lib/cardImage.ts` 의 `renderCardImage(card)` 가 인연카드 앞면 DOM 을 인스타 스토리 규격(1080×1920) PNG `Blob` 으로 만들고, 생성 방식과 기각한 대안이 ADR 로 남는다 (FR-5 의 재료).

## Work Completed

- `src/lib/cardImage.ts` — `buildStoryFrame`(화면 밖 1080×1920 프레임 + 카드 사본) · `renderCardImage`(동적 import → `toBlob`) · `cardImageFileName`
- `src/lib/cardImage.test.ts` — 7개 (프레임 규격·원본 불변·사본 확대·성공·null·실패 정리·파일명)
- `docs/decisions/ADR-20260914-card-image-rendering.md` — 대안 4개와 기각 이유
- `html-to-image@1.11.13` 의존성 추가

## Work In Progress

- 없음

## Files Changed

- `src/lib/cardImage.ts`, `src/lib/cardImage.test.ts`
- `docs/decisions/ADR-20260914-card-image-rendering.md`
- `package.json`, `pnpm-lock.yaml`

## Decisions Made

- **`html-to-image` 채택 (동적 import).** 카드가 컨테이너 쿼리(`cqw`)·`aspect-ratio`·`color-mix`·webp 배경·커스텀 폰트를 쓰므로 브라우저 렌더러를 그대로 쓰는 `foreignObject` 방식이어야 한다. 기각: `html2canvas`(3.4MB·렌더러 재구현이라 위 CSS 를 못 따라온다), 직접 캔버스 드로잉(레이아웃 재구현 — 마감 3일에 불가), 백엔드 렌더(프론트 전용 저장소·계약 없음).
- 초기 번들(NFR-2 250KB gzip)을 지키려고 `await import('html-to-image')` 로 별도 청크에 둔다.
- 화면에 보이지 않는 1080×1920 프레임을 만들어 카드 사본을 가운데 놓고 그 프레임을 찍는다 — 원본 카드는 건드리지 않는다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` (청크 분리 실측 포함)

## Test Results

- 47 files / 213 tests 통과(신규 7) · typecheck 통과 · lint 경고 0
- 번들 — `html-to-image` 가 별도 청크 **gzip 5.10KB** 로 갈라지고 초기 JS 는 147.20KB 그대로(NFR-2 250KB 예산 유지). `src/main.tsx` 에 임시 참조를 넣어 재고 원복했다.

## Known Problems

- `src/lib/cardImage.ts` 를 아직 아무도 import 하지 않아 실제 앱 번들에는 들어가지 않는다 — 04/T5 가 화면에 이으면 위 청크가 생긴다.
- 첫 린트에서 배경색 hex 가 '임의 색상 금지' 에 걸렸다. `var(--color-primary-900/700)` 토큰 참조로 바꾸고 `backgroundColor` 옵션은 뺐다(프레임이 이미 불투명).

## Unverified Assumptions

- jsdom 에는 캔버스·`foreignObject` 렌더가 없어 **실제 PNG 결과는 이 Task 에서 눈으로 확인할 수 없다**. 라이브러리 호출과 프레임 조립만 테스트하고, 실물 확인은 T5(`/preview/card`)·실기기에서 한다.
- 폰트 인라인 — Pretendard 가 dynamic subset(다수 woff2)이라 라이브러리 기본 동작이 느릴 수 있다. 동국체 434KB·성곡체 205KB 도 base64 로 들어간다. 실제 소요 시간은 T5 에서 재야 한다.

## Exact Next Action

04/T1 계획 PR 병합 후 `git merge main` → PLAN T4 에 `(commit f0c9a39)` 기록 → `ai-end.sh --ready`. 이어서 T5 가 이 함수를 Web Share(파일)·저장 폴백에 잇는다.
