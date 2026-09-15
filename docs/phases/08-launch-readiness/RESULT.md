# Phase 08 — launch-readiness · Result

<!-- Phase 종료 시 완성한다. 진행 중에는 Task 가 요구한 확인 결과만 날짜와 함께 쌓는다. 실행하지 않은 검증을 완료로 적지 않는다. -->

- Completed on: (진행 중)
- Final Status: (진행 중)
- Tag: `phase/08`

## Completed

- T1. 상세 계획 (PR #66, #69)
- T2. 배포 설정 — 개인 fork + Netlify, `netlify.toml`·`sync-fork` (PR #75, #76)
- T3. 운영 연결 확인 — `https://threadoffate.site` HTTPS·새로고침·운영 origin CORS (PR #77, 재점검 2026-09-14)

## Not Completed

- T4 — 메타·썸네일·ADR·카카오톡 확인은 끝났고(2026-09-15), 앱별 미리보기 확인이 **1차 실패**다 (아래 Validation Results)
- T5 ~ T6 — 시작 전

## Deviations from Plan

- 호스팅이 Netlify → Cloudflare Pages → Workers → AWS S3 + CloudFront → 개인 fork + Netlify 로 바뀌었다 (ADR-20260914-netlify-personal-fork)
- 도메인 표기가 `threatoffate.site` 로 잘못 적혀 있었다 — 실제 도메인은 `threadoffate.site`(thread of fate). 2026-09-14 저장소 설정·문서를 고쳤다(대체된 ADR·지난 공지 본문은 그대로)

## Validation Results

### T4 공유 링크 미리보기 — 1차 실기기 검증 **실패** · 2026-09-15 (iPhone 13 · Safari · 운영)

실제 '친구에게 공유'로 만든 `/s/<shareId>` 링크로 확인했다. 앱별 미리보기를 보기 전에 링크 진입에서 막혀 **AC3 를 판정하지 못했다.**

| Check | Method | Result |
|-------|--------|--------|
| `/s/<id>` 가 OG 메타를 주는가 | `curl https://threadoffate.site/s/test` | ✅ og 9개 + twitter 4개 (SPA 폴백이 `index.html` 을 준다) |
| og 이미지 | `curl -I https://threadoffate.site/og/og-v2.jpg` | ✅ 200 · `image/jpeg` · 224,795B · 리다이렉트 0 · 1200×630 명시 |
| `www` → apex | `curl -o /dev/null -w %{redirect_url} https://www.threadoffate.site/` | ✅ 301 → `https://threadoffate.site/` |
| 다른 경로도 같은 메타 | `curl https://threadoffate.site/reading/abc` | ✅ 동일 (정적 메타 — ADR-20260915) |
| 카카오톡 미리보기 | @jjjung0921 (2026-09-15, 공유 디버거 캐시 초기화 후) | ✅ 제목·설명·썸네일 |
| **인스타 DM · iMessage · 라인** | iPhone 13 Safari | ⏸ **미확인** — 아래 진입 문제로 중단 |
| 내 기기에서 내 링크 진입 | iPhone 13 · iOS 26.3.1 · Safari (카카오톡에서) | ✅ 스펙대로 — 내 결과(SCR-04)로 간다. 백엔드 `SELF_COMPATIBILITY`, PRD FR-6 |
| 사생활 보호 탭 진입 | 같은 기기 | ✅ 스펙대로 — 인트로(FR-1) 뒤 공유 링크 입력(SCR-06). 주소는 `/s/:shareId` 그대로 |
| 결과 화면 운명 카드 | `/preview/reading` 브라우저 `getBoundingClientRect` 실측 | ✅ 결함 없음 — 카드 좌우 13/13 · 인스타 버튼 21/21 · 뒷면 오버행 8.4/8.4 모두 대칭, 앞면 높이 533.6 = `349/461` 값 533.7, 뒤집기 전후 동일, '긴 제목' 도 넘치지 않음. 스크린샷만 본 1차 판단(넘침·높이 초과)은 오판이었다 |
| Safari 기능 지원 | iOS 26.3.1 | ✅ 해당 없음 — `container-type`·`cqw`·`color-mix`·Tailwind v4(16.4+) 모두 지원. 초기 가설 폐기 |

판정 — **AC3 은 카카오톡만 확인됐고 인스타 DM·기타 메신저는 미확인이다.** 보고된 3건은 모두 결함이 아니었다 — 진입 2건은 스펙대로(FR-6·SCR-06)이고 카드 레이아웃은 실측에서 Figma 와 일치한다. 2차 검증은 **다른 기기에서 남의 링크**로 하고 미리보기 **카드 탭**이 `shareId` 를 유지하는지도 함께 본다.


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
