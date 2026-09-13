# Handoff — spec-planning-feedback-0913-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

2026-09-13 결정 3건(백엔드 세션 토큰 발급 · 사전신청 연락처는 전화 필수/인스타 선택 · 앱 내 채팅 제외)이 PRD·ARCHITECTURE에 반영되고, 백엔드에 보낼 문의 목록에 그 결정과 남은 질문이 적혀 있다.

## Work Completed

- PRD: G4, FR-10(전화 필수·인스타 선택), FR-13(성립 시 둘 다 공개·채팅 없음), FR-18(세션 토큰), NFR-4, Constraints(세션 토큰 결정), Non-goals(채팅 확정 제외), Q14 축소, Q16 신설(토큰 계약), SC-5
- ARCHITECTURE: Data Flow 1·3, State Management, Persistence, 인증/인가를 "백엔드 발급 세션 토큰 보관·전송" 기준으로 수정
- `notes/backend-questions.md`: 이전 스트림 목록을 이어받아 D2·C1·C5에 결정 반영, E절(결정 통보 3건) 추가
- 공지 `2026-09-13-session-token-and-contact` + `.ai/team/README.md` 색인

## Work In Progress

- 없음

## Files Changed

- `docs/PRD.md`, `docs/ARCHITECTURE.md`
- `.ai/team/announcements/2026-09-13-session-token-and-contact.md`, `.ai/team/README.md`
- `.ai/work/spec-planning-feedback-0913-r2/notes/backend-questions.md`

## Decisions Made

- 세션 토큰은 백엔드가 발급한다 — 이전 "세션 없음·resultId 보관" 전제를 뒤집는다. `resultId`는 공유 링크 재료로만 남긴다
- 연락처는 전화번호 필수 + 인스타그램 아이디 선택, 성립 시 둘 다(인스타는 등록한 경우) 공개. 디자인의 택1 세그먼트는 갱신 대상
- 앱 내 채팅은 아예 제외
- openapi 참조본은 손대지 않았다 — 계약의 source of truth는 백엔드이며, 토큰·추가 정보 API는 백엔드 답을 받은 뒤 반영한다

## Tests Executed

- `scripts/ai-end.sh --ready` (spec·공지·색인 검사)

## Test Results

- close commit 시점의 출력을 LOG Verification에 기록

## Known Problems

- 백엔드 문서(architecture.md "세션 없음", backend-requirements FR-SU-11 "이름·전화번호 미수집")가 결정과 충돌한다 — 백엔드 저장소 쪽 반영은 이 스트림 밖

## Unverified Assumptions

- 세션 토큰 발급 시점을 "사주 결과 생성(`POST /results`) 시"로 적었다 — 백엔드 확인 전(Q16)
- 사전신청 모달 디자인이 전화/인스타 두 필드로 갱신될 것으로 가정

## Exact Next Action

PR 병합 후 소유자가 `notes/backend-questions.md` E·D2·C1·C5를 백엔드에 전달한다.
