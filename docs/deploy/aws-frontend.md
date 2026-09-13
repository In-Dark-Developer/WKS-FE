# 프론트 운영 배포 — S3 + CloudFront + Route53

ADR-20260914-aws-cloudfront-hosting 의 설정 절차. AWS 콘솔에서 한 번만 한다(백엔드 팀 AWS 계정, Route53 호스팅 영역 `threatoffate.site`).
끝나면 `main` 병합마다 `.github/workflows/deploy.yml` 이 빌드 → S3 업로드 → CloudFront 캐시 무효화를 한다.

```text
브라우저 ─ threatoffate.site ─ Route53 Alias ─ CloudFront(HTTPS, ACM) ─ OAC ─ S3(dist, 비공개)
       └ api.threatoffate.site ─ Route53 ─ 백엔드 서버
```

## 1. S3 버킷

- 리전 `ap-northeast-2`(서울), 이름 예: `wks-fe-production`
- **모든 퍼블릭 액세스 차단: 켬** · 정적 웹사이트 호스팅: 끔 (CloudFront 만 읽는다)

## 2. ACM 인증서 — 반드시 `us-east-1`

- CloudFront 는 버지니아 북부(`us-east-1`) 인증서만 쓴다
- 도메인 `threatoffate.site`, `www.threatoffate.site` · DNS 검증 → **Route53 에서 레코드 생성** 버튼 → 상태 '발급됨'까지 기다린다

## 3. CloudFront 배포

| 항목 | 값 |
|------|----|
| Origin | 1 의 S3 버킷 (웹사이트 엔드포인트가 아닌 버킷 주소) |
| Origin access | **Origin access control(OAC)** 새로 만들기 → 생성 후 안내되는 버킷 정책을 S3 버킷 정책에 붙인다 |
| Viewer protocol policy | Redirect HTTP to HTTPS |
| Cache policy | CachingOptimized (업로드 때 넣는 `Cache-Control` 을 따른다) · 압축 켬 |
| Alternate domain names | `threatoffate.site`, `www.threatoffate.site` |
| Custom SSL certificate | 2 의 인증서 |
| Default root object | `index.html` |
| **Error pages** | 403 → `/index.html`, 응답 코드 200, 캐시 TTL 0 · 404 → 같게 |
| Price class | 전체 또는 북미·유럽·아시아 |

Error pages 는 SPA 라우팅이다 — `/reading/abc`·`/s/<shareId>` 처럼 S3 에 없는 경로를 `index.html` 로 돌려 새로고침·공유 링크 직접 진입이 404 가 되지 않게 한다.
배포 ID(`E...`)를 적어 둔다.

## 4. Route53 레코드

호스팅 영역 `threatoffate.site` 에 네 개 — 모두 **별칭(Alias) → CloudFront 배포 → 3 의 배포**

| 이름 | 유형 |
|------|------|
| `threatoffate.site` | A |
| `threatoffate.site` | AAAA |
| `www.threatoffate.site` | A |
| `www.threatoffate.site` | AAAA |

`api.threatoffate.site` 는 백엔드 서버 레코드 그대로 둔다.

## 5. GitHub Actions 배포 역할 (OIDC — 비밀키 없음)

1. IAM → 자격 증명 공급자: `token.actions.githubusercontent.com` 이 없으면 추가 (OpenID Connect, 대상 `sts.amazonaws.com`)
2. IAM 역할 만들기 — 웹 자격 증명, 위 공급자, 대상 `sts.amazonaws.com`. 신뢰 정책의 조건:

```json
{
  "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
  "StringLike": { "token.actions.githubusercontent.com:sub": "repo:In-Dark-Developer/WKS-FE:ref:refs/heads/main" }
}
```

3. 권한 정책 (버킷 이름·계정 ID·배포 ID 를 바꾼다):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::wks-fe-production" },
    { "Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject"], "Resource": "arn:aws:s3:::wks-fe-production/*" },
    { "Effect": "Allow", "Action": ["cloudfront:CreateInvalidation"], "Resource": "arn:aws:cloudfront::<계정ID>:distribution/<배포ID>" }
  ]
}
```

역할 ARN 을 적어 둔다.

## 6. GitHub 저장소 변수

저장소 Settings → Secrets and variables → Actions → **Variables** (비밀값이 아니다)

| 이름 | 값 |
|------|----|
| `AWS_DEPLOY_ROLE_ARN` | 5 의 역할 ARN |
| `AWS_REGION` | `ap-northeast-2` |
| `S3_BUCKET` | `wks-fe-production` |
| `CLOUDFRONT_DISTRIBUTION_ID` | 3 의 배포 ID |
| `VITE_API_BASE_URL` | `https://api.threatoffate.site/api` |

`AWS_DEPLOY_ROLE_ARN` 이 비어 있으면 워크플로우는 건너뛴다(설정 전 병합이 실패하지 않게).

## 7. 확인

1. Actions → `deploy` → Run workflow (또는 `main` 병합) → 성공
2. `https://threatoffate.site` 가 열리고 `https://threatoffate.site/s/test` 새로고침이 앱을 연다
3. 운영 화면 DevTools Network 에서 `api.threatoffate.site` 호출이 CORS 오류 없이 간다

## 백엔드 팀에 요청

- CORS 허용 origin: `https://threatoffate.site`, `https://www.threatoffate.site` (끝에 `/` 없이)
- 운영 경로 `/api` 접두 확인, 사전신청 인증 완료 리다이렉트(`verify-redirect-url`)를 `https://threatoffate.site` 아래로

## 정리할 것 — 이전 Cloudflare 설정

Cloudflare Workers `wks-fe` 프로젝트가 저장소에 연결돼 있으면 push·PR 마다 빌드를 시도한다(이제 `wrangler.jsonc` 가 없다).
Workers & Pages → `wks-fe` → Settings → Build → Git 연결 해제, 또는 Worker 삭제.
