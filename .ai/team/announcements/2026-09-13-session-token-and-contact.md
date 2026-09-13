# 2026-09-13 session-token-and-contact — 백엔드 세션 토큰 발급, 연락처는 전화 필수·인스타 선택, 채팅 제외 확정

- Required: yes
- Applies to: all
- Change: docs/PRD.md · docs/ARCHITECTURE.md · PR (spec-planning-feedback-0913-r2)
- Action: 2026-09-13 결정 3건을 PRD·ARCHITECTURE에 반영했다. 다시 읽을 것 — (1) 백엔드가 세션 토큰을 발급한다: "세션 없음·`resultId` 보관"이 아니라 토큰을 보관해 모든 요청에 싣고 '내 결과·신청·실'을 토큰으로 식별한다(`resultId`는 공유 링크 재료). 발급·전달·만료는 백엔드 계약 갱신 대기 — PRD Q16, `api`·보호 라우트(FR-18)는 답이 오기 전 토큰 전제로 설계한다. (2) FR-10 연락처는 전화번호 필수 + 인스타그램 아이디 선택 — 디자인의 택1 세그먼트는 갱신 대상. FR-13·SC-5 성립 시 둘 다 공개. (3) 앱 내 채팅은 아예 제외(Non-goals 확정). 백엔드 문의는 `spec-planning-feedback-0913-r2` `notes/backend-questions.md` D2·C1·C5·E절.
- Until: Phase 08 종료
