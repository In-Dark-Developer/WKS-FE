# PRD — 운꿰사 (WKS) 프론트엔드

- Status: Draft
- Last updated: 2026-09-23

요구사항의 source of truth 다. 한 파일이 28KB 로 커져 절별로 나눴다 — 읽는 쪽은 필요한 조각만 연다
(ADR-20260923-prd-split). 파일을 더 쪼갤 때도 **FR 표는 한 파일에 둔다**: 색인 동기화가 `docs/prd/` 의
`| FR-… |` 줄을 그대로 읽는다.

| 파일 | 내용 | 주로 보는 때 |
|------|------|--------------|
| [`10-product.md`](10-product.md) | Problem · Goals · Target Users · User Stories | 왜 만드는지 확인할 때 |
| [`20-screens.md`](20-screens.md) | Screens(SCR-01~14) 표 · 공유 링크 흐름 | 화면·라우트를 정할 때 |
| [`30-functional-requirements.md`](30-functional-requirements.md) | FR-1~18 | 구현·리뷰 기준을 볼 때 |
| [`40-quality.md`](40-quality.md) | NFR-1~6 · Success Criteria | 검증·QA 를 설계할 때 |
| [`50-scope.md`](50-scope.md) | Constraints · Non-goals · Open Questions | 범위·미정 항목을 다룰 때 |

디자인(Figma 「UI 최종 - 개발용」)과 이 묶음이 어긋나면 **디자인이 우선한다**(2026-09-12 결정).
V1(로그인·소개팅·재화) 요구사항은 아직 이 묶음에 없다 — Notion PRD DB 에 있고, 확정되면 여기로 옮긴다.
