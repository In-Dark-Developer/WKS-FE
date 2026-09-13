# Handoff — chore-issue-link

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

GitHub track 이슈 번호 하나로 에이전트가 스트림(브랜치·.ai/work·push)을 열고, 그 PR 이 병합되면 이슈가 자동으로 닫힌다.

## Work Completed

- `ai-stream.sh open … --issue N` 과 `open --issue N {slug}`(제목 `track(NN/Tk): …` 에서 Task) — CURRENT 에 `Issue: #N`, push 후 이슈 코멘트
- `ai-end.sh --ready/--pr-body` 본문 첫 줄 `Closes #N` (Issue 없으면 생략)
- CURRENT 템플릿 `Issue:` 줄 · render `{{ISSUE}}` · AGENTS.md Session Procedure · 공지 `2026-09-13-issue-link`

## Work In Progress

- 없음

## Files Changed

- `scripts/ai-stream.sh` · `scripts/ai-end.sh` · `scripts/lib/common.sh` · `.ai/work/_template/CURRENT.md` · `AGENTS.md` · `.ai/team/announcements/2026-09-13-issue-link.md` · `.ai/team/README.md`

## Decisions Made

- 이슈에서 브랜치를 만드는 주체는 CI 가 아니라 각자의 에이전트(로컬 `ai-stream.sh`) — Owner 가 git user 여야 하고 CI 봇은 스트림 소유자가 될 수 없다
- 이슈는 사람용 추적. 원본은 PLAN·CURRENT.md·Notion 보드 그대로

## Tests Executed

- `bash -n` 3개 스크립트 · 제목 정규식(`track(02/T1): …` → `02/T1`, `bug(x): y` → 없음) · CURRENT 에 `Issue: #99` 넣고 `--pr-body` 첫 줄 · `Issue: none` 이면 생략 · render 로 템플릿 `Issue:` 치환

## Test Results

- 전부 기대대로. 실제 `open --issue` 는 남의 Task 스트림을 만들게 되어 실행하지 않았다

## Known Problems

- `open --issue` 끝-대-끝은 미실행 — 첫 사용자(02 T1 @gn00py48)가 실검증한다. 실패하면 `open 02/T1 tokens-theme --issue 22` 로 우회
- 기존 스트림 CURRENT 에는 `Issue:` 줄이 없다 — `field` 가 빈 값을 돌려 none 취급

## Unverified Assumptions

- 팀원 로컬에 `gh` 가 로그인돼 있다 (없으면 `--issue` 가 die 한다)

## Exact Next Action

PR 병합 → 02 T1 담당이 `scripts/ai-stream.sh open --issue 22 tokens-theme` 로 첫 실검증.