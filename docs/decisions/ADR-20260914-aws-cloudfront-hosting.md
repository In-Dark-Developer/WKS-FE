# ADR-20260914: 프론트를 S3 + CloudFront 에 올리고 DNS 는 Route53 에 둔다

- Status: Accepted
- Date: 2026-09-14
- Deciders: @jjjung0921 (Phase 08 Lead) / 백엔드 팀 (Route53·AWS 계정)

## Context

ADR-20260913-workers-static-assets 로 Cloudflare Workers 배포까지 됐지만, Workers 에 `threatoffate.site` 를 붙이려면 도메인 네임서버가 Cloudflare 에 있어야 한다.
백엔드 팀은 도메인 DNS 를 AWS Route53(호스팅 영역)에 두기로 했다. Cloudflare 무료 플랜은 외부 DNS 에서 CNAME 으로 붙이는 연결·서브도메인 위임을 지원하지 않는다.

## Problem

DNS 가 Route53 에 있을 때 프론트를 어디에 올리고 메인 도메인을 어떻게 연결하는가.

## Alternatives

1. 네임서버를 Cloudflare 로 옮기고 Workers 유지 — 비용 0, 저장소 그대로 / 백엔드 팀의 Route53 결정과 충돌
2. Netlify Pro — Route53 A 레코드(75.2.60.5)로 연결, 설정 최소 / 조직 private 저장소라 월 $20 (무료는 팀원 커밋 빌드 차단)
3. AWS Amplify Hosting — GitHub 연결·도메인 연결이 간단 / 무료 범위(월 15GB) 밖은 GB 당 $0.15
4. S3 + CloudFront — Route53 Alias 로 apex 연결, CloudFront 상시 무료(월 1TB·요청 1,000만)로 축제 규모 비용 사실상 0, 백엔드와 같은 AWS 계정 / 배포 워크플로우·AWS 리소스 설정을 직접 만든다

## Decision

대안 4 (소유자 결정, 2026-09-14). ADR-20260913-workers-static-assets 를 대체하고, ADR-20260913-cloudflare-pages-hosting 의 DNS 부분(네임서버 이전·`api` DNS only)도 무효가 된다. 주소(`threatoffate.site`·`api.threatoffate.site`)·`VITE_API_BASE_URL`·토큰 헤더·CORS 설계는 그대로다.

- 프론트: 비공개 S3 버킷(`ap-northeast-2`) + CloudFront(OAC, ACM `us-east-1` 인증서, 403·404 → `/index.html` 200 으로 SPA 라우팅)
- DNS: Route53 호스팅 영역에 apex·`www` A/AAAA Alias → CloudFront. `api` 는 백엔드 서버 레코드
- 배포: `.github/workflows/deploy.yml` — `main` push 마다 `pnpm build` → 해시 자산은 1년 immutable, 나머지는 `no-cache` 로 `aws s3 sync` → CloudFront `/*` 무효화. AWS 인증은 GitHub OIDC 역할(비밀키 없음), 설정값은 저장소 Variables
- 설정 절차: `docs/deploy/aws-frontend.md`

## Rationale

백엔드 팀이 Route53 을 유지하는 조건에서 비용이 0 에 가깝고 AWS 계정 하나로 관리되는 것은 대안 4 다. Netlify 는 설정은 가장 쉽지만 private 조직 저장소 조건에서 유일하게 고정 비용이 든다.
OIDC 역할은 main 브랜치에서만 가정할 수 있어 장기 키 유출 위험이 없다.

## Consequences

- 긍정: 월 비용 사실상 0(Route53 영역은 백엔드와 공유). 배포가 GitHub Actions 로그에 남는다.
- 부정 / 감수한 것: AWS 리소스 생성·IAM 역할은 사람이 콘솔에서 한 번 만든다. PR 미리보기 배포가 없다(필요하면 후속 워크플로우). SPA 폴백을 Error pages 로 해서 없는 해시 자산 요청도 `index.html` 200 을 받는다. `www` 는 리다이렉트 없이 같은 사이트를 보여 CORS 에 두 origin 을 허용한다.
- 후속 작업: Cloudflare Workers `wks-fe` 의 Git 연결 해제. 공유 링크 동적 미리보기(08/T4)는 CloudFront Functions/Lambda@Edge 와 백엔드 렌더 중 선택.
