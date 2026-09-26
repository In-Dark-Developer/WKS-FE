# 2026-09-27 dating-request-cancelled — 요청 상태에 CANCELLED 가 생기고 목록에 상대 프로필이 온다

- Required: yes
- Applies to: touches:src/features/dating/
- Change: docs/api/openapi.yaml (DatingRequestStatus · /dating/requests/{requestId}/cancel · DatingRequestListItem) — WKS-BE dev 4d2e534 (#101 · #103)
- Action: 백엔드 dev 에서 보낸 목록(`box=sent`)에 `CANCELLED` 가 올 수 있다. `src/api/schema/matchRequests.ts` 의 상태 enum 에 넣기 전에는
  취소 이력이 하나라도 있으면 목록 파싱이 실패한다. 취소는 `POST /dating/requests/{id}/cancel`, 목록 행에는 `counterpart`(점수·MBTI·소개·잠금 필드)가 온다.
  취소한 상대는 추천 카드에 있으면 다시 보낼 수 있으니 '이미 보냄' 판정에서 CANCELLED 를 뺀다. 11/T2 후속이 반영한다.
- Until: Phase 11 종료
