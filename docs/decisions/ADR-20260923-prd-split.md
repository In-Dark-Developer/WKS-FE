# ADR-20260923: PRD 를 절별 파일 묶음(`docs/prd/`)으로 나눈다

- Status: Accepted
- Date: 2026-09-23
- Deciders: @jjjung0921 / 리뷰어

## Context

`docs/PRD.md` 는 한 파일에 28KB(137줄, 표 위주)였다. Rule 12 의 context budget 은 "파일은 필요한 부분만
읽는다" 인데, 이 문서는 화면 표·FR 표·미해결 질문이 한 파일이라 FR 하나를 확인하려 해도 전체를 열게 된다.
V1(로그인·소개팅·재화) 요구사항은 아직 이 저장소가 아니라 Notion PRD DB 에 있고, 확정되면 여기로 옮겨야
해서 문서는 더 커진다.

## Problem

요구사항 문서를 어떤 단위로 나눌 것인가. 그리고 `docs/PRD.md` 경로를 읽는 도구(색인 동기화·spec 판정)를
어떻게 함께 옮길 것인가.

## Alternatives

1. 그대로 둔다 — 도구를 안 건드려도 된다 / 한 FR 을 보려고 28KB 를 연다. V1 을 옮기면 더 커진다.
2. 도메인별로 나눈다(`10-saju.md`·`20-map.md`·`30-dating.md` …) — Notion PRD DB 의 `구분` 과 1:1 /
   지금 FR 은 18개뿐이라 파일마다 두세 줄이고, FR 표가 쪼개져 색인 동기화가 여러 파일을 합쳐 읽어야 한다.
3. 절별로 나눈다(제품·화면·FR·품질·범위) — 읽는 단위(왜 / 무엇을 그리나 / 무엇을 만족해야 하나)와
   파일이 일치하고 FR 표는 한 파일에 남는다 / 도메인 색인과는 어긋난다.

## Decision

3안을 택한다. `docs/prd/` 아래 `README.md`(지도) · `10-product.md` · `20-screens.md` ·
`30-functional-requirements.md` · `40-quality.md` · `50-scope.md` 로 나누고, `docs/PRD.md` 는 없앤다.
**FR·NFR 표는 한 파일 안에 둔다** — 색인 동기화가 `docs/prd/` 의 `| FR-… |` 줄을 그대로 읽기 때문이다.

도구는 경로만 넓힌다: `scripts/lib/common.sh` 의 `SPEC_PATHS`, `scripts/ai-start.sh` 의 spec 파일 판정,
`scripts/ai-end.sh` 의 spec diff 두 곳, `scripts/notion-index-sync.sh` 의 FR grep,
`.github/workflows/notion-index-sync.yml` 의 paths 필터.

## Rationale

- 나누는 기준은 "누가 언제 여는가" 다. 구현자는 FR 을, QA 는 품질 절을, 기획 논의는 범위 절을 연다.
- 도메인 분할(2안)은 V1 요구사항이 이 저장소로 들어온 뒤에야 값이 있다. 지금 하면 파일마다 두세 줄이라
  탐색 비용만 늘어난다 — 그때는 `30-functional-requirements.md` 를 도메인별로 다시 쪼개면 된다.
- 과거 ADR·공지·완료된 Phase PLAN 의 `docs/PRD.md` 언급은 그 시점의 기록이라 고치지 않는다. 대응 규칙은
  공지가 준다.

## Consequences

- 긍정: 한 절만 열면 된다. 스트림 Touches 를 `docs/prd/30-functional-requirements.md` 처럼 좁게 쓸 수 있어
  spec 스트림끼리 충돌이 줄어든다.
- 부정 / 감수한 것: 경로가 바뀌어 과거 문서의 링크 일부가 죽는다. 도구 여섯 곳을 같은 PR 에서 함께 고쳤다.
- 후속 작업: Notion PRD DB 의 V1 요구사항을 `docs/prd/` 로 옮기는 spec 스트림. 그때 FR 번호 체계를
  V1 기준으로 정리한다.
