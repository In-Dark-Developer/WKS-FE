# Handoff — chore-announce-index

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/- (chore)

## Goal

공지 색인(.ai/team/README.md)이 공지 파일 목록과 같다.

## Work Completed

- `scripts/ai-stream.sh announce` 로 색인 재생성 — 2026-09-29-release-pr-ci 한 줄이 빠져 있었다

## Work In Progress

- 없음

## Files Changed

- `.ai/team/README.md` (한 줄 추가)

## Decisions Made

- 없음 — 생성물 갱신이다

## Tests Executed

- `scripts/ai-end.sh --ci` (공지 색인 검사 통과 확인)

## Test Results

- 색인 검사 통과

## Known Problems

- 공지를 추가한 PR(#332)에 색인을 함께 넣었어야 했다 — 다음부터 공지 추가 시 `announce` 를 같은 커밋에 넣는다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 dev 로 올린다.
