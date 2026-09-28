# Handoff — chore-ci-sync-check-warn

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-24
- Phase / Task: -/-

## Goal

PR 이 열린 뒤 dev 가 앞서가도 ai-check 가 FAIL 하지 않고 경고만 하며, 메시지는 기준 브랜치(dev)를 가리킨다.

## Work Completed

- `chk_sync`: --ci 는 warn, 그 밖(--ready)은 FAIL 유지. 메시지는 `${base#origin/}`
- 공지 `2026-09-24-ci-sync-warn`(Required: no) + 색인

## Work In Progress

- 없음

## Files Changed

- `scripts/ai-end.sh` · `.ai/team/announcements/2026-09-24-ci-sync-warn.md` · `.ai/team/README.md`

## Decisions Made

- dev 룰셋(disabled)은 소유자 결정으로 그대로 둔다 — up-to-date 강제 없음

## Tests Executed

- `CI_BASE=origin/main scripts/ai-end.sh --ci` → warn, `CI_BASE=origin/dev` → ok · `bash -n`

## Test Results

- 기대대로 동작

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR CI 확인 후 병합.
