# 2026-09-13 publishing-first — 디자인 있는 화면은 퍼블리싱(props) 먼저, 연동은 따로

- Required: yes
- Applies to: touches:src/
- Change: docs/phases/03·04·05 PLAN · PR (plan-03-publishing-first)
- Action: 화면 컴포넌트는 `src/api/` 응답 스키마를 import 하지 않고 feature 가 정한 뷰 모델 props 로만 그린다 — 응답 → 뷰 모델 변환과 action·loader 는 연동 Task(03/T7 등)가 한다. 화면 확인은 `/preview`(03/T6, 개발 서버 전용)에 `src/app/preview/screens/<화면>.tsx` 파일 하나를 추가해서 한다 — 공유 목록 파일을 고치지 않는다. 03/T5 결과 화면은 @jjjung0921 이 퍼블리싱하고 @nicerjs23 은 03/T7 입력·결과 연동을 맡는다(After: T1·T4·T5). routes.tsx 는 이제 03/T7 만 수정한다. 04/T2 인연카드·05/T2 궁합 지도 퍼블리싱이 추가됐다(@jjjung0921). 십이간지 캐릭터는 `src/ui/ZodiacCharacter.tsx`(03/T5)를 같이 쓴다.
- Until: Phase 08 종료
