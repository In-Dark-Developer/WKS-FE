# Handoff — 08-T2-netlify-fork-deploy

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 08/T2

## Goal

조직 저장소 `main` 병합이 개인 fork 동기화를 거쳐 Netlify 무료 플랜으로 `threatoffate.site` 에 배포된다.

## Work Completed

- `netlify.toml` 복원(주석만 새 ADR), `.github/workflows/sync-fork.yml`(push main → merge-upstream, upstream 에서만, 변수 없으면 건너뜀)
- AWS `deploy.yml`·`docs/deploy/aws-frontend.md` 삭제, `docs/deploy/netlify-fork.md`(PAT 범위·Secret/Variable·Route53 A 75.2.60.5·www CNAME·주의)
- ADR-20260914-netlify-personal-fork(aws 대체, 위험 명시), ARCHITECTURE·openapi·08 PLAN·공지

## Work In Progress

- 없음

## Files Changed

- CURRENT Touches 그대로

## Decisions Made

- 소유자: 개인 fork + Netlify 무료. 동기화는 조직 저장소 Actions + fork 전용 fine-grained PAT(스케줄 동기화는 Actions 분 소모로 기각)

## Tests Executed

- sync-fork.yml YAML 파싱, fork 존재·private 확인(gh), redocly, phases·announce --check, lint

## Test Results

- 통과 (워크플로우 실제 실행은 PAT 등록 후)

## Known Problems

- 소유자 외 병합 시 Netlify 무료 플랜 빌드 차단 가능
- 운영이 개인 계정(fork·Netlify·PAT)에 묶임, 조직 플랜 우회 성격 — ADR 에 되돌림 경로
- fork 에 netlify.toml 이 들어가기 전 배포는 SPA 새로고침 404·API 주소 없음

## Unverified Assumptions

- merge-upstream 이 fine-grained PAT(Contents·Workflows)로 동작

## Exact Next Action

PR 리뷰 후 병합
