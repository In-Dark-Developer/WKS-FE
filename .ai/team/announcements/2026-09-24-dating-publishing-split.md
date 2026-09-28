# 2026-09-24 dating-publishing-split — 소개팅 화면은 퍼블리싱 Task 가 먼저 그린다

- Required: yes
- Applies to: touches:src/features/dating/
- Change: docs/phases/10-dating-onboarding/PLAN.md (T4) · docs/phases/11-dating-thread/PLAN.md (T3)
- Action: 소개팅 화면 퍼블리싱이 Task 로 분리됐다 — Phase 10 T4(인트로·프로필·카드·리롤·실 잔액)와
  Phase 11 T3(해금 모달·운명의 실 모달·요청함), 둘 다 @jjjung0921. 화면 컴포넌트는 feature 가 정한 뷰 모델
  props 로만 그리고 `/preview/<화면>` 에서 가짜 데이터로 확인한다. 10/T1·T2·T3 와 11/T1·T2 는 **데이터 연결**
  (`src/api/` 호출·loader·action·응답→뷰 모델 변환)을 맡고, 퍼블리싱 Task 뒤에 선다(`After:`). 03/T5·T7 과 같은
  분담이다. 공용 표현 컴포넌트(`BottomSheet`·`ProfileCard`·`ThreadCount`·`Avatar`·`BlurredPhoto`·`LockedValue`·
  `Tabs`)는 퍼블리싱 Task 가 `src/ui/` 에 만든다 — 연동 Task 에서 같은 이름을 새로 만들지 않는다. 이미 화면을
  그리기 시작했다면 @jjjung0921 에게 알려 범위를 맞춘다.
- Until: Phase 11 종료
