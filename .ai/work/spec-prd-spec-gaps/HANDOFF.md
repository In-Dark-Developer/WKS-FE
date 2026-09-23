# Handoff — spec-prd-spec-gaps

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

기능명세서에만 있던 동작이 PRD FR 로 추적된다.

## Work Completed

- FR-2 — 필수값 충족 시 '점지 확인하기' 활성화 + 연속 클릭 중복 요청 방지 (명세서 2.1·2.8)
- FR-3 — 'OO 기운의 사람 만나보기' 로 소개팅 진입 (명세서 3.6)
- FR-15 — 초대 티저 'OO님의 궁합지도에 초대됐어요' + 만료 링크의 복구 경로 (명세서 5.1·5.16)
- FR-19 — viewport 하단 고정에 Safe Area 고려 명시 (명세서 3.9)
- FR-20 — 비로그인 궁합지도 하단 '로그인하고 저장하기' CTA, 로그인 시 미노출 (명세서 4.9)
- `담당` 열을 ⚔️ PRD 보드 값에 맞췄다 — 이정진(FR-1·7·8·18·19·21·22, NFR-1·2·3·5·6·8) · 이동건(FR-2·3·9~12·17·24~27·31, NFR-4) · 강근우(FR-4~6·13~16·23·28~30) · 곽도윤(FR-20, NFR-7). NFR-9·10 은 보드도 비어 `—` 로 둔다

## Work In Progress

- 없음

## Files Changed

- `docs/prd/30-functional-requirements.md` · `docs/prd/40-quality.md`

## Decisions Made

- 낡은 `담당` 을 같은 PR 에서 고쳤다 — 그대로 두면 dev 에서 owner-drift 가 계속 빨갛게 남는다. 값의 원본은 보드다
- FR 번호를 새로 매기지 않고 기존 행에 **V1** 절로 붙였다 — 번호는 Phase PLAN·ADR 이 참조한다(문서 머리 규칙)

## Tests Executed

- `30-functional-requirements.md` 표 셀 수 검사 (6열)

## Test Results

- 이상 없음

## Known Problems

- 궁합 이유 셋째 문단 문구가 엇갈린다 — 기능명세서 5.10 은 '둘이 싸움이 난다면?', PRD FR-22 는 '둘이 싸우게 된다면?'. 디자인 확인 후 한쪽으로 맞춰야 한다
- 반영하지 않은 약한 항목 2건 — 명세서 1.1 '최초 진입 여부를 확인할 수 없는 경우 티저 노출' 폴백, 4.2 궁합지도 Empty State(FR-8 이 결과 화면 기준으로만 적혀 있다)
- 기능명세서에 소개팅(6)·재화 섹션이 없다 — PRD 는 FR-24~31 로 앞서 있다. 기획에 요청 필요

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 담당 drift 검사(chore)로 넘어간다.
