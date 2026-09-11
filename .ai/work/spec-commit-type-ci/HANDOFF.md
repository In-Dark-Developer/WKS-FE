# Handoff — spec-commit-type-ci

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: -/-

## Goal

워크플로만 바꾸는 커밋을 `ci` type 으로 쓸 수 있고, 훅·PR 제목 검사·문서가 같은 목록을 본다.

## Work Completed

- `.githooks/commit-msg` — 허용 type 정규식과 실패 안내문에 `ci` 추가
- `scripts/ai-end.sh` `chk_pr_title` — PR 제목 정규식에 `ci` 추가
- `AGENTS.md` Commit Format — type 목록 갱신
- 공지 `2026-09-12-commit-type-ci`

## Work In Progress

- 없음

## Files Changed

- `.githooks/commit-msg` · `scripts/ai-end.sh:chk_pr_title` · `AGENTS.md` · `.ai/team/announcements/2026-09-12-commit-type-ci.md` · `.ai/team/README.md`

## Decisions Made

- 세 곳(훅·PR 제목 검사·문서)을 한 커밋에 함께 고쳤다 — 목록이 갈라지면 훅은 통과하고 CI 가 막는 상태가 된다
- 01/T5 에서 막혔던 원래 커밋은 되살리지 않는다. push 된 이력은 그대로 두고 앞으로만 적용한다

## Tests Executed

- 이 스트림의 작업 커밋 자체를 `ci(hooks): ...` 로 썼다

## Test Results

- 훅이 통과시켰다(`da1ae2b`). 변경 전이었다면 막혔을 형식이다. PR 제목도 `ci(...)` 로 올려 `ai-check` 가 검증한다

## Known Problems

- 기존 커밋 중 워크플로만 바꾼 것들(`chore(ci)`, `024da75`)은 그대로 `chore` 다 — 이력을 다시 쓰지 않는다

## Unverified Assumptions

- 팀원이 `git config core.hooksPath .githooks` 를 적용해 두었다고 가정한다(`ai-stream.sh setup --local` 이 설정한다)

## Exact Next Action

PR을 올려 병합하고, 이후 워크플로 커밋은 ci type 으로 쓴다.
