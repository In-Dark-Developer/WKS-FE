# Handoff — spec-prd-v1

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

V1(로그인·소개팅·재화) 요구사항이 저장소 PRD 에 있고, 구현 스트림이 FR 번호로 Done when 을 쓸 수 있다.

## Work Completed

- FR-19~FR-31 (네비·홈 / 카카오 로그인 / 계정 복원 / 궁합 이유 / 이전 정보 선택 / 소개팅 인트로·프로필·Top3·리롤·해금·운명의 실·요청함·실)
- NFR-7~NFR-10 (JWT 쿠키 15일 · 인앱 브라우저 · LLM 생성 비용 · 운영/개발 분리), SC-7~SC-9
- SCR-15~SCR-22 와 V1 화면 흐름 문단, V1 제약·Non-goals·Q15~Q18
- 대체되는 V0.5 요구(FR-3·9·12·13)에 어느 FR 이 이어받는지 표시

## Work In Progress

- 없음

## Files Changed

- `docs/prd/{README,10-product,20-screens,30-functional-requirements,40-quality,50-scope}.md`

## Decisions Made

- **번호를 다시 매기지 않았다** — Phase PLAN·ADR·공지가 FR-1~18 을 참조한다. V1 은 FR-19 부터 잇고, 대체 관계는 줄 끝 표시로 남긴다.
- 사전신청(SCR-09·SCR-14, FR-10·FR-17)은 지우지 않고 V0.5 운영본 기준으로 남겼다 — 백엔드 `signup` 이 살아 있다.
- V1 근거는 Figma v1.0(`imSnlOGTqwtPhGyzhA8yc9`)과 2026-09-22 BE 회의록이다. 회의에서 열린 채로 끝난 항목은 Q15~Q18 로 옮겼다.

## Tests Executed

- FR·NFR grep (색인 동기화가 읽는 형식) · ID 중복 검사 · 표 열 수 검사

## Test Results

- 41행(FR 31 + NFR 10), 중복 ID 0, 깨진 표 줄 0

## Known Problems

- Notion PRD DB 의 ID 체계(FR-11·FR-21·… 그룹 번호)가 저장소 번호와 다르다. 둘 중 하나로 맞춰야 추적이 된다 — 저장소를 기준으로 Notion 을 고치는 쪽을 권한다.
- Phase PLAN 에는 V1 Task 가 아직 없다. 구현 착수 전에 Phase 계획 스트림이 필요하다.

## Unverified Assumptions

- FR-25 의 학교 메일 도메인·FR-31 의 제휴 보상 규모는 회의록에 값이 없어 요구만 적고 수치는 비워 뒀다.

## Exact Next Action

PR 병합 후 V1 Phase 계획 스트림(`ai-stream.sh phase new`)을 연다.
