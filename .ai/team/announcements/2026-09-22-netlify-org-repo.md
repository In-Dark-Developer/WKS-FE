# 2026-09-22 netlify-org-repo — 운영 배포가 개인 fork 를 거치지 않고 이 저장소에서 바로 나간다

- Required: yes
- Applies to: all
- Change: ADR-20260922-netlify-org-repo-direct.md (ADR-20260914-netlify-personal-fork 대체) · `.github/workflows/sync-fork.yml` 삭제 · `netlify.toml` · `docs/ARCHITECTURE.md` · `docs/deploy/netlify.md`(옛 `netlify-fork.md`)
- Action: 배포 경로가 `main` 병합 → Netlify 한 단계가 됐다. fork `jjjung0921/WKS-FE`·`sync-fork` 워크플로우·`FORK_SYNC_TOKEN` 은 없어진다 — 배포 이야기를 할 때 fork 를 전제하지 않는다. 저장소가 public 이 되어 'Unrecognized Git contributor' 제약이 풀렸으니 **병합을 fork 소유자만 하던 규칙은 끝났다**(누가 병합해도 배포된다). 배포 절차 문서 경로가 `docs/deploy/netlify.md` 로 바뀌었으니 Relevant Documents 에 옛 경로를 적어 둔 스트림은 고친다. PR 마다 Netlify deploy preview 가 생긴다 — 화면 확인에 쓴다.
- Until: Phase 08 종료
