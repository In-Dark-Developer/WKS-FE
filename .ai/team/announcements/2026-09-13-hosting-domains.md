# 2026-09-13 hosting-domains — 프론트 threatoffate.site(Netlify) · 백엔드 api.threatoffate.site

- Required: no
- Applies to: all
- Change: ADR-20260913-hosting-and-domains.md · ARCHITECTURE External Systems · openapi servers
- Action: 절대 주소를 코드에 쓰지 않는다 — API 는 `VITE_API_BASE_URL`, 공유 링크는 현재 origin(`location.origin`)으로 만든다. 백엔드에 CORS 허용 origin `https://threatoffate.site` 와 `/api` 접두를 확인받는다.
- Until: Phase 08 종료
