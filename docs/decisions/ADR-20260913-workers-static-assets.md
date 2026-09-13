# ADR-20260913: Cloudflare Pages 대신 Cloudflare Workers 정적 자산으로 배포

- Status: Superseded by ADR-20260914-aws-cloudfront-hosting
- Date: 2026-09-13
- Deciders: @jjjung0921 (Phase 08 Lead)

## Context

ADR-20260913-cloudflare-pages-hosting 대로 Cloudflare 에 저장소를 연결했더니 프로젝트가 Pages 가 아니라 Workers(Workers Builds)로 만들어졌다.
Workers Builds 는 배포에 `npx wrangler deploy` 를 쓰고 저장소에 wrangler 가 없으면 설치하는데, pnpm 11 이 wrangler 의 네이티브 의존성(esbuild·workerd) 설치 스크립트를 막아 첫 배포가 `ERR_PNPM_IGNORED_BUILDS` 로 실패했다.

## Problem

이미 만든 Workers 프로젝트로 배포할 것인가, Pages 프로젝트를 다시 만들 것인가.

## Alternatives

1. Pages 프로젝트를 다시 만든다 — 이전 ADR 그대로, 저장소 변경 거의 없음 / 대시보드에서 Pages 생성 경로를 따로 찾아 다시 연결해야 한다
2. Workers 정적 자산(assets-only Worker) — 지금 프로젝트 그대로, Cloudflare 가 새 프로젝트에 권하는 방식, 정적 자산 요청은 무료 / 저장소에 `wrangler.jsonc`·`wrangler` 개발 의존성·pnpm 빌드 허용 설정이 생긴다

## Decision

대안 2 (소유자 결정, 2026-09-13). ADR-20260913-cloudflare-pages-hosting 의 호스팅 제품만 대체한다 — 도메인(`threatoffate.site`·`api.threatoffate.site`), 네임서버 이전, `api` DNS only, CORS·백엔드 확인 목록은 그대로다.

- `wrangler.jsonc`: 스크립트 없이 `dist` 를 올리고 `not_found_handling: "single-page-application"` 으로 모르는 경로에 `index.html` 을 준다. `public/_headers` 는 그대로 쓴다
- `wrangler` 를 개발 의존성으로 고정해 빌드가 설치하지 않게 하고, `pnpm-workspace.yaml` 의 `allowBuilds` 로 esbuild·workerd 설치 스크립트만 허용한다
- Workers Builds 설정: 빌드 명령 `pnpm build`, 배포 명령 `npx wrangler deploy`(기본값), 빌드 변수 `VITE_API_BASE_URL`·`PNPM_VERSION`. Worker 이름은 `wrangler.jsonc` 의 `name`(`wks-fe`)과 같아야 한다
- 운영 도메인은 Worker 의 Custom Domains 에 `threatoffate.site`·`www.threatoffate.site` 로 붙인다

## Rationale

이미 연결된 프로젝트를 쓰면 대시보드 작업을 다시 하지 않고 저장소 설정 세 파일로 끝난다. 정적 자산만 올리는 Worker 는 요청 수 과금 대상이 아니라 무료 조건이 Pages 와 같다.

## Consequences

- 긍정: 배포 설정이 저장소에 있어 PR 로 리뷰된다. `wrangler deploy --dry-run` 으로 로컬에서 산출물 구성을 확인할 수 있다.
- 부정 / 감수한 것: 개발 의존성 `wrangler` 가 설치 시간·용량을 늘린다. PR 미리보기 주소가 `*.pages.dev` 가 아니라 Workers 미리보기 주소(`*.workers.dev`)라 백엔드 CORS 에 미리보기를 허용하려면 그 주소를 쓴다.
- 후속 작업: ARCHITECTURE External Systems(이 PR), Phase 08 PLAN T2·Dependencies(이 PR). 공유 링크 동적 미리보기(08/T4)는 Pages Functions 대신 Worker 스크립트가 후보가 된다.
