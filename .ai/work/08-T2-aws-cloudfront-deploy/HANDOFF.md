# Handoff — 08-T2-aws-cloudfront-deploy

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 08/T2

## Goal

`main` 병합이 GitHub Actions 로 S3 + CloudFront 에 배포되고, DNS 는 Route53 Alias 로 `threatoffate.site` 에 붙는다.

## Work Completed

- `.github/workflows/deploy.yml`: main push → build(VITE_API_BASE_URL 변수) → OIDC 역할 → assets immutable sync(삭제 안 함) → 나머지 no-cache sync --delete → CloudFront /* 무효화. 변수 없으면 건너뜀
- `docs/deploy/aws-frontend.md`: S3·ACM(us-east-1)·CloudFront(OAC, 403/404→index.html)·Route53 Alias·IAM OIDC 역할·Variables·확인·Cloudflare 정리
- wrangler·pnpm-workspace.yaml·public/_headers 제거, pnpm-lock.yaml 을 #69 시점으로 복원(esbuild 잔여 제거)
- ADR-20260914-aws-cloudfront-hosting(workers 대체), ARCHITECTURE·openapi·08 PLAN·공지

## Work In Progress

- 없음

## Files Changed

- CURRENT Touches 그대로

## Decisions Made

- 소유자·백엔드: DNS Route53 유지 → 프론트 AWS, Netlify(월 $20) 대신 S3 + CloudFront
- SPA 폴백은 CloudFront Error pages(코드 없음), www 는 리다이렉트 없이 같은 사이트 + CORS 두 origin

## Tests Executed

- test 201·typecheck·lint·build, frozen install, deploy.yml YAML 파싱, redocly, phases·announce --check

## Test Results

- 통과 (워크플로우 실제 실행은 AWS 설정 후 T3)

## Known Problems

- deploy.yml 은 AWS 리소스·Variables 전에는 실행 검증 불가
- Cloudflare Workers wks-fe Git 연결이 남아 있으면 PR 에 Workers Builds 실패가 뜬다 — 해제 필요
- PR 미리보기 배포 없음

## Unverified Assumptions

- 운영 API `/api` 접두, 백엔드 계정에 리소스 생성 권한

## Exact Next Action

PR 리뷰 후 병합
