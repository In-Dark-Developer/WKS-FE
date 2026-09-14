# Phase 08 — launch-readiness · Result

<!-- Phase 종료 시 완성한다. 진행 중에는 Task 가 요구한 확인 결과만 날짜와 함께 쌓는다. 실행하지 않은 검증을 완료로 적지 않는다. -->

- Completed on: (진행 중)
- Final Status: (진행 중)
- Tag: `phase/08`

## Completed

- T1. 상세 계획 (PR #66, #69)
- T2. 배포 설정 — 개인 fork + Netlify, `netlify.toml`·`sync-fork` (PR #75, #76)

## Not Completed

- T3. 운영 연결 확인 — 도메인 레코드·백엔드 HTTPS·CORS 대기 (아래 2026-09-14 점검)
- T4 ~ T6 — 시작 전

## Deviations from Plan

- 호스팅이 Netlify → Cloudflare Pages → Workers → AWS S3 + CloudFront → 개인 fork + Netlify 로 바뀌었다 (ADR-20260914-netlify-personal-fork)
- 도메인 표기가 `threatoffate.site` 로 잘못 적혀 있었다 — 실제 도메인은 `threadoffate.site`(thread of fate). 2026-09-14 저장소 설정·문서를 고쳤다(대체된 ADR·지난 공지 본문은 그대로)

## Validation Results

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

- 백엔드 HTTPS(443) 미설정 — 운영 화면에서 API 호출이 전부 실패한다
- 운영 배포는 개인 계정(fork·Netlify·토큰)에 묶여 있다 (ADR-20260914-netlify-personal-fork)

## Follow-up Work

- 백엔드: `api.threadoffate.site` TLS 인증서·443, CORS 허용 origin 3개, 운영 `/api` 접두 확인
- 백엔드(Route53): apex A `75.2.60.5`, `www` CNAME `effulgent-torrone-699094.netlify.app`
- 소유자: Netlify Domain management 에 `threadoffate.site` 추가
- 위가 끝나면 T3 재점검(같은 표)
