# Handoff — chore-opacity-tokens

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

Figma 로컬 변수가 모두 theme.css 토큰으로 존재한다.

## Work Completed

- Figma 변수·스타일 전체와 theme.css 대조 — 누락은 `Opacity/*` 10개뿐
- `--color-opacity-{card|overlay}-<색>-<투명도>` 10개 추가, 값은 램프 변수 `color-mix` (commit 8371c62)
- CONVENTIONS 4장 표에 Opacity 행, 공지 `2026-09-13-opacity-tokens`

## Work In Progress

- 없음

## Files Changed

- `src/ui/tokens/theme.css`, `theme.test.ts`
- `docs/CONVENTIONS.md`
- `.ai/team/announcements/2026-09-13-opacity-tokens.md`, `.ai/team/README.md`

## Decisions Made

- 소유자 선택: Figma 이름 그대로 토큰화(투명도 표기 `/50` 대신)
- 값은 hex+alpha 대신 `color-mix(var(램프), N%, transparent)` — 램프를 바꾸면 따라간다
- 토큰 테스트는 선언 공백을 접어서 비교(Prettier 줄바꿈 대응)

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build`, `announce --check`

## Test Results

- 52 tests 통과, 나머지 통과

## Known Problems

- 흐림 10·15·25px 은 Figma 변수가 없고 Tailwind 기본 blur 스케일이 살아 있어 lint 가 막지 않는다
- 투명도 표기(`bg-neutral-0/50`)도 lint 가 막지 않는다 — 공지로만 금지
- 사주 결과 그라데이션 `#eee3d2`, 입력 버튼의 `Graphic/Moonlight` 연결은 디자인 확인 필요

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰(@gn00py48) 후 병합
