# ADR-20260914: 운영 배포는 개인 fork 를 Netlify 무료 플랜으로 빌드한다

- Status: Superseded by ADR-20260922-netlify-org-repo-direct
- Date: 2026-09-14
- Deciders: @jjjung0921 (Phase 08 Lead)

## Context

ADR-20260914-aws-cloudfront-hosting 은 백엔드 팀이 DNS 를 Route53 에 두는 조건에서 프론트를 S3 + CloudFront 에 올리기로 했지만, AWS 리소스·IAM 역할 설정이 아직 없다.
그사이 소유자가 조직 private fork 허용을 켜고(2026-09-14) 저장소를 개인 계정(`jjjung0921/WKS-FE`)에 fork 해 Netlify 무료 플랜에 연결했더니 배포가 됐다.
Netlify 는 외부 DNS 에서 apex A 레코드(`75.2.60.5`)로 도메인을 붙일 수 있어 Route53 조건과도 맞는다.

## Problem

AWS 설정 대신 개인 fork + Netlify 무료로 운영 배포할 것인가, 그렇다면 조직 저장소의 병합을 fork 에 어떻게 반영하는가.

## Alternatives

1. AWS S3 + CloudFront (이전 ADR) — 조직 저장소에서 바로 배포, 비용 사실상 0 / 백엔드 팀의 콘솔 설정·IAM 역할이 선행돼야 한다
2. 개인 fork + Netlify 무료, fork 동기화는 사람이 'Sync fork' — 설정 최소 / 병합할 때마다 잊지 않고 눌러야 한다
3. 개인 fork + Netlify 무료, 조직 저장소 Actions 가 병합마다 fork 를 동기화 — 사람 손 없음 / fork 쓰기 권한 토큰을 조직 저장소 비밀값으로 둔다
4. Netlify Pro 로 조직 저장소 직접 연결 — 가장 단순 / 월 $20

## Decision

대안 3 (소유자 결정, 2026-09-14). ADR-20260914-aws-cloudfront-hosting 을 대체한다. 주소(`threadoffate.site`·`api.threadoffate.site`)·DNS Route53·`VITE_API_BASE_URL`·토큰 헤더 설계는 그대로다.

- `netlify.toml`: 빌드 `pnpm build` → `dist`, 운영 `VITE_API_BASE_URL`, SPA 폴백 `/* → /index.html 200`, `/assets/*` 장기 캐시
- `.github/workflows/sync-fork.yml`: 조직 저장소 `main` push 마다 `merge-upstream` 으로 fork `main` 을 맞춘다 — Netlify 는 fork push 로 빌드한다. 토큰은 fork 한 저장소에만 쓰기 권한이 있는 fine-grained PAT(`FORK_SYNC_TOKEN`)
- DNS: Route53 apex A `75.2.60.5`, `www` CNAME `<사이트>.netlify.app`
- 설정·운영 절차: `docs/deploy/netlify-fork.md`

## Rationale

AWS 설정을 기다리지 않고 지금 무료로 배포되는 경로가 이미 동작한다. 동기화를 자동으로 두면 '병합 = 배포' 가 유지되고, 토큰 권한을 fork 한 곳의 콘텐츠·워크플로우로 좁혀 유출 시 피해를 줄인다.

## Consequences

- 긍정: 비용 0, 설정 대부분이 저장소에 있다(`netlify.toml`·워크플로우). PR 미리보기는 fork 에 PR 이 없어 생기지 않지만 운영 배포는 자동이다.
- 부정 / 감수한 것:
  - Netlify 무료 플랜의 private 저장소 규칙상 fork 소유자가 아닌 사람이 만든 커밋이 최신이면 빌드가 막힐 수 있다 — `main` 병합은 소유자가 한다(docs 의 주의)
  - 운영이 한 사람의 개인 계정(fork·Netlify·PAT)에 묶인다 — 소유자가 조직에서 빠지거나 private fork 허용이 꺼지면 배포가 멈춘다
  - 조직 플랜 우회에 가까운 구성이라 Netlify 약관·조직 정책상 문제가 되면 대안 1 또는 4 로 되돌린다(이전 ADR·설정은 git 기록에 있다)
- 후속 작업: PAT·Secrets·Variables 등록(소유자), Route53 레코드·CORS(백엔드), Cloudflare Workers Git 연결 해제. AWS 설정 문서는 삭제(필요하면 커밋 2c4fabc 에서 복원).
