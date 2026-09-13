# 2026-09-14 netlify-personal-fork — 운영 배포는 @jjjung0921 개인 fork 를 Netlify 가 빌드 (AWS 안 씀)

- Required: no
- Applies to: all
- Change: ADR-20260914-netlify-personal-fork.md · netlify.toml · .github/workflows/sync-fork.yml · docs/deploy/netlify-fork.md
- Action: `main` PR 병합은 @jjjung0921 이 한다 — 다른 사람이 병합하면 Netlify 무료 플랜이 배포를 막을 수 있다. `main` 병합이 곧 운영 배포다. 이전 공지 aws-cloudfront-hosting 의 AWS 설정은 무효다.
- Until: Phase 08 종료
