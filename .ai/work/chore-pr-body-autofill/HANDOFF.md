# Handoff — chore-pr-body-autofill

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: -/-

## Goal

fill PR title and body from the stream draft

## Work Completed

- `ai-end.sh`: 초안을 `pr_draft_vars`/`pr_draft_title`/`pr_draft_body`(세션 기록 포함 여부 인자) 로 분리, `--ready` 는 이 함수를 쓴다
- `ai-end.sh --pr-title` / `--pr-body`: 검사 없이 초안만 stdout 에 (CI 가 쓴다)
- `ai-end.sh --ready --web`: `gh pr create --web --title --body-file` 로 제목·본문이 채워진 compare 페이지를 연다 (PR 이 이미 있으면 edit 후 `--web`). `--ready` 는 공지 색인 불일치도 warn 한다
- `ci.yml`: `pr-body` 잡 (opened + `ws/*` + 본문이 플레이스홀더일 때만 `gh pr edit`), `ai-check` 는 `needs: [pr-body]` + 현재 제목·본문 조회, `types` 에 `edited`, `commands` 는 edited 에서 skip
- 공지 `2026-09-12-pr-body-autofill` + `.ai/team/README.md` 색인 재생성 (병합된 spec PR 이 빼먹어 CI 가 FAIL 했다)

## Work In Progress

- 없음

## Files Changed

- `scripts/ai-end.sh` · `.github/workflows/ci.yml` · `.ai/team/announcements/2026-09-12-pr-body-autofill.md` · `.ai/team/README.md` · `.gitignore`

## Decisions Made

- 로컬 git hook 은 GitHub 웹 페이지를 채울 수 없다 → `--web` URL 프리필(로컬) + `pull_request: opened` 잡(원격) 두 경로로 같은 초안을 쓴다
- `--web` 본문은 URL 파라미터로 가므로 접힌 세션 기록을 뺀다 (`pr_draft_body 0`)
- 플레이스홀더 판정은 템플릿의 `<두세 문장` 마커 — 사람이 한 줄이라도 쓰면 건드리지 않는다
- `ai-check` 가 페이로드의 옛 제목 대신 `gh pr view` 의 현재 값을 읽는다 (pr-body 가 방금 고쳤을 수 있다)

## Tests Executed

- `bash -n scripts/ai-end.sh` · `python3 -c yaml.safe_load(ci.yml)`
- `scripts/ai-end.sh --pr-title` / `--pr-body` (stdout 에 초안만 나오는지)
- `pr-body` 잡의 판정 로직 3 케이스 재현: 웹 템플릿 그대로 / 사람이 다 쓴 PR / 규격 제목 + 빈 본문
- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `scripts/ai-end.sh --ci`

## Test Results

- 전부 통과. 초안 출력에 `say` 가 섞이지 않는다. 3 케이스 판정이 의도대로(채움 / 그대로 둠 / 본문만 채움)
- `--ci` 는 Status=IN_PROGRESS 만 FAIL (`--ready` 가 REVIEW 로 바꾼다), 공지 색인 ok

## Known Problems

- fork PR 은 `github.token` 이 write 가 아니라 `pr-body` 가 실패한다 (private 팀 저장소라 해당 없음 — 주석으로 남겼다)

## Unverified Assumptions

- `gh pr create --web` 가 `--title`/`--body-file` 을 compare URL 에 프리필한다 — 이 PR 로 실제 확인한다
- 병합 후 웹에서 템플릿 그대로 여는 PR 에서 `pr-body` → `ai-check` 가 한 번에 초록인지는 다음 PR 에서 확인

## Exact Next Action

`scripts/ai-end.sh --ready --web` 으로 이 스트림의 PR 을 열고 제목·본문 프리필을 눈으로 확인한다.
