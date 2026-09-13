# 2026-09-13 cloudflare-pages — 프론트 호스팅 Netlify → Cloudflare Pages (도메인은 그대로)

- Required: no
- Applies to: all
- Change: ADR-20260913-cloudflare-pages-hosting.md (hosting-and-domains 대체) · ARCHITECTURE External Systems
- Action: 공지 hosting-domains 의 'Netlify' 를 Cloudflare Pages 로 읽는다. 주소(`threatoffate.site`·`api.threatoffate.site`)·`VITE_API_BASE_URL`·CORS 는 그대로다. 산출물에 최상위 `404.html` 을 만들지 않는다(SPA 라우팅이 깨진다). 백엔드 확인 목록은 ADR Consequences.
- Until: Phase 08 종료
