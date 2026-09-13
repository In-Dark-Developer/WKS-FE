# Handoff — 03-T4-saju-form

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/T4

## Goal

사주 입력 폼이 수정본 4상태대로 검증·'몰라요'·연결 실패 유지·로딩을 보이고 백엔드 입력 모양으로 제출한다.

## Work Completed

- `options.ts` — 성별·달력, 시진 13칸(자시 00:45·23:45, 나머지 가운데 시각) (commit 320a04a)
- `formSchema.ts` — `validateSajuForm` 필드별 에러 동시 반환, 음력 30일·양력 실재일·1950-01-01~오늘, 닉네임 trim·코드포인트 8자, `SajuInput`(gender·calendarType·isLeapMonth·birthDate yyyy-MM-dd·birthTime|null·nickname), action 데이터 zod
- `SajuForm.tsx` — 제출 시 검증, 실패 필드 빨간 라벨·테두리·문구 + 상단 안내, '몰라요' 체크 시 Select 비활성·null, 음력이면 윤달 체크, 전송 중 fieldset 비활성·'처리 중', action 이 `{formError:'connection'}` 이면 입력값 유지 안내
- ui appearance: Button `apricot`, SegmentedControl `accent`, TextField `soft`·`soft-apricot`, Select `soft`, Checkbox `accent`

## Work In Progress

- 없음

## Files Changed

- `src/features/saju/{SajuForm.tsx,formSchema.ts,options.ts,index.ts}` + 테스트 3개
- `src/ui/{Button,TextField,Select,SegmentedControl,Checkbox}.tsx`
- `docs/phases/03-saju-reading/PLAN.md` (T4 체크·Touches)

## Decisions Made

- 소유자 선택: 수정본 스타일, 자시 두 칸, 음력일 때만 윤달 체크
- 입력 모양은 백엔드 api-spec(2026-09-13 18:31) 기준 — calendarType·isLeapMonth 포함, birthRegion 없음(openapi 참조본은 T1 이 갱신)
- 성별 기본값은 선택 없음(디자인은 남자 선택 상태) — 잘못된 기본값으로 사주가 틀리는 것을 막음
- 검증은 zod 대신 필드별 함수 — 화면 상태라 경계 입력 아님, zod 의 조기 중단으로 에러가 한 번에 안 보이는 문제
- 제출은 useSubmit JSON → 라우트 action. 라우트 등록·action 은 T1(api) 후

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build`
- 브라우저 375px: 기본 상태, 빈 제출 오류 상태(빨간 라벨·테두리·안내)

## Test Results

- 110 tests 통과(폼 전송·몰라요·윤달·연결 실패 유지·로딩 포함), 나머지 통과

## Known Problems

- 라우트 미연결 — `/` 는 아직 Placeholder. T1 의 `createResult` 가 있어야 action 을 만들 수 있다
- 수정본 12시진 목록은 자시 한 칸 — 디자인 갱신 요청 필요
- '자세히'(이용약관 695:2753) 는 Modal(02/T3) 전이라 넣지 않음
- `SajuForm.tsx` 약 215줄(200줄 기준 초과), 음력 실재일·윤달 존재는 백엔드 INVALID_INPUT 에 기댐

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합, T1 병합 대기
