# Phase 08 — launch-readiness · Result

<!-- Phase 종료 시 완성한다. 진행 중에는 Task 가 요구한 확인 결과만 날짜와 함께 쌓는다. 실행하지 않은 검증을 완료로 적지 않는다. -->

- Completed on: (진행 중)
- Final Status: (진행 중)
- Tag: `phase/08`

## Completed

- T1. 상세 계획 (PR #66, #69)
- T2. 배포 설정 — 개인 fork + Netlify, `netlify.toml`·`sync-fork` (PR #75, #76)
- T3. 운영 연결 확인 — `https://threadoffate.site` HTTPS·새로고침·운영 origin CORS (PR #77, 재점검 2026-09-14)
- T4. 공유 링크 미리보기 — 공통 OG·Twitter 메타·썸네일·기각 ADR (PR #124) + 4개 앱 실기기 확인 (2026-09-17)

## Not Completed

- T5 — CI 크기 검사 + LCP 줄이는 변경(포스터·preload, gtag·Amplitude load 뒤로). 운영 재측정은 배포 뒤 (아래 T5 절)
- T6 — 시작 전

## Deviations from Plan

- 호스팅이 Netlify → Cloudflare Pages → Workers → AWS S3 + CloudFront → 개인 fork + Netlify 로 바뀌었다 (ADR-20260914-netlify-personal-fork)
- 도메인 표기가 `threatoffate.site` 로 잘못 적혀 있었다 — 실제 도메인은 `threadoffate.site`(thread of fate). 2026-09-14 저장소 설정·문서를 고쳤다(대체된 ADR·지난 공지 본문은 그대로)

## Validation Results

### T5 성능 예산 — 1차 측정 **LCP 초과** · 2026-09-24 (운영 `https://threadoffate.site/`, 첫 방문)

Lighthouse 12.8.2 · 모바일 · simulate(느린 4G: RTT 150ms · 1.6Mbps · CPU ×4) · 새 프로필(= 첫 방문, 인트로 영상이 뜬다) · `npx lighthouse@12 … --only-categories=performance`

| 회차 | Perf | LCP | FCP | TBT | CLS | 전송량 |
|------|------|-----|-----|-----|-----|--------|
| 1 | 71 | 4.77s | 3.72s | 53ms | 0 | 1.62MB |
| 2 | 72 | 4.70s | 3.65s | 60ms | 0 | 1.62MB |
| 3 | 68 | 5.60s | 3.63s | 57ms | 0 | 1.62MB |
| **중앙값** | 71 | **4.77s ❌ (예산 2.5s)** | 3.65s | 57ms | 0 | |

- 초기 JS: **161.4KB gzip ✅ (예산 250KB)** — `pnpm build` 산출물의 entry 하나(`scripts/check-bundle-size.mjs`). 운영 전송 153KB.
- LCP 요소는 **인트로 영상**(`<video src=intro-*.mp4>`, FR-1). 전송량의 66% 가 이 영상 1.07MB 이고 첫 화면 JS 와 같은 대역폭을 나눠 쓴다.
- 그 밖에 첫 화면에 받는 것: gtag.js 176KB(외부, async — 미사용 70KB) · Amplitude 청크 `esm-*.js` 61KB(시작 직후 동적 import — 미사용 35KB) · 메인 번들 미사용 80KB(소개팅 등 다른 화면 코드).
- 원인 후보(효과 큰 순): ① 인트로 영상 — 포스터 없음·용량 ② gtag·Amplitude 가 첫 화면 대역폭·메인 스레드를 쓴다 ③ 라우트 단위 코드 분할 없음. 줄이는 변경은 T5 Touches(`src/` 없음) 밖이라 제안 후 진행한다.

### T5 성능 예산 — 2차 **줄이는 변경** · 2026-09-24 (로컬 `vite preview`, 같은 빌드 전·후 비교)

변경: ① 인트로 영상 `poster`(첫 프레임 webp 7KB, `public/intro-poster.webp`) + `index.html` preload ② gtag.js 를 window `load` 뒤에 받기(호출은 dataLayer 에 먼저 쌓임) ③ Amplitude SDK 를 `load` 뒤 idle 에 받기(`src/lib/analytics.ts`, 그 사이 이벤트는 pending).

| 조건 (각 3회 중앙값) | 전 LCP | 후 LCP | 전 FCP | 후 FCP |
|------|------|------|------|------|
| Lighthouse devtools 스로틀(실제 느린 4G 대역폭) | 5.03s | **2.52s** | 3.27s | 2.52s |
| Lighthouse simulate(모델 추정) | 4.11s | 4.23s | 2.95s | 2.79s |

- devtools(실제로 대역폭을 나눠 받는 조건)에서 LCP −50%, 이제 LCP = FCP — 첫 화면이 뜨는 순간 포스터가 함께 그려진다.
- simulate 는 `<video>` LCP 를 영상 요청 기준으로 모델링해 변화가 없다(LCP 요소 = 인트로 영상). 로컬은 TTFB 가 운영보다 ~0.3s 짧다.
- 남은 병목은 FCP 자체 — 메인 번들 161KB gzip(첫 화면에 쓰지 않는 80KB 포함)의 파싱·실행. 2.5s 안으로 확실히 넣으려면 라우트 단위 코드 분할(`src/app/routes/`, Lead 영역)이 필요하다 → 별도 Task 제안.
- 운영 재측정(Lighthouse 모바일 3회)은 dev → main 릴리스 배포 뒤 이 절에 덧붙인다.

### T4 공유 링크 미리보기 — 2차 검증 **통과** · 2026-09-17 (iPhone 13 · iOS 26.3.1 · 운영)

실제 '친구에게 공유'로 만든 `https://threadoffate.site/s/:shareId` 를 앱마다 붙여 확인했다.

| 앱 | 제목 | 설명 | 썸네일 | Result |
|----|------|------|--------|--------|
| 카카오톡 | 운명도 꿰어야 사랑이다 | 생년월일로 점지받는 나의 인연 | og-v2.jpg | ✅ (9/15 @jjjung0921 확인, 9/17 재확인) |
| 인스타그램 DM | 〃 | 〃 | 〃 | ✅ |
| iMessage | 〃 | 〃 | 〃 | ✅ |
| 라인 · 텔레그램 | 〃 | 〃 | 〃 | ✅ |

**AC3 충족 — SC-6 의 "카카오·인스타·메신저에서 제목·설명·썸네일이 보인다"를 네 앱에서 확인했다.**

- 동적 미리보기(`shareId` 별)는 ADR-20260915-share-preview-static-meta 로 기각됐고, 모든 경로가 `index.html` 의 공통 메타를 쓴다.
- 미리보기 **카드 탭**이 `og:url`(루트) 로 가는지에 대한 우려는 **소유자 확인 결과 기획·기능 오해였다**(2026-09-17) — 안건 종료, `index.html` 미변경.

### T3 운영 연결 재점검 — 2026-09-14 14:40·14:50 KST (`dig @8.8.8.8`, `curl`, `gh run list`)

| Check | Method | Result |
|-------|--------|--------|
| fork 동기화 | Actions `sync-fork` 최근 3회 (push, 최신 `2d2c9af`) | ✅ 모두 success |
| Netlify 사이트 | `curl https://wks-fe.netlify.app/` · `…/s/test` | ✅ 200 · 200 — 사이트 이름이 `effulgent-torrone-699094` → `wks-fe` 로 바뀜(옛 주소 404) |
| apex 레코드 | `dig A threadoffate.site` | ✅ `75.2.60.5` (TTL 300) |
| www 레코드 | `dig CNAME www.threadoffate.site` | ✅ `wks-fe.netlify.app` |
| 도메인이 Netlify 에 붙음 | `curl http://www.threadoffate.site/` · `curl --resolve threadoffate.site:80:75.2.60.5 http://threadoffate.site/s/test` | ✅ 301 → `http://threadoffate.site/` (`server: Netlify`) · 200 `text/html` |
| 빌드된 API 주소 | 운영 번들 `assets/index-DS_V52x0.js` | ✅ `https://api.threadoffate.site/api` |
| 자산 캐시 | `curl -I …/assets/index-*.js` | ✅ `public,max-age=31536000,immutable` |
| `https://threadoffate.site`·`www` | `curl -v https://…` (14:40) | ❌ 인증서가 `*.netlify.app` — 도메인 인증서 미발급 (Netlify "Pending DNS verification") → 소유자가 DNS 검증 재시도, 14:44 발급 |
| 도메인 인증서 (14:50) | `curl -v https://threadoffate.site/` | ✅ Let's Encrypt `CN=threadoffate.site`, apex·`www` 포함, 만료 2026-12-13(자동 갱신) |
| HTTPS 주소·리다이렉트 (14:50) | `curl https://threadoffate.site/` · `/s/test` · `https://www…` · `http://…` | ✅ 200 · 200 `text/html` · 301 → apex · 301 → HTTPS, `strict-transport-security` 있음 |
| 백엔드 HTTPS | `curl https://api.threadoffate.site/api/health` · `http://…` | ✅ 200 `{"status":"UP"}` · HTTP 는 301 → HTTPS |
| CORS | `OPTIONS https://api.threadoffate.site/api/results` (POST, `content-type`), Origin 3개 | ✅ 200, `Access-Control-Allow-Origin` 이 `https://threadoffate.site`·`https://www.threadoffate.site`·`https://wks-fe.netlify.app` 각각 반사 |
| 운영 화면에서 API 호출 (14:50) | 브라우저로 `https://threadoffate.site/s/test` 를 연 뒤 페이지에서 `fetch` — `GET /api/health`, `GET /api/results/<없는 UUID>`(`Content-Type: application/json`, preflight 발생) | ✅ 200 `UP` · 404 `RESULT_NOT_FOUND` 봉투, CORS 오류 없음. 운영 DB 에 쓰지 않으려고 `POST /results` 는 부르지 않았다 |
| 운영 화면 렌더 | 브라우저 `https://threadoffate.site/` | ✅ 사주 입력 화면, 자산·폰트 전부 200 |

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

- 운영 문서 `docs/deploy/netlify-fork.md` 가 옛 사이트 이름 `effulgent-torrone-699094.netlify.app` 을 적고 있다
- 운영 배포는 개인 계정(fork·Netlify·토큰)에 묶여 있다 (ADR-20260914-netlify-personal-fork)

## Follow-up Work

- `docs/deploy/netlify-fork.md` 의 사이트 이름을 `wks-fe.netlify.app` 으로 고친다 (T3 Touches 밖 — 별도 스트림)
