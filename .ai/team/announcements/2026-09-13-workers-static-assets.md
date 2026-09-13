# 2026-09-13 workers-static-assets — 배포는 Cloudflare Workers 정적 자산 (Pages 아님)

- Required: no
- Applies to: all
- Change: ADR-20260913-workers-static-assets.md · wrangler.jsonc · pnpm-workspace.yaml
- Action: `git pull` 후 `pnpm install` (개발 의존성 wrangler 추가). 설치 스크립트가 필요한 의존성을 새로 넣으면 pnpm 11 이 설치를 막으니 `pnpm-workspace.yaml` 의 `allowBuilds` 에 이름을 추가한다. 도메인·API 주소·CORS 는 그대로다.
- Until: Phase 08 종료
