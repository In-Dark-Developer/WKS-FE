# 2026-09-12 design-first-prd — 디자인 우선 원칙으로 PRD·계약·Phase 계획을 맞췄다. MVP 마감 2026-09-17

- Required: yes
- Applies to: all
- Change: docs/PRD.md · docs/api/openapi.yaml · docs/ARCHITECTURE.md · docs/phases/01~08 PLAN.md · PR (spec-design-first-alignment)
- Action: 디자인(Figma 「UI 최종 - 개발용」 558-2430)과 spec이 어긋나면 디자인이 우선한다. PRD를 다시 읽는다 — 새 Screens 절(SCR-02~12), FR-2(양·음력·12시진·닉네임 8자), FR-3(운명 카드: 연애운·결혼운·자녀운 + 행운의 장소·아이템 — 재물·학업·축제 아이템 제외), FR-7(귀인 ≥90 · 찰떡 75–89 · 벗 61–74 · 스침 ≤60), FR-9(블러 대신 사전신청 티저), FR-1 인트로·FR-11 쿠폰은 MVP 제외. openapi 참조본이 그에 맞춰 바뀌었으니 Phase 03 T1 전에 T6(백엔드 동기화)를 먼저 한다. Phase 02 T1 Touches는 `tailwind.config.ts`가 아니라 `src/index.css` `@theme`이다. 모든 Phase의 End는 2026-09-17(채팅 제외 MVP, API 연결 포함).
- Until: Phase 08 종료
