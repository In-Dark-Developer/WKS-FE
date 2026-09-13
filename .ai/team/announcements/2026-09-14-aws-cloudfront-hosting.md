# 2026-09-14 aws-cloudfront-hosting — 프론트 배포는 S3 + CloudFront, DNS 는 Route53 (Cloudflare 안 씀)

- Required: no
- Applies to: all
- Change: ADR-20260914-aws-cloudfront-hosting.md · .github/workflows/deploy.yml · docs/deploy/aws-frontend.md
- Action: `git pull` 후 `pnpm install` (wrangler 제거). `main` 병합이 곧 운영 배포다 — 병합 전 CI 통과를 꼭 확인한다. 최상위 경로를 새로 만들어도 CloudFront 가 `index.html` 로 돌려준다. 이전 공지 cloudflare-pages·workers-static-assets 의 Cloudflare 설정은 무효다.
- Until: Phase 08 종료
