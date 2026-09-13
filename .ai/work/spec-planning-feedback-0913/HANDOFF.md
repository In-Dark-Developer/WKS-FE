# Handoff — spec-planning-feedback-0913

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

백엔드가 2026-09-13에 공개한 `api-spec.md` 계약이 `docs/api/openapi.yaml`에 그대로 반영되고, 디자인·PRD와 어긋나는 항목은 PRD Open Questions와 백엔드 문의 목록으로 등록되어 있다.

## Work Completed

- openapi 를 백엔드 api-spec.md(2026-09-13) 계약으로 교체 (7 경로 · 봉투 · ErrorCode 9개 · 세션 없음)
- PRD Q3·Q7 갱신, Q14(사전신청 정답) 추가, Constraints·Non-goals 문장 수정
- ARCHITECTURE·Phase 01/03/05/06/07 PLAN 의 `/readings` `/shares` `/me*` `/matching*` 참조 제거
- 공지 `2026-09-13-backend-contract` · 백엔드 문의 목록 `notes/backend-questions.md`(A~D 24항목)

## Work In Progress

- 없음 (백엔드 답변 대기)

## Files Changed

- `docs/api/openapi.yaml` · `docs/PRD.md` · `docs/ARCHITECTURE.md` · `docs/phases/01,03,04,05,06,07/PLAN.md` · `.ai/team/announcements/2026-09-13-{planning-feedback,backend-contract}.md` · `.ai/team/README.md` · `notes/backend-questions.md`

## Decisions Made

- 방향 2 채택(소유자 결정): openapi는 백엔드 계약 그대로, PRD의 디자인 우선 요구(양·음력·12시진·십이간지·인연카드 점수·사전신청 항목·후보·운명의 실)는 삭제하지 않고 백엔드에 추가 요청한다.

## Tests Executed

- `npx @redocly/cli lint docs/api/openapi.yaml` · `scripts/ai-stream.sh announce --check`

## Test Results

- lint 오류 0, 경고 4(license 없음 · localhost 서버 · 4xx 없는 /health) — 참조본이라 무시. 공지 색인 OK

## Known Problems

- 같은 스트림의 다른 Claude 세션이 기획 피드백을 WIP 커밋 10f1fda 로 남겼고(Wip: openapi 에 Grade·cardGrades·ShareSummary 를 다시 반영 예정) 이 커밋은 그 위에 있다. 방향 2(계약 그대로, 갭은 백엔드 요청)에 따라 그 항목은 openapi 가 아니라 `notes/backend-questions.md` A4·B1·B3 다 — 그 세션이 openapi 에 넣으면 방향과 어긋난다.
- 계약과 디자인의 큰 갭(Q3·Q14)에 백엔드 답이 없으면 Phase 03 T1 은 계약 필드만으로 시작해야 한다

## Unverified Assumptions

- 백엔드 dev 포트 8080 (문서에 없음, A6)
- `tier` 4값은 GUIIN·CHALTTEOK·BEOT·SEUCHIM 로 추정 — openapi 에는 enum 을 넣지 않았다 (B2)

## Exact Next Action

`notes/backend-questions.md`의 A·B 항목을 백엔드에 보낸다. 답이 오면 openapi 에 반영하고 Q3·Q7·Q14 를 닫는다.