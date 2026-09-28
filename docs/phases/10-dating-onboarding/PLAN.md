# Phase 10 — dating-onboarding

- Status: PLANNED
- Lead: @jjjung0921
- Depends on: 09
- Start: <YYYY-MM-DD> · End: <YYYY-MM-DD>

## Goal

로그인한 사용자가 소개팅 프로필을 등록하면 사주 궁합 기준 오늘의 인연 Top 3 를 받고, 실을 써서 다시 뽑을 수 있다.

## Motivation

V0.5 의 소개팅은 사전신청 폼까지였다(FR-9·FR-10). V1 은 그 자리를 실제 소개팅으로 바꾼다 — 프로필을 받고
궁합 점수로 상대를 추천한다(FR-12 를 FR-26·FR-27 이 대체). 추천이 서지 않으면 Phase 11 의 해금·운명의 실이
가리킬 대상이 없으므로, 이 Phase 가 소개팅 줄기의 허리다. 재화 '실'도 여기서 선다 — 리롤과 해금의 비용이
모두 잔액에 걸리기 때문이다.

## Scope

- 소개팅 인트로와 로그인·프로필 게이트 (FR-24)
- 프로필 2단계 등록: (1/2) 사주 정보, (2/2) 이름·사진·학교 정보 (FR-25)
- 학교(DGU) 메일 코드 인증 — 발송·6자리 코드 입력·재발송·완료 (FR-25, PRD Q20)
- 재화 '실' 잔액 표시·획득·소모 (FR-31)
- 사주 궁합 기준 오늘의 인연 Top 3 카드 (FR-26)
- 추천 리롤 — 하루 1회 무료, 이후 실 5개 (FR-27 — 백엔드 확정값 2026-09-27, PRD 의 '실 3개' 정정은 spec 후속)
- 협업 링크 진입자 실 10개 지급과 지급 모달 (FR-32)

## Out of Scope

- 정보 해금·운명의 실·요청함 (FR-28 ~ FR-30) — Phase 11.
- 현금 결제 — 실은 가입·출석·친구 등록·제휴로만 얻는다(G8).
- 잠긴 사진의 원본 URL 차단(FR-56 계열) — 백엔드 책임이며 이 Phase 는 화면에서 열지 않는 것까지만 한다.

## Dependencies

- Phase 09 — 로그인과 세션이 서야 소개팅에 들어갈 수 있다(FR-24 는 FR-20 을 선행으로 갖는다).
- 백엔드: 프로필 등록, Top 3 추천(궁합 점수 기준), 리롤, 실 원장 API. `docs/api/openapi.yaml` 갱신이 T1 착수의 전제다.
- Figma: 확정 디자인이 나왔다(2026-09-23, 인트로·프로필 `76-3402` · 메인/카드 `76-3401`) — 화면은 T4 가
  API 없이 먼저 퍼블리싱한다.
- 백엔드: 학교 메일 인증은 매직링크를 폐기하고 코드 방식으로 확정됐다(BE api-spec 10.7, 2026-09-26) —
  `POST /api/dating/email-codes` · `POST /api/dating/email-codes/verify`, 재발송 60초 쿨다운 · 10분 만료 · 24시간 10회.
  `docs/api/openapi.yaml` 에는 아직 없다 — T1 이 연결 전에 동기화한다.
  인증을 마치지 않으면 추천 API 가 403 이므로 T5 → T1 연결이 실제 서버 확인의 선행이다.

## Tasks

- [ ] T1. 소개팅 진입과 프로필 등록 — Done when: 비로그인 사용자에게 로그인을, 프로필이 없는 로그인 사용자에게 프로필 등록을 안내하고, 사주 정보(1/2)와 이름·사진·학교 정보(2/2) 두 단계가 각각 검증·오류·연결 실패 상태를 가지며, (2/2)의 학교 메일은 코드 인증(발송·입력·재발송·완료)을 마쳐야 등록되며, 등록을 마치면 추천 화면으로 넘어간다 · Touches: `src/features/dating/`, `src/app/routes/`, `src/api/`, `docs/api/openapi.yaml` · After: T4, T5 · Owner: 이동건 · FR: FR-24, FR-25

- [ ] T2. 재화 '실' — Done when: 잔액이 소개팅 화면 상단에 보이고, 획득(가입 10 · 출석 5 · 친구 1명당 3 · 제휴)과 소모가 잔액에 반영되며, 잔액이 모자라면 소모 동작이 막히고 안내가 뜬다. 원장은 백엔드가 갖고 화면은 계산하지 않는다 · Touches: `src/features/dating/`, `src/api/` · After: T1 · Owner: 이동건 · FR: FR-31

- [ ] T3. Top 3 추천과 리롤 — Done when: 궁합 점수 기준 상위 3명이 카드로 보이고(앞면 점수·관계 유형·MBTI·자기소개), '다른 인연 만나보기'가 하루 1회는 무료로 자정에 초기화되며 그 뒤에는 실 5개를 차감하고, 차감 실패 시 추천이 바뀌지 않는다 · Touches: `src/features/dating/`, `src/ui/`, `src/api/`, `src/app/routes/`, `docs/api/openapi.yaml` · After: T1, T2, T4 · Owner: 이동건 · FR: FR-26, FR-27

- [x] T4. 소개팅 화면 퍼블리싱 — Done when: 인트로·프로필(`76-3402`)의 Intro 1.1(비로그인)·2.1(로그인)·1.1.1(카카오 로그인 시트)·사주입력폼 (1/2)·(2/2), 메인/카드(`76-3401`)의 카드 앞면·뒷면·인연x·리롤 바텀시트(무료 o·x)·상단 실 잔액이 feature 가 정한 뷰 모델 props 로만 그려지고 `/preview/<화면>` 에서 가짜 데이터로 보이며, 새 표현 컴포넌트(`BottomSheet`·`ProfileCard`·`ThreadCount`·`Avatar`·`BlurredPhoto`)가 도메인 규칙 없이 `src/ui/` 에 있다. API 호출·loader·action 은 넣지 않는다 · Touches: `src/features/dating/`, `src/ui/`, `src/app/preview/screens/` · Owner: 이정진 · UI: FR-20, FR-24, FR-25, FR-26, FR-27, FR-31 (commit eae83ad)

- [x] T5. 학교 메일 코드 인증 퍼블리싱 — Done when: 프로필 (2/2)의 학교 메일 입력란 옆 '인증' 버튼, 6자리 코드 입력칸, 재발송 60초 타이머(대기 중 비활성), 코드 오류·만료·횟수 초과 안내, 인증 완료 상태가 뷰 모델 props 로만 그려지고 `/preview/<화면>` 에서 가짜 데이터로 보이며, 메일이 `@dgu.ac.kr` 로 끝나지 않으면(대소문자 무관) 제출 때 그 칸에 오류가 보인다. 디자인에 없는 상태이므로 기존 `src/ui/` 컴포넌트와 토큰으로 그린다. API 호출·loader·action 은 넣지 않는다 · Touches: `src/features/dating/`, `src/ui/`, `src/app/preview/screens/` · After: T4 · Owner: 이정진 · UI: FR-25 (commit 146612c, ffb0b7c)

- [ ] T6. 협업 링크 실 지급 — Done when: 협업 링크로 들어와 로그인한 사용자에게 '운명의 실이 지급되었어요' 모달(SCR-23, Figma 「축사 연결」 `228:3318`)이 지급 뒤 보유 수와 함께 뜨고, 로그인 응답의 `rewardGranted` 가 `null` 이면 모달이 뜨지 않으며, 잔액 표시가 새로고침 없이 맞는다. 제휴 코드(`ref`)를 로그인 요청에 싣는 부분은 09/T2(`src/features/auth/`, 이정진)가 열어 넘긴다 · Touches: `src/features/dating/`, `src/api/`, `src/app/routes/` · After: T2 · Owner: 이동건 · FR: FR-32

퍼블리싱 먼저(2026-09-24): 화면은 T4 가 props 뷰 모델로만 그리고 `/preview` 에서 가짜 데이터로 확인한다. 데이터 연결(action·loader·응답→뷰 모델 변환)은 T1·T2·T3 이 한다 — 03/T5·T7 과 같은 분담이다.

QA(2026-09-28, Notion 「🩺 QA / 디자인·기능」) — 담당자는 Notion `담당자` 칸과 같고, 원래 그 FR 을 만든 사람이다. 원인이 적혀 있지 않은 항목은 재현·원인 기록부터 한다.

- [x] T7. 프로필 (2/2) MBTI 칸 색 — Done when: 프로필 (2/2)의 MBTI 선택 칸이 다른 입력 칸(이름·학과 등)과 같은 배경·테두리·글자 색으로 보이고(Figma 사주입력폼 (2/2) `134:3639`), 선택 전·후와 오류 상태도 같은 규칙을 따른다 · Touches: `src/features/dating/profile/DetailsStep.tsx`, `src/ui/Select.tsx` · Owner: 이동건 · FR: FR-25 (QA: 소개팅 개인정보 입력 페이지에 mbti칸만 색깔이 요상함) (commit 933c06c, PR #288)

- [x] T8. 소개팅 카드 규격 — Done when: Top 3 카드(앞면·뒷면·인연x)가 Figma 카드 규격(343×433, radius 12, 흰 테두리 — `96:1876`·`134:2527`)과 같은 크기로 보이고, 화면 폭이 달라도 비율이 깨지지 않는다 · Touches: `src/ui/ProfileCard.tsx`, `src/features/dating/recommendation/` · Owner: 이동건 · FR: FR-26 (QA: 카드 사이즈가 다름) (commit 8ab0495, PR #289)

- [x] T9. 소개팅 카드 글래스 효과 — Done when: 카드의 반투명(글래스) 영역이 Figma 카드 앞면 `91:1641` 과 같은 블러·투명도로 보이고, 사진이 있는 카드와 없는 카드 모두에서 글자가 읽힌다 · Touches: `src/ui/ProfileCard.tsx`, `src/features/dating/card/`, `src/ui/tokens/theme.css`, `src/features/dating/recommendation/` · Owner: 이동건 · FR: FR-26 (QA: 카드 글래스 효과) (commit 7c9fcdc, PR #290)

- [x] T10. 소개팅 카드 뒤집기 애니메이션 — Done when: '카드 뒤집기'가 홈 운명 카드(`DestinyCard`)와 같은 뒤집기 애니메이션으로 앞·뒷면을 바꾸고, 동작 줄이기 설정(`prefers-reduced-motion`)에서는 애니메이션 없이 바뀐다 · Touches: `src/ui/ProfileCard.tsx` · Owner: 이동건 · FR: FR-26 (QA: 소개팅 카드도 사주 카드처럼 애니메이션) (commit 2b97edd, PR #291)

- [x] T11. Top 3 카드는 늘 세 장 — Done when: 추천이 몇 명이든 카드는 늘 세 장이고, 후보가 1–2명이면 남은 자리를 빈 카드(Figma 인연x `134:2248`)로 채우며(FR-26, 2026-09-28 결정), 세 장 모두 넘겨 볼 수 있고 인디케이터 점 세 개가 각각 그 카드를 가리킨다. 빈 카드에서는 '운명의 실 보내기'·해금이 동작하지 않는다. 지금 세 장이 다 보이지 않는 조건도 재현해 적은 뒤 고친다 · Touches: `src/features/dating/recommendation/` · Owner: 이동건 · FR: FR-26 (QA 기능: 탑3 카드가 다 떠야함) (commit 0db0e50, PR #277)

- [x] T12. 소개팅 상단 바 아이콘 — Done when: Top 3 상단의 '운명의 실'·'요청함' 아이콘과 글자가 Figma `top_nav`(`91:1790`)와 같은 간격·크기·아이콘으로 보인다 · Touches: `src/features/dating/recommendation/DatingHeader.tsx` · Owner: 이동건 · FR: FR-31 (QA: top bar 아이콘 간 간격 및 디자인) (commit ec3b4a2, PR #287 — 간격. 배경 유리는 재작업 commit 4489f46)

- [x] T13. 리롤 시트 실 문구 — Done when: '다른 인연 만나보기' 확인 시트의 실 차감 안내 문구가 디자인이 정한 문구로 바뀌고, 무료·유료·잔액 부족 세 상태 모두 비용(5실)과 맞는다 · Touches: `src/features/dating/recommendation/RerollSheet.tsx` · Owner: 이동건 · FR: FR-27 (QA: 리롤 모달 실 멘트 변경) (commit d29f1e8, PR #285)

- [x] T14. 사진 추가 영역 Figma 정합 — Done when: 프로필 (2/2)의 사진 추가 칸이 Figma 사주입력폼 (2/2) `134:3639` 와 같은 흰 카드·테두리·미리보기 비율(311×393)·버튼 색(Rose/300)으로 보인다 · Touches: `src/ui/PhotoUpload.tsx`, `src/ui/Button.tsx`, `src/ui/tokens/theme.css` · Owner: 이동건 · UI: FR-25 (QA 2026-09-28: 피그마 사진 넣는 곳과 구현이 다름) (commit 4489f46)

QA 3차(2026-09-28, Notion 「🩺 QA / 디자인·기능」) — 담당자는 Notion `담당자` 칸과 같고, 그 화면·코드를 마지막으로 만든 사람이 이어서 맡는다. 원인이 적혀 있지 않은 항목은 재현·원인 기록부터 한다.

- [ ] T15. 학교 메일 코드 발송 뒤 화면 흔들림 — Done when: 프로필 (2/2)에서 '인증'을 눌러 코드를 보낸 뒤 화면이 커졌다 작아지지 않는다 — 데스크톱 브라우저만의 현상인지 모바일(375)에서도 나는지 재현해 적고, 원인(코드 입력칸·타이머가 나타나며 높이·스크롤바가 바뀌는 등)을 고친다 · Touches: `src/features/dating/profile/EmailVerification.tsx`, `src/features/dating/profile/DetailsStep.tsx` · Owner: 이정진 · UI: FR-25 (QA: 메일 인증 발송 후 화면 사이즈가 변화)

- [ ] T16. 연락처 칸 안내 문구 — Done when: 프로필 (2/2) 연락처 칸 아래 안내가 '상대방에게 공개될 정보예요'로 보인다 · Touches: `src/features/dating/profile/DetailsStep.tsx` · Owner: 이정진 · UI: FR-25 (QA: 소개팅 페이지 설명 수정)

- [ ] T17. 카드를 뒤집어도 사진은 그대로 — Done when: 소개팅 카드를 뒤집을 때(10/T10) 뒷면의 사진이 좌우 반전되지 않고 앞면과 같은 방향으로 보이며, 동작 줄이기 설정에서도 같다 · Touches: `src/ui/ProfileCard.tsx` · Owner: 이동건 · FR: FR-26 (QA: 소개팅 사진 좌우반전)

- [ ] T18. 실 안내의 지도 별 문구 — Done when: 운명의 실 안내(`ThreadGuideDialog`)의 '지도 별 달성' 줄이 QA 가 정한 '내 지도에 등록된 사람 5명 당 3개'로 보이고, 개수는 백엔드 원장 규칙과 같다. 지금 WKS-BE §12 와 PRD FR-31 은 '친구 1명 등록당 3' 이라 문구만 바꾸면 실제 지급과 어긋난다 — 백엔드(곽도윤, Notion 기능 「지도 별 1개당 실 3개 지급」)가 규칙을 바꾸거나 QA 가 문구를 거두기 전에는 시작하지 않는다 · Touches: `src/features/dating/wallet/ThreadGuideDialog.tsx` · Owner: 이정진 · FR: FR-31 (QA: 실 설명 페이지 설명)

- [ ] T19. 실 안내 개수 알약 그라데이션 — Done when: 운명의 실 안내의 '+3'·'+10' 개수 알약의 흰 그라데이션이 과하지 않아 가장자리가 잘려 보이지 않고, Figma 운명의 실 안내 모달과 같은 색으로 보인다 · Touches: `src/features/dating/dating.css`, `src/features/dating/wallet/ThreadGuideDialog.tsx` · Owner: 강근우 · FR: FR-31 (QA: 운명의 실 모달 포인트 버튼 그라데이션 조절 필요)

## Relevant Specifications

- `docs/prd/` — FR-24, FR-25, FR-26, FR-27, FR-31, FR-32 (FR-12 를 대체), Q20(학교 메일 인증)
- `docs/prd/20-screens.md` — SCR-15, SCR-16, SCR-17, SCR-23
- `docs/api/openapi.yaml` — 프로필 · 학교 메일 코드 인증 · 추천 · 리롤 · 실 원장
- Figma `imSnlOGTqwtPhGyzhA8yc9`(v1.0) — 인트로·프로필 `76-3402`, 메인/카드 `76-3401`(main flow · reroll 바텀시트 · 운명의실 보내기). 와이어프레임 `65-3123` 은 참고용이며 어긋나면 디자인이 우선한다 — 와이어프레임의 '운명의 실 구매하기' 모달은 최종 디자인에 없다(현금 결제는 V1 범위 밖). FR-32 지급 모달은 「축사 연결」 `228:3318` 이다(SCR-23)

## Acceptance Criteria

- [ ] AC1. 비로그인으로 소개팅 탭에 들어가면 로그인 안내가, 프로필 없는 로그인 상태에서는 등록 안내가 뜬다
- [ ] AC2. 프로필 등록을 마치면 Top 3 가 보이고, 세 명 모두 내 궁합 점수 순이다
- [ ] AC3. 첫 리롤은 잔액이 줄지 않고, 두 번째 리롤에 5가 줄며, 잔액 4 이하에서는 리롤이 막힌다
- [ ] AC4. 잔액 표시가 획득·소모 직후에 즉시 맞는다 (새로고침 없이)

## Validation Plan

- 자동: 게이트 분기(비로그인 / 프로필 없음 / 정상)는 라우팅 테스트로 세 갈래를 덮는다(AC1). 리롤 비용 분기(무료 1회 / 유료 / 잔액 부족)는 `src/features/dating/*.test.ts` 로 덮는다(AC3).
- 수동: 계정 하나로 프로필 등록 → Top 3 → 리롤 2회를 실기기에서 수행하고 잔액 변화를 눈으로 확인한다(AC2·AC4).
- 경계: 자정 초기화는 기기 시계가 아니라 서버 판정이어야 한다 — 기기 시각을 바꿔 무료 리롤이 늘지 않는지 확인한다.
