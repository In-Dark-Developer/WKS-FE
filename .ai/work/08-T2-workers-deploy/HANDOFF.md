# Handoff — 08-T2-workers-deploy

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 08/T2

## Goal

Cloudflare Workers Builds 배포가 ERR_PNPM_IGNORED_BUILDS 없이 dist 를 정적 자산으로 올린다.

## Work Completed

- 원인: 프로젝트가 Workers 로 만들어져 빌드가 wrangler 를 pnpm 으로 설치 → pnpm 11 이 esbuild·workerd 스크립트를 막음(로컬 재현)
- `pnpm-workspace.yaml` allowBuilds, `wrangler@4.131.1` devDependency, `wrangler.jsonc`(assets dist, SPA), `.gitignore` .wrangler
- ADR-20260913-workers-static-assets(cloudflare-pages 대체), ARCHITECTURE·openapi 참조, 08 PLAN T2·Dependencies, 공지(Required: no)

## Work In Progress

- 없음

## Files Changed

- CURRENT Touches 그대로

## Decisions Made

- 소유자: Pages 재생성 대신 Workers 정적 자산

## Tests Executed

- 재현 디렉터리에서 allowBuilds 전·후 `pnpm add -D wrangler`, `pnpm install --frozen-lockfile`, `wrangler deploy --dry-run`, test 185·typecheck·lint, redocly

## Test Results

- 통과 (allowBuilds 후 오류 사라짐, dry-run 이 dist 116 파일 읽음)

## Known Problems

- 대시보드 Worker 이름이 `wks-fe` 가 아니면 `wrangler.jsonc` name 을 맞춰야 한다
- 빌드 변수 VITE_API_BASE_URL·PNPM_VERSION 을 대시보드에 넣었는지 확인 필요

## Unverified Assumptions

- Worker 이름 `wks-fe`

## Exact Next Action

PR 리뷰 후 병합
