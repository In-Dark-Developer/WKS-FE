# Handoff — chore-bootstrap

- From: claude-code
- To: 없음
- Date: 2026-09-11
- Phase / Task: 01/T1

## Goal

템플릿이 운꿰사 프론트엔드 저장소가 되어, 어떤 Agent든 AGENTS.md·PRD·ARCHITECTURE·Phase 계획만 읽고 Phase 01 T2 이후를 시작할 수 있다.

## Work Completed

- `AGENTS.md`(Project·Repository Map·Commands·Rule 13), `README.md` 프로젝트 소개로 교체
- `docs/PRD.md`(FR-1~14, NFR-1~6), `docs/ARCHITECTURE.md`(모듈 경계·의존 방향·데이터 흐름) 작성
- `docs/api/openapi.yaml` — 백엔드 계약 **참조본** 초안으로 교체
- `docs/decisions/ADR-20260911-frontend-stack-and-repo-scope.md`, 공지 `2026-09-11-bootstrap`, `docs/CONVENTIONS.md`(타입·이름·컴포넌트·Tailwind·데이터·import·테스트 규칙, Rule 13에서 참조)
- Phase 01 재작성, Phase 02~08 생성(02·03은 상세), `docs/phases/README.md` 표 갱신
- `.ai/BOOTSTRAP.md` 삭제, 기획 메모 → `docs/product-brief.md`
- 저장소 설정: merge commit 전용 + 병합 메시지 = PR 제목/본문

## Work In Progress

- 없음

## Files Changed

- `AGENTS.md`, `README.md`, `docs/CONVENTIONS.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/api/openapi.yaml`, `docs/decisions/ADR-20260911-*.md`, `docs/phases/01~08/PLAN.md`, `docs/phases/README.md`, `docs/product-brief.md`, `.ai/team/announcements/2026-09-11-bootstrap.md`, `.ai/README.md`

## Decisions Made

- 저장소는 프론트엔드 전용, 백엔드는 별도 저장소 — `docs/api/`는 참조본 (ADR-20260911)
- Vite SPA(React Router) 채택, Next.js 기각 — 공유 링크 OG는 백엔드가 소유. MVP에서 채팅·결제 제외(PRD Non-goals)
- Owner 열은 TBD, CODEOWNERS 생성은 Phase 01 T2로 미룸
- PRD·ADR·Phase 계획은 팀 회의 안건 — 이 PR 병합 전까지 확정 아님. 컨벤션만 먼저 문서로 고정

## Tests Executed

- `scripts/ai-stream.sh phases --check`, `scripts/ai-stream.sh announce --check`

## Test Results

- 둘 다 통과. 코드가 없어 test/typecheck/lint는 Phase 01 T3 전까지 실행 불가

## Known Problems

- main 보호 규칙 적용 실패: private 저장소 + GitHub Free 플랜이라 branch protection·ruleset API가 403. 저장소를 public 으로 바꾸거나 Pro 로 올려야 한다 (Phase 01 AC7)
- `.github/workflows/ci.yml` 의 commands 잡이 아직 placeholder echo 다 — 초록이지만 아무것도 검증하지 않는다 (Phase 01 T5에서 교체)
- `.github/CODEOWNERS` 는 비어 있다 (Phase 01 T2)

## Unverified Assumptions

- 백엔드 저장소가 별도로 존재하고 `docs/api/openapi.yaml` 의 경로·스키마와 비슷한 REST 계약을 낼 것 — 실제 계약은 Phase 01 T6/03 에서 맞춘다
- 궁합 점수(0~100)·25점 구간 등급·다섯 영역 점수는 서버가 계산해 내려준다. Node major 는 T3 에서 정한다(개발 머신 v26.7.0)
- 공유 링크의 OG 메타·썸네일을 백엔드가 제공한다 (불가하면 정적 기본 메타)
- Phase 04~08 의 순서와 의존은 초안 — 각 계획 스트림에서 조정한다

## Exact Next Action

팀 회의에서 PRD·스택 ADR·Phase 분할을 확정하고 PR을 병합한 뒤, Phase 01 T2(`ai-stream.sh open 01/T2 codeowners`) → T3 순으로 진행한다.
