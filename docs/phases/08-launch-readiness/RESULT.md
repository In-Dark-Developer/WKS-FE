# Phase 08 — launch-readiness · Result

<!-- Phase 종료 시 완성한다. 진행 중에는 Task 가 요구한 확인 결과만 날짜와 함께 쌓는다. 실행하지 않은 검증을 완료로 적지 않는다. -->

- Completed on: (진행 중)
- Final Status: (진행 중)
- Tag: `phase/08`

## Completed

- T1. 상세 계획 (PR #66, #69)
- T2. 배포 설정 — 개인 fork + Netlify, `netlify.toml`·`sync-fork` (PR #75, #76)

## Not Completed

- T3. 운영 연결 확인 — Netlify 도메인 HTTPS 인증서 대기 (아래 2026-09-14 재점검). DNS 레코드·백엔드 HTTPS·CORS 는 해결됨
- T4 ~ T6 — 시작 전

## Deviations from Plan

- 호스팅이 Netlify → Cloudflare Pages → Workers → AWS S3 + CloudFront → 개인 fork + Netlify 로 바뀌었다 (ADR-20260914-netlify-personal-fork)
- 도메인 표기가 `threatoffate.site` 로 잘못 적혀 있었다 — 실제 도메인은 `threadoffate.site`(thread of fate). 2026-09-14 저장소 설정·문서를 고쳤다(대체된 ADR·지난 공지 본문은 그대로)

## Validation Results

### T3 운영 연결 재점검 — 2026-09-14 14:40 KST (`dig @8.8.8.8`, `curl`, `gh run list`)

| Check | Method | Result |
|-------|--------|--------|
| fork 동기화 | Actions `sync-fork` 최근 3회 (push, 최신 `2d2c9af`) | ✅ 모두 success |
| Netlify 사이트 | `curl https://wks-fe.netlify.app/` · `…/s/test` | ✅ 200 · 200 — 사이트 이름이 `effulgent-torrone-699094` → `wks-fe` 로 바뀜(옛 주소 404) |
| apex 레코드 | `dig A threadoffate.site` | ✅ `75.2.60.5` (TTL 300) |
| www 레코드 | `dig CNAME www.threadoffate.site` | ✅ `wks-fe.netlify.app` |
| 도메인이 Netlify 에 붙음 | `curl http://www.threadoffate.site/` · `curl --resolve threadoffate.site:80:75.2.60.5 http://threadoffate.site/s/test` | ✅ 301 → `http://threadoffate.site/` (`server: Netlify`) · 200 `text/html` |
| 빌드된 API 주소 | 운영 번들 `assets/index-DS_V52x0.js` | ✅ `https://api.threadoffate.site/api` |
| 자산 캐시 | `curl -I …/assets/index-*.js` | ✅ `public,max-age=31536000,immutable` |
| `https://threadoffate.site`·`www` | `curl -v https://…` | ❌ 인증서가 `*.netlify.app` — 도메인 인증서 미발급 (Netlify "Pending DNS verification") |
| 백엔드 HTTPS | `curl https://api.threadoffate.site/api/health` · `http://…` | ✅ 200 `{"status":"UP"}` · HTTP 는 301 → HTTPS |
| CORS | `OPTIONS https://api.threadoffate.site/api/results` (POST, `content-type`), Origin 3개 | ✅ 200, `Access-Control-Allow-Origin` 이 `https://threadoffate.site`·`https://www.threadoffate.site`·`https://wks-fe.netlify.app` 각각 반사 |
| 운영 화면에서 API 호출 | 브라우저 | ⏸ 인증서 발급 뒤 확인 |

### T3 운영 연결 점검 — 2026-09-14 (`dig @8.8.8.8`, `curl`)

| Check | Method | Result |
|-------|--------|--------|
| fork 동기화 | Actions `sync-fork` (push, `0b272a3`) · fork `main` 커밋 | ✅ success, fork `main` = upstream `0b272a3` |
| Netlify 배포 | `curl https://effulgent-torrone-699094.netlify.app/` | ✅ 200, `<title>운꿰사` |
| SPA 새로고침 | `curl …netlify.app/s/test` | ✅ 200 `text/html` (index.html) |
| 자산 캐시 | `curl -I …/assets/index-*.js` | ✅ `public,max-age=31536000,immutable` |
| 빌드된 API 주소 | 번들 JS 의 `https://api.*.site/api` | ❌ `https://api.threatoffate.site/api` (오타 도메인) — `netlify.toml` 수정, 병합·동기화 후 재확인 |
| 도메인 존재 | `dig NS threatoffate.site` / `threadoffate.site` | `threatoffate.site` NXDOMAIN · `threadoffate.site` Route53(awsdns) ✅ |
| apex·www 레코드 | `dig A threadoffate.site` · `dig CNAME www.threadoffate.site` | ❌ 없음 — Route53 에 A `75.2.60.5`·CNAME `effulgent-torrone-699094.netlify.app` 필요 |
| `https://threadoffate.site` | 브라우저·`curl` | ❌ 도메인 레코드 대기 |
| 백엔드 레코드 | `dig A api.threadoffate.site` | ✅ `54.117.20.241` |
| 백엔드 HTTPS | `curl https://api.threadoffate.site/` | ❌ 443 Connection refused — HTTP(80)만 응답. HTTPS 페이지에서 HTTP API 는 브라우저가 막는다(mixed content) |
| CORS | `OPTIONS http://api.threadoffate.site/api/results`, `Origin: https://effulgent-torrone-699094.netlify.app` | ❌ 403 — 이 origin 이 허용 목록에 없다 |

## Known Issues

- `threadoffate.site`·`www` HTTPS 인증서 미발급 — 운영 주소가 HTTPS 로 열리지 않는다
- 운영 문서 `docs/deploy/netlify-fork.md` 가 옛 사이트 이름 `effulgent-torrone-699094.netlify.app` 을 적고 있다
- 운영 배포는 개인 계정(fork·Netlify·토큰)에 묶여 있다 (ADR-20260914-netlify-personal-fork)

## Follow-up Work

- 소유자(@jjjung0921): Netlify Domain management 에서 DNS 검증 재시도 → HTTPS 인증서 발급
- 발급되면 T3 재점검: `https://threadoffate.site`·`www`·`/s/test` 새로고침, 운영 화면 API 호출(CORS)
- `docs/deploy/netlify-fork.md` 의 사이트 이름을 `wks-fe.netlify.app` 으로 고친다 (T3 Touches 밖 — 별도 스트림)
