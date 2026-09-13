# 프론트 운영 배포 — 개인 fork + Netlify + Route53

ADR-20260914-netlify-personal-fork 의 설정·운영 절차.

```text
In-Dark-Developer/WKS-FE (main 병합)
  └─ Actions sync-fork ─ git push --force ─▶ jjjung0921/WKS-FE (private fork)
                                            └─ Netlify 자동 빌드·배포 (netlify.toml)
브라우저 ─ threatoffate.site ─ Route53 A 75.2.60.5 ─ Netlify
       └ api.threatoffate.site ─ Route53 ─ 백엔드 서버
```

## 1. Netlify 사이트 (fork 소유자 계정)

- Import from GitHub → `jjjung0921/WKS-FE` (연결됨, 2026-09-14)
- 빌드 설정은 저장소의 `netlify.toml` 이 정한다 — 빌드 `pnpm build`, 출력 `dist`, `VITE_API_BASE_URL`, 모든 경로 → `/index.html` 200, `/assets/*` 장기 캐시. 대시보드에 다른 값을 넣지 않는다

## 2. fork 자동 동기화

1. GitHub → Settings → Developer settings → **Fine-grained personal access token**
   - Resource owner: `jjjung0921`, Repository access: **Only select repositories → `jjjung0921/WKS-FE`**
   - Permissions: **Contents: Read and write**, **Workflows: Read and write** (`.github/workflows` 가 바뀐 커밋을 push 하려면 필요)
   - 조직 저장소 권한은 주지 않는다 — 원본은 Actions 기본 토큰으로 체크아웃하고 이 토큰은 fork 에 push 만 한다
   - 만료일은 축제 종료 뒤로
2. `In-Dark-Developer/WKS-FE` → Settings → Secrets and variables → Actions
   - **Secrets**: `FORK_SYNC_TOKEN` = 위 토큰
   - **Variables**: `NETLIFY_FORK_REPO` = `jjjung0921/WKS-FE`
3. Actions → `sync-fork` → Run workflow 로 한 번 확인 → fork 의 main 이 upstream 과 같은 커밋인지, Netlify 에 새 배포가 생겼는지 본다
4. fork 에서 직접 커밋하지 않는다 — 동기화가 fork `main` 을 upstream 으로 덮어쓴다

토큰을 넣기 전에는 워크플로우가 건너뛴다. 수동으로 맞출 때는 fork 페이지의 **Sync fork** 버튼.

## 3. 도메인 (Route53 — 백엔드 팀)

Netlify → Domain management → Add domain `threatoffate.site` (`www` 포함) 후, Route53 호스팅 영역에:

| 이름 | 유형 | 값 |
|------|------|----|
| `threatoffate.site` | A | `75.2.60.5` (Netlify 로드밸런서 — apex 에 다른 A 레코드가 있으면 지운다) |
| `www.threatoffate.site` | CNAME | `<사이트 이름>.netlify.app` |

HTTPS 인증서는 DNS 반영 뒤 Netlify 가 자동 발급한다(최대 하루).

## 4. 확인

1. `https://threatoffate.site` 가 열리고 `https://threatoffate.site/s/test` 새로고침이 앱을 연다
2. 운영 화면 DevTools Network 에서 `api.threatoffate.site` 호출이 CORS 오류 없이 간다

## 백엔드 팀에 요청

- CORS 허용 origin: `https://threatoffate.site`, `https://www.threatoffate.site` (도메인 연결 전 확인용으로 `https://<사이트 이름>.netlify.app`)
- Route53 레코드 3 의 두 줄, 운영 `/api` 접두 확인

## 주의

- **빌드 차단**: Netlify 무료 플랜은 private 저장소에 계정 멤버가 아닌 사람이 만든 커밋을 빌드하지 않는다('Unrecognized Git contributor'). fork 의 최신 커밋은 upstream `main` 의 머지 커밋이므로 **PR 병합은 fork 소유자(@jjjung0921)가 한다**. 다른 사람이 병합해 배포가 막히면 소유자가 빈 커밋 PR 을 병합해 다시 배포한다
- fork 는 조직 권한에 묶인다 — 소유자가 조직에서 빠지거나 private fork 허용이 꺼지면 fork 가 사라져 배포가 멈춘다
- 이전 AWS·Cloudflare 설정은 쓰지 않는다 — Cloudflare Workers `wks-fe` Git 연결 해제
