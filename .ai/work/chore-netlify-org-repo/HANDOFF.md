# Handoff — chore-netlify-org-repo

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-22
- Phase / Task: -/-

## Goal

운영 배포가 개인 fork 중계 없이 이 저장소 `main` 에서 Netlify 로 바로 나간다.

## Work Completed

- `ADR-20260922-netlify-org-repo-direct` 작성, `ADR-20260914-netlify-personal-fork` 를 `Superseded by` 로 표시
- `.github/workflows/sync-fork.yml` 삭제
- `netlify.toml` 머리 주석, `docs/ARCHITECTURE.md` External Systems 행 갱신
- `docs/deploy/netlify-fork.md` → `docs/deploy/netlify.md` 로 옮기고 fork 중계 절 제거
- 팀 공지 `2026-09-22-netlify-org-repo` 작성

## Work In Progress

- PR 의 Netlify deploy preview 로 org 레포 연결을 확인한 뒤 병합한다

## Files Changed

- 추가: `docs/decisions/ADR-20260922-netlify-org-repo-direct.md` · `docs/deploy/netlify.md` · `.ai/team/announcements/2026-09-22-netlify-org-repo.md`
- 수정: `netlify.toml` · `docs/ARCHITECTURE.md` · `docs/decisions/ADR-20260914-netlify-personal-fork.md`
- 삭제: `.github/workflows/sync-fork.yml` · `docs/deploy/netlify-fork.md`

## Decisions Made

- 사이트를 새로 만들지 않고 기존 `wks-fe` 사이트의 연결 저장소만 바꾼다 — 도메인·인증서·`www` CNAME 이 유지돼 무중단이다
- 순서: Netlify 재연결·배포 확인이 먼저, 저장소 정리가 나중. 반대면 운영이 갱신을 못 받은 채 멈춘다
- 새 배포 문서에 `*.netlify.app` 이름을 박지 않는다 — Phase 08 RESULT Known Issues 가 옛 이름이 문서에 굳은 것을 지적했다. 대시보드가 기준이다

## Tests Executed

- `scripts/ai-end.sh --quick`
- 저장소 전체에서 `sync-fork`·`netlify-fork`·`jjjung0921/WKS-FE` 잔존 참조 검색

## Test Results

- `--quick` 통과. 코드 변경 없음(워크플로·문서만)이라 test·typecheck·lint 대상 아님
- 잔존 참조는 `docs/phases/08-launch-readiness/` 의 과거 기록뿐 — Known Problems 참고

## Known Problems

- `docs/phases/08-launch-readiness/PLAN.md`(18·39·51줄)·`RESULT.md`(12·47·66·80·85줄)가 fork 구성과 옛 문서 경로 `docs/deploy/netlify-fork.md` 를 가리킨다. Phase 08 은 이 스트림 Touches 밖이고 RESULT 는 그 시점의 검증 기록이라 고치지 않았다. PLAN 의 링크만 새 경로로 고칠지는 Phase 08 Lead 판단
- 병합 후 남는 소유자 작업: 조직 저장소 Secret `FORK_SYNC_TOKEN`·Variable `NETLIFY_FORK_REPO` 삭제, fine-grained PAT 폐기, fork `jjjung0921/WKS-FE` 삭제(운영 배포가 org 레포에서 한 번 성공한 뒤에)

## Unverified Assumptions

- Netlify 재연결은 소유자 보고로만 확인했다(대시보드 접근 권한 없음) — PR 의 deploy preview 유무로 검증한다

## Exact Next Action

PR 에 Netlify deploy preview 가 붙었는지 확인하고, 붙었으면 병합한 뒤 운영 배포 SHA 가 `origin/main` 과 같은지 본다.
