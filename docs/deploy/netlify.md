# 프론트 운영 배포 — Netlify + Route53

ADR-20260922-netlify-org-repo-direct 의 설정·운영 절차. (개인 fork 중계를 쓰던 이전 구성은 ADR-20260914-netlify-personal-fork.)

```text
In-Dark-Developer/WKS-FE (main 병합)
  └─ Netlify 자동 빌드·배포 (netlify.toml)
브라우저 ─ threadoffate.site ─ Route53 A 75.2.60.5 ─ Netlify (main)
       ├ dev.threadoffate.site ─ Netlify 브랜치 배포 (dev) ─ api-dev.threadoffate.site (백엔드 dev 서버)
       └ api.threadoffate.site ─ Route53 ─ 백엔드 운영 서버
```

## 1. Netlify 사이트

- 사이트 `wks-fe` → Site configuration → Build & deploy → Continuous deployment
- 연결 저장소 `In-Dark-Developer/WKS-FE`, production branch `main`
- 빌드 설정은 저장소의 `netlify.toml` 이 정한다 — 빌드 `pnpm build`, 출력 `dist`, `VITE_API_BASE_URL`, 모든 경로 → `/index.html` 200, `/assets/*` 장기 캐시. 대시보드에 다른 값을 넣지 않는다
- `main` 병합이 곧 운영 배포다. 멈추려면 Deploys → **Lock to stop auto publishing**

## 2. 도메인 (Route53 — 백엔드 팀)

Netlify → Domain management → `threadoffate.site` (`www` 포함) 후, Route53 호스팅 영역에:

| 이름 | 유형 | 값 |
|------|------|----|
| `threadoffate.site` | A | `75.2.60.5` (Netlify 로드밸런서 — apex 에 다른 A 레코드가 있으면 지운다) |
| `www.threadoffate.site` | CNAME | 사이트의 `*.netlify.app` 주소 (Netlify → Domain management 에서 현재 값 확인) |

HTTPS 인증서는 DNS 반영 뒤 Netlify 가 자동 발급한다(최대 하루).

`dev.threadoffate.site` 는 `dev` 브랜치 배포(`dev--<사이트>.netlify.app`)를 보여야 한다. Netlify 가 이 이름을 사이트의
도메인 별칭으로 받으면 운영(main) 빌드를 내준다 — 2026-09-24 에 그렇게 운영 번들이 나가던 것을 Netlify 의 브랜치 배포 도메인
설정으로 바로잡았다. 확인은 두 주소의 번들 이름이 같은지로 한다:

```bash
curl -sL https://dev.threadoffate.site/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'
curl -sL https://dev--wks-fe.netlify.app/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'
```

사이트를 새로 만들지 않고 연결 저장소만 바꾸면 이 레코드는 건드릴 필요가 없다 — CNAME 대상도 그대로다. 새 사이트를 만들면 `www` CNAME 의 대상이 바뀌고 도메인을 떼었다 붙이는 사이 접속이 끊긴다.

(Phase 08 RESULT Known Issues 가 지적한 대로, 이전 문서는 Netlify 가 처음 붙여 준 이름을 적고 있었다. 사이트 이름은 대시보드가 기준이므로 여기에 박아 두지 않는다.)

## 3. 확인

1. `https://threadoffate.site` 가 열리고 `https://threadoffate.site/s/test` 새로고침이 앱을 연다
2. 운영 화면 DevTools Network 에서 `api.threadoffate.site` 호출이 CORS 오류 없이 간다
3. Netlify Deploys 의 최신 항목이 `Production: main@<병합 SHA> Published` 이고 SHA 가 `git rev-parse origin/main` 과 같다

## 백엔드 팀에 요청

- `api.threadoffate.site` 에 **HTTPS(443) 와 TLS 인증서** — 프론트가 HTTPS 라 HTTP API 는 브라우저가 막는다
- CORS 허용 origin: `https://threadoffate.site`, `https://www.threadoffate.site`, `https://dev.threadoffate.site`, 그리고 사이트의 `*.netlify.app` 주소
- dev 배포는 백엔드 dev 서버 `api-dev.threadoffate.site` 를 부른다(`netlify.toml` 의 `[context.dev.environment]`, 2026-09-26).
  dev 서버 CORS 에 `https://dev.threadoffate.site` 를, `KAKAO_ALLOWED_REDIRECT_URIS` 에 `https://dev.threadoffate.site/auth/kakao/callback`
  을 둔다. 운영 서버에는 운영 콜백 `https://threadoffate.site/auth/kakao/callback` 을 둔다
- Route53 레코드 2 의 두 줄, 운영 `/api` 접두 확인

## 주의

- fork 를 쓰던 시절의 제약('Unrecognized Git contributor' 때문에 fork 소유자만 병합)은 없어졌다 — 저장소가 public 이라 누가 병합해도 빌드된다
- 이전 AWS·Cloudflare 설정은 쓰지 않는다
