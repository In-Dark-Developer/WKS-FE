# ADR-20260922: Netlify 를 조직 저장소에 직접 연결하고 개인 fork 중계를 없앤다

- Status: Accepted
- Date: 2026-09-22
- Deciders: @jjjung0921 (Phase 08 Lead)

## Context

ADR-20260914-netlify-personal-fork 는 조직 저장소가 private 이라 Netlify 무료 플랜으로 직접 연결할 수 없어, 개인 fork(`jjjung0921/WKS-FE`)를 중계로 두고 Actions `sync-fork` 가 병합마다 fork 를 force-push 로 맞추는 구성을 택했다. 그 ADR 은 대가를 셋 적어 두었다 — 운영이 한 사람의 개인 계정(fork·Netlify·PAT)에 묶이는 것, 무료 플랜의 'Unrecognized Git contributor' 때문에 병합을 fork 소유자만 할 수 있는 것, 조직 플랜 우회에 가까운 구성이라는 것.

2026-09-22 소유자가 조직 저장소 `In-Dark-Developer/WKS-FE` 를 public 으로 전환했다. 전제가 사라졌다 — public 저장소는 Netlify 무료 플랜에 직접 연결되고, GitHub Actions 도 분 과금이 없다.

같은 날 별도로 확인된 것: 2026-09-17 부터 조직 저장소의 Actions 가 지출 한도로 막혀 있었고(`The job was not started because recent account payments have failed or your spending limit needs to be increased`), 그 기간 `sync-fork` 도 실패해 fork 동기화를 사람이 GitHub UI 의 Sync fork 버튼으로 대신했다. 중계가 조용히 멈춰도 아무도 모르는 구조였다.

## Problem

전제가 사라진 중계를 유지할 것인가, Netlify 를 조직 저장소에 직접 붙이고 fork·워크플로우·PAT 를 없앨 것인가.

## Alternatives

1. 현행 유지 — 변경 0 / 개인 계정 의존·중계 실패 지점·PAT 수명 관리가 그대로 남는다
2. 기존 Netlify 사이트의 연결 저장소만 조직 저장소로 바꾼다 — 도메인·DNS·인증서가 그대로라 무중단 / Netlify 대시보드 조작 1회
3. 조직 저장소용 Netlify 사이트를 새로 만들고 도메인을 옮긴다 — 구성이 깨끗하다 / 도메인을 떼었다 붙이는 사이 접속 불가, 인증서 재발급, `www` CNAME 교체

## Decision

대안 2 (소유자 결정, 2026-09-22). ADR-20260914-netlify-personal-fork 를 대체한다. 주소(`threadoffate.site`·`api.threadoffate.site`)·DNS Route53·`VITE_API_BASE_URL`·`netlify.toml` 의 빌드 설정은 그대로다.

- Netlify 사이트 `wks-fe` 의 연결 저장소를 `jjjung0921/WKS-FE` → `In-Dark-Developer/WKS-FE`, production branch `main` 으로 바꾼다. 사이트를 새로 만들지 않으므로 도메인·인증서·`www` CNAME(`effulgent-torrone-699094.netlify.app`)이 유지된다
- `.github/workflows/sync-fork.yml` 삭제
- 조직 저장소의 Secret `FORK_SYNC_TOKEN` 과 Variable `NETLIFY_FORK_REPO` 삭제, 해당 fine-grained PAT 폐기
- fork `jjjung0921/WKS-FE` 는 운영 배포가 조직 저장소에서 한 번 성공한 뒤에 삭제한다

순서를 지킨다 — **Netlify 재연결과 배포 확인이 먼저, 저장소 정리가 나중.** 반대로 하면 운영이 갱신을 받지 못한 채 멈춘다(사이트는 떠 있으므로 장애는 아니고 배포만 정지한다).

## Rationale

중계가 존재한 유일한 이유가 없어졌다. 없애면 배포 경로가 `main` 병합 → Netlify 한 단계로 줄고, 실패할 수 있는 지점(Actions 실행·PAT 만료·fork 권한)이 셋 사라진다. 개인 계정 의존도 끝난다.

덤으로 public 전환이 두 가지를 더 푼다 — Actions 분 과금이 없어져 지출 한도로 CI 가 막히는 일이 사라지고, 'Unrecognized Git contributor' 제약이 사라져 누가 병합해도 배포가 된다. PR deploy preview 도 이제 생긴다(fork 에는 PR 이 없어 만들어지지 않았다).

## Consequences

- 긍정: 배포 경로 한 단계, 비밀값 한 개 감소, 개인 계정 의존 해소, PR 마다 deploy preview
- 부정 / 감수한 것:
  - 저장소가 public 이다 — `docs/`·`.ai/` 의 팀 내부 기록(PRD·기획 메모·스트림 인계·공지)이 공개된다. 비밀값은 GitHub Secrets 에 있어 노출되지 않지만, 과거 커밋에 비밀값이 섞였는지는 별도로 확인한다
  - `main` 병합이 곧 운영 배포라는 점은 그대로다. 중계가 없어져 지연이 더 짧아진다
- 후속 작업: Netlify 재연결(소유자) → 배포 확인 → Secret·Variable·PAT 폐기(소유자) → fork 삭제(소유자). 저장소 쪽 변경은 이 PR 이 담는다
