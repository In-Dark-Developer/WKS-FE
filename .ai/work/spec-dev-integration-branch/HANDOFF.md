# Handoff — spec-dev-integration-branch

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

스트림이 `dev` 에서 갈라져 `dev` 로 돌아오고, 운영 배포는 `dev` → `main` 릴리스 PR 만 일으킨다.

## Work Completed

- `scripts/lib/common.sh`: `main_ref()` 제거, `INTEG_BRANCH`(기본 dev, `AI_INTEG_BRANCH` 로 덮어쓰기) + `integ_ref()` 도입. 호출부 13곳 교체
- `ai-stream.sh` 의 main 문구·`merge` 서브커맨드·보호 규칙 조회를 통합 브랜치 기준으로
- 워크플로: `ci.yml` push 트리거 `[dev, main]`, `notion-index-sync.yml` `[dev]`
- `AGENTS.md` Rule 4·5·7·9·15·Session Procedure·History, `README.md`, `netlify.toml` 주석
- ADR-20260923-dev-as-default-branch (Deciders @jjjung0921) + Required 공지

## Work In Progress

- 없음

## Files Changed

- `scripts/{lib/common.sh,ai-stream.sh,ai-end.sh,ai-start.sh,notion-index-sync.sh}`
- `.github/workflows/{ci,notion-index-sync}.yml` · `AGENTS.md` · `README.md` · `netlify.toml`
- `docs/decisions/ADR-20260923-dev-as-default-branch.md` · `.ai/team/`

## Decisions Made

- 통합 브랜치 이름을 한 변수로 모았다 — 나중에 바꾸더라도 스크립트 한 줄이다.
- Netlify 는 계속 `main` 을 빌드한다. 즉 운영 배포 트리거가 "스트림 병합" 에서 "릴리스 PR 병합" 으로 옮겨간다.
- 저장소 설정(룰셋·기본 브랜치)은 이 PR 에 포함할 수 없어 소유자 작업으로 남긴다.

## Tests Executed

- `bash -n` (스크립트 5개) · YAML 파싱 2개 · `scripts/ai-stream.sh status` · `scripts/ai-end.sh --quick`

## Test Results

- status 가 "active streams (origin/dev 기준…)" 으로 뜨고 미병합 스트림 6개를 그대로 찾는다

## Known Problems

- **순서가 중요하다**: `main` 전용 룰셋을 먼저 만들지 않고 기본 브랜치를 바꾸면, 기존 룰셋이 `~DEFAULT_BRANCH` 대상이라 운영 브랜치 `main` 이 잠깐 무보호가 된다.
- 열려 있는 PR #155~#158 은 base 가 `main` 이다 — 그대로 병합하고, 다음 스트림부터 `dev` 를 base 로 쓴다.

## Unverified Assumptions

- `git merge dev` 로 바뀐 절차는 다음 스트림에서 실제로 돌려 봐야 확인된다. 이 스트림 자체는 `origin/dev` 를 병합해 확인했다.

## Exact Next Action

GitHub 설정 2건을 적용한다 (아래 Exact Next Action 의 명령).
