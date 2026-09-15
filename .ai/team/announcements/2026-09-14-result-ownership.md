# 2026-09-14 result-ownership — 백엔드 세션 토큰은 없다, '내 결과'는 브라우저가 보관한 `resultId`

- Required: yes
- Applies to: all
- Change: ADR-20260914-result-ownership-in-browser.md · docs/PRD.md(Constraints·FR-18, Q16 닫힘) · docs/ARCHITECTURE.md · docs/phases/03-saju-reading/PLAN.md(T8·AC6)
- Action: 백엔드는 사주·궁합에 인증이 없고 세션 토큰을 발급하지 않는다(운영 Swagger·WKS-BE architecture §4, 2026-09-14 확인). 이전 공지 session-token-and-contact 의 (1), server-state-session 의 세션 문장, session-module-owner 는 무효다 — 토큰을 전제로 코드를 짜지 않는다. `wks:session` 값은 `{ v: 2, resultId }` 이고 `readSession()?.resultId` 가 '내 결과'다(여전히 `session.ts` 함수로만 접근). 요청에 `Authorization` 헤더는 없다. 가드: `/reading/:id` 하위는 `:id` 와 보관값 비교, `/me/map`·`/matching` 은 보관값 유무, `/s/:shareId` 는 가드 없음. 친구 궁합의 `guestResultId` 는 보관된 `resultId` 다. `session.ts`·`client.ts`·`results.ts`·`requireSession.ts`·`routes.tsx` 는 03/T8 이 수정한다.
- Until: Phase 08 종료
