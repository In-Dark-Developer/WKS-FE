# 2026-09-13 backend-contract-r2 — 백엔드 계약 참조본을 WKS-BE b61f849 로 다시 맞췄다

- Required: yes
- Applies to: touches:src/
- Change: docs/api/openapi.yaml 0.2.0 · docs/PRD.md FR-2·FR-3·FR-5·Q3(Q7·Q8·Q15 닫음) · docs/ARCHITECTURE.md Data Flow 2 · PR (spec-backend-contract-0913-r2)
- Action: `docs/api/openapi.yaml` 을 다시 읽는다 — (1) `POST /results` 요청은 `nickname·calendarType·birthDate·isLeapMonth·birthTime·gender`, `birthRegion` 없음. 시진은 가운데 시각, 자시 `00:45`·`23:45`. (2) 결과 응답에 `shareId`·`zodiac`(RAT…PIG, 입춘 기준 — 프론트가 계산하지 않는다)·`compatibilities` 가 있고 `fortunes[].grade` 는 `SS S A+ A B+ B` 6단계다(B0 없음). `luckyItem`·`luckyPlace` 는 매일 바뀐다. (3) 공유는 `resultId` 가 아니라 `shareId` — 주인 조회 `GET /shares/{shareId}`, 궁합 `POST /shares/{shareId}/compatibility` + `{ guestResultId }`. `?ref={originId}`·`/results/{id}/compatibility` 는 없어졌다. (4) `error.traceId` 는 아직 오지 않는다. 세션 토큰(Q16)·`cardGrades`(Q3)·사전신청 추가 정보(Q14)는 여전히 계약에 없다.
- Until: Phase 03 종료
