# Handoff — spec-design-first-alignment

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: -/-

## Goal

PRD·openapi 참조본·ARCHITECTURE·Phase PLAN이 Figma 「UI 최종 - 개발용」과 정합하고(디자인 우선), MVP 마감 2026-09-17이 모든 계획에 적혀 있다.

## Work Completed

- PRD·openapi·ARCHITECTURE·PLAN 01~08·README·AGENTS·공지 갱신 (CURRENT Progress 참조)

## Work In Progress

- 없음

## Files Changed

- `docs/PRD.md` `docs/api/openapi.yaml` `docs/ARCHITECTURE.md` `docs/phases/*/PLAN.md` `docs/phases/README.md`(생성) `README.md` `AGENTS.md` `.ai/team/announcements/2026-09-12-design-first-prd.md`

## Decisions Made

- 디자인과 spec이 어긋나면 디자인이 우선한다 (소유자 지시 2026-09-12)
- 결과 영역: 기획의 5영역 대신 디자인의 연애운·결혼운·자녀운(문자 등급) + 행운의 장소·아이템 + 인연카드 바(연애·결혼·운명 0–100)
- 궁합 등급: 귀인 ≥90 · 찰떡 75–89 · 벗 61–74 · 스침 ≤60 (디자인 주석)
- 인트로(FR-1)·쿠폰(FR-11)·블러 섹터·학교 이메일 인증·나이 입력은 디자인에 없어 MVP 제외 / 티저 CTA로 대체
- 축제 2026-09-29 ~ 10-01 (Q1 닫힘) · 후보 목록은 백엔드가 궁합 기반 제공 (Q5 닫힘) · 계약 공개 날짜 미정 (Q3 유지)
- FR-17 동의는 디자인에 없어도 유지 — OptionalConsent 슬롯을 켠다 (개인정보 수집 동의는 법적 요건)

## Tests Executed

- `scripts/ai-stream.sh phases --check` · `codeowners --check` · placeholder grep (AC1)

## Test Results

- 통과 (출력 없음). `pnpm test|typecheck|lint`는 문서 변경만이라 실행하지 않음 — CI가 돌린다

## Known Problems

- openapi 참조본의 새 엔드포인트(/me/profile·/matching/candidates·/me/threads/{id}/pull·/me)와 Reading 응답 형태는 초안 — 백엔드 확인 전(Phase 01 T6)
- SCR-06·07·10·11 디자인이 없어 Phase 05·07은 착수 조건 미충족 (PRD Q9)
- 문자 등급 체계(SS+ …)와 운명운 점수를 백엔드가 주는지 미확인 (Q7)

## Unverified Assumptions

- 디자인의 '친구 궁합 순위' 섹터(결과 화면)와 '궁합 지도' 화면을 둘 다 유지했다. 라우트는 전부 제안값
- 사전신청 이메일은 인증 없는 안내 수신용으로 해석했다
- 디자인·기획서에 없는 것은 미정으로 표기했다(소유자 지시) — openapi의 [미정] 엔드포인트, FR-4 공유 방식, FR-8 배치 규칙

## Exact Next Action

`git push -u origin ws/spec-design-first-alignment` 후 `scripts/ai-end.sh --ready --pr`로 PR을 올린다 (VM에 GitHub 인증이 없어 push 못 함).
