# 2026-09-13 drop-birth-region — 사주 입력에서 태어난 지역을 뺐다

- Required: yes
- Applies to: docs/phases/03-saju-reading/, src/features/saju/, src/api/
- Change: docs/PRD.md(US-1 · FR-2 · Q6 삭제) · docs/phases/03-saju-reading/PLAN.md(Scope · T4 · AC2) · docs/api/openapi.yaml(`birthRegion` 설명) · PR (spec-drop-birth-region)
- Action: 사주에 영향이 작다는 기획 판단(2026-09-13)으로 태어난 지역 입력을 뺐다. 입력 폼(Phase 03 T4)에 지역 필드를 만들지 않고, `POST /readings`의 `birthRegion`에는 항상 null 을 보낸다. 백엔드 계약에서 필드를 빼는 요청은 Phase 01 T6 문의 목록에 넣는다. Figma 「기능명세서」와 Notion 요구사항 색인 FR-2 는 반영됨.
- Until: Phase 03 종료
