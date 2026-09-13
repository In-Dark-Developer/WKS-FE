# 2026-09-13 backend-contract — 백엔드 계약(api-spec.md)이 나왔다. openapi 참조본을 통째로 교체했다

- Required: yes
- Applies to: all
- Change: docs/api/openapi.yaml · docs/PRD.md(Q3·Q7·Q14) · docs/ARCHITECTURE.md · docs/phases/01·03·05·06·07 PLAN.md · PR (spec-planning-feedback-0913)
- Action: `docs/api/openapi.yaml`을 다시 읽는다 — Base URL `/api`, 모든 응답은 `{success,data|error}` 봉투, `error.code` 9개, 세션 없음(내 결과는 `resultId`를 브라우저가 보관), 엔드포인트는 `/results` · `/results/{id}` · `/results/{id}/compatibility` · `/signups` · `/signups/resend` · `/signups/verify` · `/health` 뿐이다. `/readings` · `/shares` · `/me*` · `/matching*`는 없어졌으니 코드·PLAN에서 쓰지 않는다. 디자인·기획 피드백에는 있으나 계약에 없는 것(양·음력 · 12시진 · 십이간지 · 인연카드 등급 · 사전신청 추가 정보 · 후보·운명의 실)은 PRD에서 지우지 않았고 백엔드에 요청 중이다(Q3·Q14, 스트림 `spec-planning-feedback-0913` `notes/backend-questions.md`) — 해당 화면은 답이 올 때까지 계약에 있는 필드로만 구현한다.
- Until: Phase 08 종료
