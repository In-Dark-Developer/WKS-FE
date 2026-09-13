# Handoff — 06-T2-pre-register-modal

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 06/T2

## Goal

사전신청 모달 본문(수정본 695:2614~2654 5상태)과 결과 화면 티저(82:605)가 props·route action 으로만 렌더되고 `/preview/pre-register` 에서 확인된다.

## Work Completed

- `PreRegisterForm`: 이름·사진(미리보기만)·이메일·전화번호(필수)·인스타그램(선택)·학과·MBTI·자기소개 + 고지·동의. 기본·오류·로딩·연결 실패(입력 유지·다시 신청하기)·완료 — route action 결과(`{status:'done'}`·`{formError:'connection'}`)로 전환
- `PreRegisterComplete`(695:2654) · `PreRegisterTeaser`(82:605 beforeOpen·available·closed) · `consent.ts` 고지 문구 · `formSchema.ts` 검증
- `/preview/pre-register`: 기본·오류(이메일)·연결 실패·완료·티저

## Work In Progress

- 모달 셸 없음 — 02/T3 Modal 병합 뒤 셸에 끼우는 후속 커밋이 남아 T2 는 체크하지 않음

## Files Changed

- CURRENT Touches 그대로 (+ 테스트 3개)

## Decisions Made

- 소유자: Modal 전이라 본문부터 퍼블리싱
- 06 PLAN 은 @gn00py48 계획 스트림(ws/plan-06-dating-gate, PR 없음) 소유 — main 의 옛 T2 줄은 건드리지 않음
- 필수: 이름·이메일·전화번호·동의. 그 밖의 필수·길이는 Q10 전이라 두지 않음
- 연락처는 택1 세그먼트 대신 두 칸(FR-10), 사진은 전송 방식 미정(Q14)이라 action 에 안 보냄
- 동의 체크·고지는 디자인에 없음(OptionalConsent 슬롯 미정) — Notice + Checkbox 로 추가

## Tests Executed

- `pnpm test`(174) · typecheck · lint · build(dist 에 preview 없음), 브라우저 375px 연결 실패 흐름(로딩→실패 문구)·완료 화면

## Test Results

- 통과

## Known Problems

- 보관 기간 문구 '확정 후 안내드려요' — PRD Q4 답 필요(법적 고지)
- 티저 '9/30' 은 디자인 와이어프레임 문구, PRD 오픈일은 9/29
- 사진 추가 버튼은 ui PhotoUpload(아웃라인) 모양 — 수정본은 청록 채움
- 06 계획 PR 이 아직 없음 — @gn00py48 에게 PR 요청 필요
- Tailwind dev 서버가 새 파일 클래스를 늦게 읽음 — 새 파일 뒤 재시작

## Unverified Assumptions

- 필수 항목 범위(이름·이메일·전화번호)

## Exact Next Action

PR 리뷰 후 병합
