# PRD — 운꿰사 (WKS) 프론트엔드

- Status: Draft (V1)
- Last updated: 2026-09-24

요구사항의 source of truth 다. 한 파일이 28KB 로 커져 절별로 나눴다 — 읽는 쪽은 필요한 조각만 연다
(ADR-20260923-prd-split). 파일을 더 쪼갤 때도 **FR 표는 한 파일에 둔다**: 색인 동기화가 `docs/prd/` 의
`| FR-… |` 줄을 그대로 읽는다.

| 파일 | 내용 | 주로 보는 때 |
|------|------|--------------|
| [`10-product.md`](10-product.md) | Problem · Goals · Target Users · User Stories | 왜 만드는지 확인할 때 |
| [`20-screens.md`](20-screens.md) | Screens(SCR-01~23) 표 · V1 흐름 · 공유 링크 흐름 | 화면·라우트를 정할 때 |
| [`30-functional-requirements.md`](30-functional-requirements.md) | FR-1~32 | 구현·리뷰 기준을 볼 때 |
| [`40-quality.md`](40-quality.md) | NFR-1~10 · Success Criteria(SC-1~9) | 검증·QA 를 설계할 때 |
| [`50-scope.md`](50-scope.md) | Constraints · Non-goals · Open Questions | 범위·미정 항목을 다룰 때 |

디자인과 이 묶음이 어긋나면 **디자인이 우선한다**(2026-09-12 결정). 구현 기준 파일은 V0.5 가
「UI 최종 - 개발용」(`tzWb3S2guXz5zH2DMeX8Yt`), V1 이 `imSnlOGTqwtPhGyzhA8yc9`(v1.0)다.

**번호 읽는 법** — FR-1~FR-18 · NFR-1~NFR-6 · SC-1~SC-6 은 V0.5(축제 운영본)이고, FR-19~FR-32 ·
NFR-7~NFR-10 · SC-7~SC-9 이 V1 에서 더해졌다. V1 이 대체하는 V0.5 요구는 그 줄 끝에 **V1** 표시로
이어받는 FR 을 적었다 — Phase PLAN·ADR 이 옛 번호를 참조하므로 번호를 다시 매기지 않는다.
미해결 질문은 Q15~Q21 이 V1 몫이다.
