# Phase 03 — saju-reading · Result

- Completed on: 2026-09-15
- Final Status: DONE
- Tag: `phase/03`

## Completed

- T1. API 클라이언트 계층 — `request()` 봉투·zod 경계 검증·GET 1회 재시도, 결과 API·목 경로 (commit 46d150a)
- T2. 서버 상태·세션 보관 방식 ADR — loader/action + 캐시 없음 (commit cc82bf8, 세션 부분은 T8 이 ADR-20260914-result-ownership-in-browser 로 대체)
- T3. 라우트 등록 + 세션 안내 — `routes.tsx`·`requireSession`·SCR-12 오류·로딩 (commit cc0ebd7)
- T4. 사주 입력 폼 SCR-02 — 4상태·12시진·'몰라요'·음력/윤달 (commit 320a04a)
- T5. 결과 화면 퍼블리싱 SCR-03·04 — 운명 카드·행운 카드·운세 카드 (commit 7fc2ccf)
- T6. 퍼블리싱 확인 라우트 `/preview` (commit 17512a9)
- T7. 입력·결과 연동 — `sajuAction`·`readingLoader`·`toReadingView` (commit 90c8cd8), 결과 화면 `ranking` 슬롯 조립 누락분 (commit 019c4ef)
- T8. '내 결과' 판단을 보관된 `resultId` 로 전환 — 백엔드가 세션 토큰을 발급하지 않음 (commit 55dc225)

## Not Completed

- 없음

## Deviations from Plan

- **AC5 문자 그대로는 미충족** — `src/app/routes.tsx` 를 T3·T7·T8 외에 세 커밋이 고쳤다. 충돌·되돌림은 없었다.
  - f0fc208 `chore-page-backdrops`(2026-09-13, @jjjung0921 — `src/app/` Owner): 라우트 `handle.backdrop` 추가
  - 63410f2 `chore-intro-video`(2026-09-14, @jjjung0921): 첫 방문 인트로 — Out of Scope 였던 인트로가 소유자 요청으로 FR-1 에 돌아왔다
  - 728c168 04/T6(2026-09-14, @nicerjs23): 인연카드 라우트·share 슬롯 — Phase 03 Task 7개 병합 뒤 04 PLAN 이 소유를 넘겼다
- 세션: 계획은 백엔드 세션 토큰(Q16)이었으나 백엔드가 토큰을 발급하지 않아 T8 에서 브라우저 보관 `resultId` 로 바꿨다. 운영에서 결과 화면이 입력으로 튕기던 문제를 이것으로 막았다.
- 태스크 분할: 2026-09-13 publishing-first 공지로 T5(퍼블리싱)·T7(연동)이 나뉘고 T5 담당이 @nicerjs23 → @jjjung0921 로 바뀌었다. T6·T8 은 계획 뒤에 추가됐다.
- T7 이 결과 화면 `ranking` 슬롯(05/T2 `FriendRanking`)을 처음 병합에서 빠뜨려 03/T7-r2 로 다시 열어 채웠다.

## Important Decisions

- 서버 상태는 React Router loader/action, 전용 캐시 없음 → ADR-20260913-server-state-and-session-storage
- '내 결과' = 이 브라우저가 만든 `resultId`(`wks:session` `{ v: 2, resultId }`), 요청에 인증 헤더 없음 → ADR-20260914-result-ownership-in-browser
- 화면 컴포넌트는 props 만 받고 응답 → 뷰 모델 변환은 feature 의 loader/`toReadingView` 가 한다 (공지 publishing-first)

## Validation Results

| Check     | Command / Method | Result |
|-----------|------------------|--------|
| Tests     | `pnpm test` | pass — 55 files · 259 tests (saju·routes·api 13 files · 84 tests) |
| Typecheck | `pnpm typecheck` | pass — 오류 0 |
| Lint      | `pnpm lint` | pass — eslint `--max-warnings=0` + prettier |
| Build     | `pnpm build` | pass (500kB 초과 청크 경고 — Phase 08 T5 성능 예산 몫) |
| AC1 | 운영 `https://threadoffate.site` 에서 playwright(390px)로 입력 → 결과 → 인연카드 → 결과 복귀 1회 (2026-09-15) | pass — `POST /api/results 201`, `GET /api/results/{id} 200`, 콘솔 에러 0 (운영 DB 1건·LLM 1회 생성, 닉네임 '점검') |
| AC2 | `SajuForm.test`('몰라요' → `birthTime: null`, 음력·윤달 전송) · `formSchema.test` · `sajuAction.test`(지역 필드 없는 입력으로 `createResult` 정확히 호출) | pass — 폼에 지역 입력 없음 |
| AC3 | `client.test`(스키마 위반 → `{kind:'schema'}`) → `readingLoader.test`(api 외 실패 → 503 Response) → `RouteError.test`(오류 안내, 원인 문구 미노출) | pass — 세 단계 테스트의 연결로 확인(스키마 위반을 화면까지 한 번에 주입한 테스트는 없다) |
| AC4 | `src/features/saju/` 테스트 8 파일(폼·스키마·옵션·액션·loader·뷰 모델·결과·로딩) | pass |
| AC5 | `git log --no-merges -- src/app/routes.tsx` | 문자 그대로는 미충족 — Deviations 참고 |
| AC6 | `routes.test` 보관값 없음·다른 `resultId`·같은 `resultId` × 결과·인연카드 + 운영에서 새 브라우저 컨텍스트로 결과 주소 열기 | pass — 새 컨텍스트는 `/` 로 이동 |

## Known Issues

- **로컬에서 실제 백엔드로 개발할 수 없다** — 운영 백엔드 CORS 가 `http://localhost:3000` preflight 에 403, `http://localhost:5173`·`https://threadoffate.site` 에 200 (2026-09-15 확인). PLAN Dependencies 는 "3000 만 허용"이라 적었고 `vite.config.ts` 는 3000 이다. 목 모드·운영 확인은 영향 없음.
- 운명 제목·설명이 실제 LLM 응답에서 길어 운명 카드에서 말줄임된다(예: '삼재를 꿰뚫는 붉…') — `DestinyCard` 표시 규칙과 백엔드 문구 길이 합의가 필요하다.
- 첫 병합 때 `ranking` 슬롯 누락처럼, 다른 Phase 가 "조립은 T7"이라 적은 교차 참조를 Task Done-when 이 담지 못했다.

## Follow-up Work

- 백엔드 CORS 허용 origin 과 `vite.config.ts` 포트 맞추기 — @hairyung2002 확인 필요
- 운명 제목·설명 길이 — 기획·백엔드·`src/ui/DestinyCard` 담당 합의
- Phase 04 종료(@gn00py48) → Phase 05 상세 계획(05/T1)
