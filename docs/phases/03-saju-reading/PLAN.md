# Phase 03 — saju-reading

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 02
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

사주 입력 폼에서 시작해 운명 카드 결과 화면(운명 제목·설명, 연애운·결혼운·자녀운 등급 B0~SS, 행운의 장소(동국대)·아이템)이 뜨고, 그 결과가 백엔드 응답에서 온다. 세션 없이 결과 화면에 들어오면 입력으로 안내된다.

## Motivation

제품의 첫 관문이자 이후 모든 기능(공유·궁합·소개팅)이 딛고 서는 데이터다. 백엔드 호출 계층과 경계 검증 방식도 이 Phase에서 한 번 정해두면 나머지 Phase가 따라 쓴다.

## Scope

- 사주 입력 폼(SCR-02): 성별(남/여) · 달력 기준(양/음력) · 생년월일 8자리 · 12시진 셀렉트 + '몰라요' · 지역 셀렉트 + '몰라요' · 닉네임 1–8자, 기본/오류/연결문제/로딩 4상태
- 결과 대기(SCR-03)와 결과 화면(SCR-04): 운명 카드(십이간지 캐릭터·'○○보살님' 치환·운명 제목·설명·3영역 문자 등급 스탬프 B0~SS), 행운의 장소·아이템 카드, 운세 카드 3장, 보살 말투 문구
- 세션 없음·만료 시 입력 화면으로 안내 (FR-18)
- `src/api/` 클라이언트: 요청/응답 zod 스키마, 에러·타임아웃 처리, 서버 상태 캐시 방식 결정(ADR)
- 백엔드 준비 전 개발을 위한 목(mock) 응답 경로

## Out of Scope

- 인트로 — MVP 제외 (PRD Non-goals)
- 공유 링크·인연카드·'인스타 스토리 공유하기' 버튼 (Phase 04)
- 궁합 점수·결과 화면 하단 '친구 궁합 순위' 섹터·사전신청 티저 (Phase 05·06)
- 로그인/세션 UI — 백엔드 인증 방식 확정 전까지 최소로만

## Dependencies

- Phase 02
- Phase 01 T6 — 백엔드의 `POST /results` · `GET /results/{id}` 계약(2026-09-13 반영됨, `docs/api/openapi.yaml`) · 양·음력·12시진·십이간지·등급 체계 추가 요청 답변 (Q3 · Q7)
- 태어난 지역 선택 목록 (Q6), 윤달 여부 (Q8)
- 결과 대기 디자인(디자인시스템 FortuneLoading)과 결과 에러 상태 디자인

## Tasks

- [ ] T1. API 클라이언트 계층 + 경계 검증 — Done when: `POST /results` · `GET /results/{id}`의 요청/응답 봉투가 zod로 검증되고 스키마 위반·네트워크 실패·`error.code`(404·503)가 타입으로 구분되며 테스트가 통과 · Touches: `src/api/client.ts`, `src/api/results.ts`, `src/api/schema/`, `docs/api/openapi.yaml#/paths/~1results`, `docs/api/openapi.yaml#/paths/~1results~1{resultId}` · Owner: @nicerjs23

- [ ] T2. 서버 상태 캐시·세션 보관 방식 ADR — Done when: ADR이 병합되고 `docs/ARCHITECTURE.md` State Management의 TBD가 사라진다 · Touches: `docs/decisions/`, `docs/ARCHITECTURE.md` · Owner: @jjjung0921

- [ ] T3. 라우트 등록 + 세션 안내 — Done when: `/`(입력)·`/reading/:id`(결과)가 `src/app/routes.tsx`에 등록되고, 세션 없이 `/reading/:id`에 들어오면 `/`로 안내되며(FR-18), 이후 Phase의 라우트 자리(`/reading/:id/card`, `/s/:shareId`, `/me/map`, `/matching`)가 주석으로 예약돼 있다 · Touches: `src/app/routes.tsx`, `src/app/RequireSession.tsx` · Owner: @jjjung0921

- [ ] T4. 사주 입력 폼 — Done when: 성별·달력 기준·생년월일 8자리·12시진·지역·닉네임 8자 검증과 '몰라요'→null 처리가 동작하고, 필드별 에러 문구("생년월일을 숫자 8자리로 작성해 주세요" 등)·연결 실패 시 입력값 유지·로딩 상태가 디자인(수정본 4상태)대로 뜬다 (테스트 포함) · Touches: `src/features/saju/SajuForm.tsx`, `src/features/saju/formSchema.ts`, `src/features/saju/options.ts` · Owner: @gn00py48

- [ ] T5. 결과 화면 — Done when: 운명 카드(캐릭터·'○○보살님'·운명 제목·설명·3영역 등급 스탬프)·행운의 장소/아이템·운세 카드 3장이 응답대로 렌더되고 결과 대기(FortuneLoading)·에러 상태가 있다 · Touches: `src/features/saju/ReadingResult.tsx`, `src/features/saju/DestinyCard.tsx`, `src/features/saju/sections/`, `src/features/saju/zodiac.ts` · Owner: @nicerjs23

<!-- T1은 T4·T5보다 먼저 병합한다(호출 계약이 먼저 있어야 한다). T3·T4·T5는 서로 겹치지 않는다.
     라우트 파일은 충돌 지점이라 T3이 단독으로 소유한다 — 다른 Task는 자기 화면 컴포넌트만 export 하고 등록은 T3이 한다. -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-02·03·04·12), FR-2, FR-3, FR-18, NFR-2, NFR-4
- `docs/ARCHITECTURE.md` — Data Flow 1, State Management, Cross-cutting Concerns
- `docs/api/openapi.yaml` — `/readings`, `/readings/{readingId}`, `/me`
- Figma 「UI 최종 - 개발용」 558-2430 — 수정본(기본/오류/연결문제/로딩중), 사주 결과 화면 Frame 69

## Acceptance Criteria

- [ ] AC1. 입력 → 결과를 이탈 없이 완주할 수 있다
- [ ] AC2. 태어난 시간·지역을 '몰라요'로 두어도 결과를 받을 수 있고, 음력 입력이 전송된다
- [ ] AC6. 세션 없이 `/reading/:id`에 들어오면 입력 화면으로 안내된다
- [ ] AC3. 백엔드 응답이 스키마와 다르면 화면이 깨지지 않고 에러 안내가 뜬다
- [ ] AC4. 입력 폼과 결과 화면에 단위·컴포넌트 테스트가 있다
- [ ] AC5. `src/app/routes.tsx`를 T3 외의 Task가 수정하지 않았다

## Validation Plan

- AC1·AC2: 목 응답으로 흐름 수동 확인 + 폼 테스트
- AC3: 스키마 위반 응답을 주입한 테스트
- AC4: `pnpm test`
