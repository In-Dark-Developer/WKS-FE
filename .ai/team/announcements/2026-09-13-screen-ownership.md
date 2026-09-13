# 2026-09-13 screen-ownership — 수정본 기준 화면 담당과 파일 경계

- Required: yes
- Applies to: all
- Change: docs/phases/02·03·06 PLAN · docs/PRD.md SCR-09 라우트 · PR (plan-02-design-system)
- Action: 02/T2(@gn00py48)는 Button·IconButton·TextField·Checkbox·SegmentedControl·Field 만, Select·TextArea·PhotoUpload 는 새 02/T6(@jjjung0921)이다 — 이미 T2 스트림을 열었다면 CURRENT Touches 에서 세 파일을 뺀다. 03/T3(@jjjung0921)이 SCR-12(`errorElement`·`HydrateFallback`)와 `/reading/:id/pre-register` 조립까지 맡는다. 03/T5(@nicerjs23)는 결과 화면에 `teaser` 슬롯 prop 과 `<Outlet />` 자리만 두고 profile 을 import 하지 않는다. 사전신청 모달은 새 06/T2(@jjjung0921, `src/features/profile/`). 옵션 값(12시진·MBTI)은 feature 에 두고 ui Select 에는 props 로만 넘긴다. `routes.tsx` 는 03/T3, `api/client.ts`·`session.ts` 는 03/T1 만 수정한다.
- Until: Phase 06 종료
