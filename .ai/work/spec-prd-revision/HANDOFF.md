# Handoff — spec-prd-revision

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: -/-

## Goal

`docs/PRD.md`가 구현·검증 가능한 문서가 된다 — 빠진 요구를 채우고, Success Criteria를 확인 절차로 바꾸고, 미확정 사항을 Open Questions에 모아 소유자가 결정할 것을 드러낸다.

## Work Completed

- FR-15(공유 링크 착지 화면) · FR-16(Web Share 폴백) · FR-17(동의 고지) · FR-18(세션 만료 안내) 추가 — 셋은 ARCHITECTURE에는 있는데 PRD에는 없던 요구다
- Success Criteria를 SC-1~6 확인 절차 표로 교체 — "이탈 없이 완주 가능" 같은 문장은 검증할 수 없다
- Open Questions Q1~Q5 신설 — 미확정 사항이 Constraints 안에 흩어져 있었다

## Work In Progress

- 없음

## Files Changed

- `docs/PRD.md` (FR 표 4행 추가 · Success Criteria 절 교체 · Open Questions 절 신설 · Constraints 1줄)

## Decisions Made

- 기존 FR 번호를 다시 매기지 않고 뒤에 붙였다 — 번호가 Phase PLAN과 User Story에서 참조된다
- 확정되지 않은 것을 요구로 쓰지 않고 Open Questions로 뺐다. PRD가 추측을 담으면 구현이 추측을 따른다
- 결제·채팅은 Non-goals 그대로 뒀다 (기획 메모의 유료화는 후속 Phase)

## Tests Executed

- 없음 (문서 변경). `ai-end.sh --ci`가 spec 스트림 Touches 검사를 한다

## Test Results

- 해당 없음

## Known Problems

- FR-15~18이 아직 어느 Phase Task에도 매핑되지 않았다 — Phase 02~07 PLAN 갱신이 필요하다(계획 스트림 소관)
- Status는 아직 Draft다. 팀 회의에서 Q1~Q5가 닫히면 Accepted로 올린다

## Unverified Assumptions

- FR-15의 "링크 주인 요약"이 어디까지인지(전체 결과? 닉네임+한 줄?) 디자인에서 확정되지 않았다
- SC-2의 30초가 백엔드 응답을 포함해도 현실적인지 — 만세력·LLM 응답 시간을 모른다

## Exact Next Action

PR을 올려 병합하고, 팀 회의 안건에 Q1~Q5를 올린다.
