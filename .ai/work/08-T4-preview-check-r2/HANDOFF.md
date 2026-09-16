# Handoff — 08-T4-preview-check-r2

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: 08/T4

## Goal

`https://threadoffate.site/s/:shareId` 를 카카오·인스타·메신저에 붙였을 때 제목·설명·썸네일이 보이는 것을 실기기로 확인해 RESULT 에 남긴다 (SC-6, AC3).

## Work Completed

- 2차 실기기 검증(iPhone 13 · iOS 26.3.1 · 운영) — **카카오톡·인스타그램 DM·iMessage·라인 4개 앱에서 제목·설명·썸네일 확인**
- RESULT 에 AC3 통과 표 기록, `Not Completed` 에서 T4 제거하고 `Completed` 로 옮김
- PLAN T4 를 `[x]` 로 바꾸고 확인 범위·날짜를 줄에 적음, `docs/phases/README.md` 색인 재생성(08 = 4/6)

## Work In Progress

- 없음

## Files Changed

- `docs/phases/08-launch-readiness/RESULT.md` · `PLAN.md` · `docs/phases/README.md`(파생, Touches 확장)

## Decisions Made

- **미리보기 카드 탭이 `og:url`(루트)로 가는지에 대한 우려는 종결됐다** — 소유자 확인 결과 기획·기능 오해였다(2026-09-17). `index.html` 은 바꾸지 않았고 카카오 캐시 초기화도 필요 없다.
- 동적 미리보기는 ADR-20260915-share-preview-static-meta 로 이미 기각돼 있어 이 Task 에서 다시 다루지 않았다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` (문서만 바꿨으므로 회귀 확인용)
- `scripts/ai-stream.sh phases --check` · `scripts/ai-end.sh --ci`

## Test Results

- 통과 — 아래 LOG 의 수치 참고. 색인 일치, CI 검사 FAIL 0

## Known Problems

- 없음

## Unverified Assumptions

- 미리보기 문구·썸네일이 바뀌면 카카오는 URL 별로 캐시하므로 공유 디버거로 캐시를 지워야 한다(@jjjung0921 계정). 이번에는 메타를 바꾸지 않아 해당 없음.

## Exact Next Action

08/T4 는 끝났다 — `ai-end.sh --ready` 로 PR 을 올린다. 다음은 08/T5(성능 예산 측정)이고, 08/T6(@nicerjs23 출시 점검)의 `After: T4` 가 이 병합으로 풀린다.
