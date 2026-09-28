# Handoff — 09-T17-birthdate-today-notice

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 09 Lead — PR 리뷰) · 곽도윤(백엔드 — 문서와 구현이 다르다)
- Date: 2026-09-28
- Phase / Task: 09/T17

## Goal

생년월일에 오늘·미래를 넣으면 그 칸 오류 문구로 이유를 알리고, 사주 입력·공유 입력·소개팅 (1/2) 이 같은 규칙과 문구를 쓴다.

## Work Completed

- **원인 확인(추정 아님)**: dev 백엔드에 직접 호출해 봤다 — `birthDate` 가 **오늘이면 400 INVALID_INPUT**, **어제면 201** 이다. 폼은 오늘을 통과시켜, 사용자에게는 칸 오류가 아니라 연결 실패 안내가 떴다
- 받는 마지막 날을 **어제**로 바꿨다(`lastAllowedIso`). 문구도 이유를 담았다 — "1950년 1월 1일부터 **어제**까지의 날짜로 작성해 주세요 (오늘·미래는 사주를 볼 수 없어요)"
- 사주 입력(SCR-02)과 공유 입력(SCR-06)은 `SajuForm` 을 함께 쓰므로 한 곳을 고치면 둘 다 바뀐다. 소개팅 (1/2) 은 별 스키마라 같은 규칙·문구로 맞췄다
- 문구가 갈리지 않게 양쪽 테스트가 같은 문장을 각각 단언한다 — feature 끼리 import 하지 않기 위해서다(CONVENTIONS 6장)

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/features/saju/formSchema.ts` · `src/features/dating/profile/profileSchema.ts` (+각 테스트)

## Decisions Made

- 오늘을 **막는** 쪽으로 정했다 — 백엔드가 받지 않으므로 폼에서 걸러 왕복을 줄이고 이유를 칸에 보인다
- 문구에 이유("오늘·미래는 사주를 볼 수 없어요")를 넣었다. Done when 의 "제출이 막히는 이유를 알린다" 를 따른 것이다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · dev 백엔드 실호출(오늘·어제·그제)

## Test Results

- 113 files / 652 passed · typecheck·lint 경고 0
- dev 백엔드: 2026-09-28 → 400 · 09-27 → 201 · 09-26 → 201

## Known Problems

- **백엔드 문서와 구현이 다르다** — api-spec §2 는 `birthDate` 범위를 "1950-01-01 ~ **오늘**" 이라고 적지만 구현은 오늘을 400 으로 막는다. 문서나 구현 한쪽을 맞춰야 한다(inconsistency 보고)
- 프론트가 기기 시각으로 '어제' 를 계산한다 — 기기 시계가 틀리면 경계 하루가 어긋날 수 있다. 서버 판정이 필요하면 백엔드가 경계를 알려줘야 한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고 09/T16(홈 운세 표시 순서)으로 넘어간다.
