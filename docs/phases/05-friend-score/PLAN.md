# Phase 05 — friend-score

- Status: PLANNED
- Lead: @nicerjs23
- Depends on: 04
- Start: TBD · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

공유 링크를 받은 사람이 링크 주인의 궁합 지도를 보고(SCR-06), '내 사주 내용도 확인하기'로 자기 사주를 만들거나(없을 때) 바로 이어서 궁합이 산출되어, 궁합 점수와 등급(귀인 ≥90 · 찰떡 75–89 · 벗 61–74 · 스침 ≤60)이 양쪽 결과 화면 순위와 궁합 지도(구슬·등급별 인원·순위)에 쌓인다.

## Motivation

Phase 04 가 결과를 밖으로 내보내는 링크(`/s/<shareId>`)를 만들었지만, 그 링크를 누른 친구가 도착할 화면이 없다. 지금 친구는 없는 경로 화면을 본다. 이 Phase 가 링크의 도착지(친구의 궁합 지도) → 친구의 사주 → 궁합 산출을 잇고, 그 결과가 양쪽 순위·지도에 쌓이게 해야 '공유 → 친구 유입 → 소개팅' 흐름의 두 번째 고리가 닫힌다.
궁합 지도(SCR-08)의 퍼블리싱(T2)과 라우트(T3), 공유·궁합 API(T4)는 병합됐다. 2026-09-15 소유자가 흐름을 확정했다 — 공유받은 사람은 별도 랜딩이 아니라 **링크 주인의 궁합 지도**(Figma 713:3956)를 보고, 별도 궁합 결과 화면(SCR-07) 없이 **자기 결과 화면**으로 간다. 그래서 남은 일은 지도 화면의 방문자 변형(T5)과 흐름 조립(T7), 인트로 카운트다운(T8)이다.

## Scope

- 공유 링크 흐름: SCR-06 `/s/:shareId`(링크 주인의 궁합 지도 + '내 사주 내용도 확인하기') → 보관된 내 결과가 없으면 `/`(SCR-01 인트로 → SCR-02 사주 입력) → 궁합 생성 → SCR-04 `/reading/:resultId` — FR-6, FR-7, FR-14, FR-15
- 공유받은 `shareId` 의 탭 단위 보관(sessionStorage) — 입력 중 이탈·새로고침에도 궁합까지 이어진다
- SCR-01 인트로 건너뛰기 칸의 2초 카운트다운 (FR-1)
- 궁합 산출 뒤 양쪽 결과 화면 순위(SCR-04)·궁합 지도(SCR-08)에 상대가 나타나는 것의 확인 (FR-8, FR-14 — 표시는 T2·T3 몫)
- 병합됨: SCR-08 궁합 지도 퍼블리싱(T2) · `/me/map` 라우트와 `compatibilities` 스키마 정정(T3) · 공유·궁합 API(T4)

## Out of Scope

- 궁합 점수·등급 계산 — 백엔드가 `score`·`tier` 를 준다(FR-7, 화면은 계산하지 않는다)
- 궁합 결과 전용 화면(SCR-07) — 2026-09-15 삭제. 점수는 양쪽 순위·지도에서 본다
- 궁합 지도 구슬 배치 규칙(PRD Q11) — T2 가 디자인 고정 좌표로 처리했다
- 공유 링크 미리보기 OG 메타·썸네일(NFR-3) — Phase 08 T4. `shareId` 별 동적 미리보기는 기각(ADR-20260915-share-preview-static-meta)
- 방문자 → 소개팅 사전신청 연결 — Phase 06
- 궁합 결과 이미지 공유 — 디자인·기획에 없다

## Dependencies

- Phase 04 — Task 8/8 병합, Phase 종료(@gn00py48) 전이다. 조립 Task(T7)는 `routes.tsx` 를 04/T8·05/T3 병합본 위에서 고친다
- 05/T3 병합됨(#99), 05/T4 병합됨(#102) — `getSharedResult`·`createCompatibility`. 운영 호출 대조(2026-09-15, chore-compat-list-schema): 조회(`GET /results/{id}`·`GET /shares/{id}`)의 `compatibilities[]` 는 `{ nickname(상대), score, tier, createdAt }`(`compatibilitySummarySchema`), 궁합 생성 응답은 `{ score, tier, originNickname, guestNickname }`(`compatibilitySchema`)이다. 운영 Swagger 는 조회 목록도 두 닉네임 모양이라고 적지만 실제와 다르다 — 응답은 실측을 따른다
- 디자인 — SCR-06 = 「궁합 지도 확인」(713:3956): SCR-08(558:2571)과 같은 지도·등급별 인원·순위, 부제 "닉네임님과의 궁합 지도예요.", 맨 아래 Button/Primary '내 사주 내용도 확인하기'. 주인 친구가 0명이면 순위 빈 상태는 SCR-08 그대로(소유자 2026-09-15)
- 백엔드 계약 — `GET /shares/{shareId}` 는 `SharedResultResponse`(결과와 같고 `resultId`·`shareId` 없음, 404 `RESULT_NOT_FOUND`). `POST /shares/{shareId}/compatibility` 는 `{ guestResultId }` → 새로 만들면 201, 이미 있는 조합이면 재계산 없이 200(같은 값), 링크 주인 결과와 같으면 400 `SELF_COMPATIBILITY`. 궁합은 origin·guest 양쪽 `GET /results/{id}` 의 `compatibilities` 에 내려온다(WKS-BE `CompatibilityRepository.findAllByResultIdOrderByCreatedAtDesc`, cb3fb39)
- 세션 — 공지 `2026-09-14-result-ownership`: `/s/:shareId` 는 가드가 없고, `guestResultId` 는 이 브라우저가 보관한 `resultId` 다. 보관된 결과가 있으면 입력을 건너뛴다(소유자 2026-09-15)
- 로컬 확인 — 운영 백엔드 CORS 가 `http://localhost:3000` 을 막고 `http://localhost:5173` 은 허용한다(2026-09-15, Phase 03 RESULT Known Issues). 실제 백엔드로 흐름을 확인할 때는 5173 으로 띄우거나 해결을 기다린다

## Tasks

- [x] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/05-friend-score/` · Owner: @nicerjs23 (commit b9a58c2)

- [x] T2. 궁합 지도 퍼블리싱 — Done when: Figma 「UI 최종 - 개발용」 지도 「최종」(558:2570, v2 등급별 색 구슬)의 달·궤도·친구 구슬(귀인·찰떡·벗·스침)·등급별 인원 4칸·친구 궁합 순위·빈 상태가 props(내 닉네임·친구 목록 `{ nickname, score, tier }`)로만 렌더되고 `/preview` 에서 가짜 데이터로 확인된다 (테스트 포함). 구슬 배치 규칙이 미정이면(PRD Q11) 디자인 배치를 고정 좌표로 쓴다 · Touches: `src/features/friends/map/`, `src/features/friends/index.ts`, `src/ui/assets/orbs/`, `src/ui/assets/backgrounds/compatibility-map.svg`, `src/app/preview/screens/map.tsx` · Owner: @jjjung0921 (commit 573adfb) (commit 5be8419 — 결과 화면 순위 요약은 `FriendRanking` 을 03/T7 이 `ranking` 슬롯에 넣는다)

- [x] T3. 궁합 지도 라우트와 결과 화면 '지도 보기' — Done when: `/me/map` 이 `routes.tsx` 에 등록돼 보관된 `resultId` 가 없으면 `/` 로 보내고(FR-18), 있으면 `GET /results/{resultId}` 의 `compatibilities` 를 친구 목록(상대 닉네임 = 내 닉네임이 아닌 쪽, 점수 높은 순)으로 바꿔 `CompatibilityMapScreen` 에 넘기며, 결과 화면 친구 궁합 순위 제목 줄의 '지도 보기 >'(Figma 798:3138)가 `/me/map` 으로 이동하고, `compatibilities` 응답 스키마가 백엔드 실제 모양(`score`·`tier`·`originNickname`·`guestNickname`)으로 파싱된다 (테스트 포함) · Touches: `src/app/routes.tsx`, `src/app/routes.test.tsx`, `src/api/schema/result.ts`, `src/api/schema/result.test.ts`, `src/features/saju/readingView.ts`, `src/features/saju/toReadingView.ts`, `src/features/saju/toReadingView.test.ts`, `src/features/friends/`, `src/app/preview/screens/map.tsx`, `src/api/results.ts`, `src/api/results.test.ts`, `src/app/requireSession.ts`, `src/features/saju/readingLoader.test.ts`, `src/features/share/link/ShareLinkButton.tsx`, `src/features/share/link/ShareLinkButton.test.tsx`, `src/app/preview/screens/reading.tsx` · After: 04/T8 · Owner: @jjjung0921 (commit ea218bd)

<!-- T3(2026-09-15): 소유자 결정으로 T1 상세 계획 전에 궁합 지도 라우트를 먼저 연다 — 결과 화면 순위에 '지도 보기'(Figma 798:3138)가 추가됐다. 공유 랜딩·궁합 산출(SCR-06·07)은 여전히 T1 이 채운다.
     퍼블리싱 먼저(2026-09-13): T2 는 Phase 04 완료·T1 상세 계획을 기다리지 않는다(props 만). 등급별 인원 계산·조회 연동은 T1 이 채울 Task 다. 03/T6 병합 뒤 시작한다. -->

- [x] T4. 공유·궁합 API 연동 — Done when: `src/api/shares.ts` 의 `getSharedResult(shareId)`·`createCompatibility(shareId, guestResultId)` 가 `request()` 로 호출하고 응답을 zod 로 파싱해 `ApiOutcome` 을 돌려주며, `SharedResultResponse` 는 `resultId`·`shareId` 없이 파싱되고 `compatibilities` 는 05/T3 이 정정한 `compatibilitySummarySchema` 를 재사용하며, 201·200 이 같은 성공으로, 404 `RESULT_NOT_FOUND`·400 `SELF_COMPATIBILITY` 가 `{ kind: 'api', code }` 로 구분되고, POST 는 재시도하지 않으며, `VITE_API_MOCK=true` 면 파일 안 목 응답(주인 1명·결정적 점수·보관 `resultId` 가 주인과 같으면 `SELF_COMPATIBILITY`)을 돌려준다 (테스트 포함) · Touches: `src/api/shares.ts`, `src/api/shares.test.ts`, `src/api/schema/share.ts`, `src/api/schema/share.test.ts` · Owner: @nicerjs23 (commit 27e78a1)

- [x] T5. SCR-06 방문자용 궁합 지도 퍼블리싱 — Done when: `CompatibilityMapScreen` 이 방문자 변형(Figma 713:3956 — 제목 "<주인 닉네임>님의 궁합 지도", 부제 "<주인 닉네임>님과의 궁합 지도예요.")을 props 로 렌더하고, 맨 아래 슬롯에 둘 버튼 모양(Button/Primary '내 사주 내용도 확인하기')이 SCR-08 공유 버튼과 같은 자리에 오며, 화면 props·DOM 에 주인의 운명·등급·십이간지·행운이 없고(FR-15), `/preview` 에서 방문자 변형의 친구 있음·없음(순위 빈 상태는 SCR-08 과 같음)을 가짜 데이터로 볼 수 있다 (테스트 포함). `src/api/` 를 import 하지 않는다 · Touches: `src/features/friends/map/CompatibilityMapScreen.tsx`, `src/features/friends/map/CompatibilityMap.tsx` (각 `*.test.tsx`), `src/features/friends/index.ts`, `src/app/preview/screens/map.tsx` · Owner: @jjjung0921

<!-- T6(SCR-07 궁합 결과 퍼블리싱)은 2026-09-15 소유자 결정으로 삭제했다 — 방문자는 궁합 생성 뒤 자기 결과 화면으로 간다. 번호는 다시 쓰지 않는다(05/T4 HANDOFF 등이 T7 을 가리킨다). -->

- [x] T7. 공유 링크 흐름 조립 — Done when: ① 가드 없는 `s/:shareId` 의 loader 가 `GET /shares/{shareId}` 를 방문자용 지도 뷰 모델(주인 닉네임 + `compatibilities` 를 T3 과 같은 규칙의 친구 목록으로)로 바꾸고 `shareId` 를 sessionStorage 에 보관하며, 404 는 없는 링크 오류 화면이다 ② '내 사주 내용도 확인하기'는 보관된 `resultId` 가 없으면 `/` 로, 있으면 입력 없이 궁합 생성으로 간다 ③ `/` 의 `sajuAction` 은 `POST /results` 성공 뒤 보관된 `shareId` 가 있으면 `/reading/:resultId` 대신 궁합 생성으로 간다 ④ 궁합 생성(`POST /shares/{shareId}/compatibility`, `guestResultId` = 보관된 `resultId`)은 201·200 과 `SELF_COMPATIBILITY` 에서 보관한 `shareId` 를 지우고 `/reading/:resultId` 로 보내며, 그 밖의 실패는 오류를 안내하고 `shareId` 를 남겨 다시 시도하면 입력 없이 재시도된다(결과가 두 번 만들어지지 않는다) ⑤ 궁합이 만들어진 뒤 양쪽 `GET /results/{id}` `compatibilities` 에 상대가 들어간다 (테스트 포함 — 목 응답·loader·action·라우트 테스트). sessionStorage 값은 읽을 때 zod 로 파싱한다 · Touches: `src/app/routes.tsx`, `src/app/routes.test.tsx`, `src/api/pendingShare.ts`, `src/api/pendingShare.test.ts`, `src/features/saju/sajuAction.ts`, `src/features/saju/sajuAction.test.ts`, `src/features/friends/shareMapLoader.ts`, `src/features/friends/joinShareLoader.ts` (각 `*.test.ts`), `src/features/friends/index.ts` · After: T5, 04/T8 · Owner: @jjjung0921 (commit 0a01628)

- [ ] T8. 인트로 건너뛰기 카운트다운 — Done when: SCR-01 인트로의 건너뛰기 칸이 처음 2초 동안 숫자(2 → 1)를 1초마다 바꿔 보여주고 2초에 '건너뛰기' 버튼으로 바뀌며(칸 크기·위치는 지금과 같다), 카운트다운 숫자는 스크린리더에 버튼이 아님을 알린다(`aria-hidden` 또는 상태 문구), 공유 링크 랜딩에서 `/` 로 온 첫 방문자에게도 인트로가 뜬다 (테스트 포함 — 가짜 타이머) · Touches: `src/features/intro/IntroVideo.tsx`, `src/features/intro/IntroVideo.test.tsx` · Owner: @jjjung0921

- [ ] T9. 궁합 지도 애니메이션 — Done when: 궁합 지도 카드(SCR-08·SCR-06 공통, `CompatibilityMap`)에서 Figma 「궤도」(558:2589)의 궤도 선만 추출한 에셋이 배경 SVG 와 분리된 레이어로 그려지고, 친구 0~2명이면 궤도 선이 저마다 자기 중심으로 돌아(선 자리는 그대로, 밝은 구간만 흐른다) 구슬은 제자리에 있고, 3명 이상이면 궤도 선과 구슬이 달 중심으로 한 덩어리로 돌아 구슬이 궤도 위를 지나가며(같은 중심·같은 속도라 구슬 사이 거리가 변하지 않아 겹치지 않는다), 두 경우 모두 한 바퀴 30초로 끝없이 돌고, 닉네임 글자는 반대로 돌아 늘 똑바로 서며, `prefers-reduced-motion: reduce` 면 멈춰 있고, `/preview` 에서 친구 2명·5명 상태로 두 모드를 볼 수 있다 (테스트 포함 — 인원별 모드 표시). 새 의존성 없이 CSS `transform` 애니메이션으로 한다 · Touches: `src/features/friends/map/CompatibilityMap.tsx`, `src/features/friends/map/CompatibilityMap.css`, `src/features/friends/map/CompatibilityMapScreen.test.tsx`, `src/ui/assets/backgrounds/compatibility-map.svg`, `src/ui/assets/backgrounds/compatibility-orbits.svg`, `src/app/preview/screens/map.tsx` · After: T5 · Owner: @jjjung0921

<!-- 05/T1 상세 계획(2026-09-15, @nicerjs23) → 2026-09-15 소유자 흐름 확정(spec-share-map-landing)으로 T5 재정의·T6 삭제·T7 재정의·T8 추가. 2026-09-15 소유자 결정(spec-map-motion)으로 T9 추가 — 궤도 선마다 중심이 달라, 구슬을 각자 궤도 중심으로 돌리면 서로 거리가 바뀌어 겹칠 수 있다. 궤도 선과 구슬을 달 중심으로 함께 돌리면 구슬이 선 위에 머물고 간격이 유지된다. 궤도가 패널 밖으로 나가는 구간이 있어 한 바퀴 중 구슬이 잠시 가려질 수 있다 — `/preview` 에서 보고 조정한다.
     SCR-06 을 friends feature 에 둔 이유: 궁합 지도(T2)와 같은 화면이고, share feature 는 링크를 '내보내는' 쪽(04)이다. features 끼리 import 금지라 saju 의 `sajuAction` 은 `src/api/pendingShare.ts` 로만 보관 `shareId` 를 읽는다.
     궁합 생성을 별도 경로(예: `s/:shareId/join` loader)로 모으면 SCR-06 버튼과 `sajuAction` 두 입구가 같은 처리·오류 화면을 쓴다 — 경로 이름은 T7 이 정한다. 백엔드가 이미 있는 조합을 200 으로 주므로 재시도·새로고침에 안전하다. -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-01·06·07·08)와 공유 링크 흐름 문단, FR-1, FR-6, FR-7, FR-8, FR-14, FR-15
- Figma 「UI 최종 - 개발용」 — 지도 「최종」(558:2571, v2 등급별 색 구슬), 「궁합 지도 확인」(713:3956, 공유받은 사람), 사주 결과 화면 Frame 51(친구 궁합 순위 빈 상태)
- `docs/ARCHITECTURE.md` — Data Flow 2, Persistence, Module Boundaries
- `docs/api/openapi.yaml`

## Acceptance Criteria

- [ ] AC1. 공유 링크(`/s/<shareId>`)로 들어오면 세션 없이 링크 주인의 궁합 지도(주인 닉네임 제목·방문자 부제·구슬·등급별 인원·순위)와 '내 사주 내용도 확인하기'가 보이고, 주인의 사주 요약(운명 제목·설명·등급·십이간지·행운)이 화면과 DOM 어디에도 없다 (FR-15, FR-18)
- [ ] AC2. 이 브라우저에 결과가 없는 방문자가 버튼을 누르면 `/` 로 가서(첫 방문이면 인트로) 사주를 입력하고, 입력을 마치면 궁합이 만들어진 뒤 자기 결과 화면으로 간다. 결과가 있는 방문자는 입력 없이 바로 궁합이 만들어지고 자기 결과 화면으로 간다 (FR-6)
- [ ] AC3. 궁합이 만들어진 뒤 양쪽 결과 화면 친구 궁합 순위와 궁합 지도에 상대가 응답 `tier` 그대로의 등급과 점수로 나타난다 (FR-7, FR-8, FR-14)
- [ ] AC4. 사주 입력 중 새로고침해도 같은 탭이면 궁합까지 이어지고, 탭을 새로 열면 공유 흐름이 이어지지 않는다(sessionStorage)
- [ ] AC5. 없는 `shareId` 는 오류 화면, 자기 링크면 궁합 없이 자기 결과로 가고, 궁합 생성 실패는 오류를 안내하며 다시 시도하면 사주를 다시 입력하지 않고 재시도된다
- [ ] AC6. 인트로 건너뛰기 칸이 2초 동안 2 → 1 카운트다운 뒤 '건너뛰기' 버튼이 된다 (FR-1)
- [ ] AC8. 궁합 지도가 친구 0~2명이면 궤도 선이, 3명 이상이면 궤도 선과 구슬이 함께 30초에 한 바퀴 돌고 구슬끼리 겹치지 않으며, 동작 줄이기 설정에서는 멈춘다 (FR-8)
- [ ] AC7. `src/features/friends/` 의 화면 컴포넌트가 `src/api/` 를 import 하지 않고, SCR-06 의 상태를 `/preview` 에서 가짜 데이터로 볼 수 있다 (publishing-first). 새 화면·로직에 테스트가 있고 Commands 4개가 경고 없이 통과한다

## Validation Plan

- AC1·AC7: T5 컴포넌트 테스트(주인 요약 텍스트 부재 단언) + `src/features/friends/` 에서 `@/api` grep + `/preview` 수동 확인
- AC2·AC4·AC5: T7 loader·action·라우트 테스트(목 응답 — 보관 결과 없음·있음, 201·200·404·SELF_COMPATIBILITY·연결 실패 뒤 재시도, sessionStorage 보관·삭제)
- AC3: 실제 백엔드로 브라우저 두 개(주인·방문자) 수동 1회 — 주인이 결과를 만들고 `/me/map` 에서 공유한 링크를 방문자 브라우저에서 열어 입력한 뒤 양쪽 결과·지도 새로고침. 운영이면 결과 2건·궁합 1건·LLM 2회가 생긴다. 로컬은 5173 포트(CORS)
- AC6: T8 컴포넌트 테스트(가짜 타이머 0·1·2초) + 실기기 1회
- AC8: T9 컴포넌트 테스트(인원별 모드) + `/preview` 2명·5명 수동 확인 + 브라우저 `prefers-reduced-motion` 에뮬레이션 1회
- AC7: `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`
