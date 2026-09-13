# 2026-09-13 planning-feedback — 기획 피드백 반영: 등급 B0~SS, 인연카드 등급 표기, 사주 요약 제외, 소개팅 화면 축제 당일 오픈

- Required: yes
- Applies to: all
- Change: docs/PRD.md · docs/api/openapi.yaml · docs/ARCHITECTURE.md · docs/phases/03~07 PLAN.md · PR (spec-planning-feedback-0913)
- Action: 기획 파트의 기능명세서 피드백을 PRD에 반영했다. 다시 읽을 것 — G3(사전신청 완료 = 상대 정보 열람권, 소개팅 화면은 축제 당일 2026-09-29 오픈), FR-3(연애·결혼·자녀 문자 등급은 B0 최저 ~ SS 최고, 행운의 장소는 동국대 안), FR-5(인연카드는 0–100 바가 아니라 등급 — openapi `cardScores` → `cardGrades`, `Grade` 스키마 추가), FR-9·FR-12(열람권·오픈일), FR-15(공유 랜딩에 주인의 사주 요약 없음 — `ShareSummary.destinyTitle` 삭제). 이 항목들은 디자인보다 우선하며 인연카드 디자인은 갱신 대상이다. 새 Open Question Q12(랜딩 닉네임 노출), Q13(오픈 판정 주체). FR-2(닉네임 1–8자, 성별 남/여)·FR-7(귀인 ≥90 · 찰떡 75–89 · 벗 61–74 · 스침 ≤60)은 기존과 같다 — Figma 「기능명세서」(560-2)가 낡아 있었을 뿐이다.
- Until: Phase 07 종료
