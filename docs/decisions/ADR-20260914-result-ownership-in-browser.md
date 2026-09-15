# ADR-20260914: 결과 화면의 주인은 이 브라우저가 만든 `resultId` 로 확인한다 — 백엔드 세션 토큰은 없다

- Status: Accepted
- Date: 2026-09-14
- Deciders: @jjjung0921 (제안) / 리뷰어는 PR 승인자

## Context

ADR-20260913-server-state-and-session-storage 의 세션 절은 "백엔드가 세션 토큰을 발급한다"(PRD 2026-09-13 결정, Q16)를 전제로, 토큰을 localStorage `wks:session` 에 두고 `/reading/:id` 가드가 토큰 유무를 보게 했다. 지금 토큰을 쓰는 코드는 목 응답(`src/api/results.ts` `mockCreateResult`)뿐이다.

백엔드는 토큰을 발급하지 않고, 발급하지 않는 것이 백엔드의 설계다(2026-09-14 확인).

- 운영 `https://api.threadoffate.site/v3/api-docs`: `components.securitySchemes`·전역 `security` 가 없고 `ResultResponse` 에 토큰 필드가 없다. 토큰 없이 `GET /api/results/{resultId}` 가 조회된다(없는 id 는 404 `RESULT_NOT_FOUND`).
- WKS-BE `docs/architecture.md` §4 인증 설계: 사주·궁합은 인증이 없다. 본인용 `resultId` 와 공개 링크용 `shareId` 는 UUIDv4 이고 "URL 소유 = 권한"이며, 인증 체인도 세션도 없다. Spring Security·JWT 는 스택에서 뺐다.
- `resultId` 는 `POST /results` 응답으로 만든 사람에게만 간다. 공유 응답(`GET /shares/{shareId}`)과 궁합 응답에는 없다(백엔드 FR-RS-01A · FR-CP-07).

그래서 실제 백엔드로는 입력 → `POST /results` 201 → `/reading/:id` → 가드가 세션 없음으로 `/` 에 돌려보낸다. Phase 03 AC1 과 Phase 04 AC2(`/reading/:id/card`)가 운영에서 막히고, MVP 마감은 2026-09-17 이다.

- FR-18 의 의도는 남의 결과를 주소만으로 열지 못하게 하고, '내 결과'가 없으면 입력으로 안내하는 것이다.
- `/me/map`(SCR-08)은 주소에 id 가 없어 브라우저가 내 `resultId` 를 알고 있어야 한다.
- 친구 궁합 `POST /shares/{shareId}/compatibility` 는 `guestResultId` 로 방문자 자신의 `resultId` 를 요구한다.
- 백엔드 저장소는 프론트엔드가 바꾸지 않는다(이 저장소는 프론트엔드 전용 — PRD Constraints).

## Problem

백엔드 토큰 없이 (1) 결과·인연카드 화면의 가드를 무엇으로 판단하고, (2) 브라우저가 '내 결과'를 어떻게 기억하는가.

## Alternatives

1. **이 브라우저가 만든 `resultId` 를 보관하고, 가드가 주소의 `:id` 와 비교한다** — 프론트엔드만 바뀐다. FR-18 의 의도를 브라우저 단위로 지키고, `/me/map`·`guestResultId` 도 같은 값을 재료로 쓴다. 대신 같은 사람이 다른 브라우저(인앱 → 기본 브라우저, 다른 기기)에서 자기 결과 주소를 열어도 막힌다.
2. **결과 화면 가드를 없앤다** — 추측할 수 없는 `resultId`(UUIDv4) 주소를 열쇠로 보는 것으로, 백엔드 모델과 같다. FR-18·03 AC6 를 바꿔야 하고 주소가 새면 누구나 연다. `/me/map` 때문에 `resultId` 보관은 여전히 필요하다.
3. **백엔드가 토큰을 발급한다(원래 Q16)** — 백엔드의 "인증 없음" 설계를 뒤집어야 하고 백엔드 소유 작업이다. 9/17 마감 안에 될지 알 수 없다.

## Decision

대안 1.

- 보관: `src/api/session.ts` 만 스토리지를 읽고 쓰는 것은 그대로다. 키 `wks:session` 과 함수 `readSession()`·`writeSession()`·`clearSession()` 이름도 유지한다. 값은 `{ v: 2, resultId }` 이고(`resultId` 는 UUID) 읽을 때 zod 로 파싱한다. `{ v: 1, token }` 을 포함한 파싱 실패 값은 지금처럼 키를 지우고 세션 없음으로 본다 — 옮기는 코드는 없다.
- 한 브라우저에는 결과 하나만 기억한다. 새 결과를 만들면 이전 값을 덮어쓴다.
- 쓰는 곳: `src/api/results.ts` `createResult` 가 성공 응답에서 `writeSession(data.resultId)` 한다. 목 응답과 실제 응답이 같은 경로를 탄다.
- 가드(route loader):
  - 주소에 결과 id 가 있는 화면(`/reading/:id`, `/reading/:id/card`)은 보관된 `resultId` 가 `:id` 와 같을 때만 통과한다. 없거나 다르면 `redirect('/')`.
  - 주소에 id 가 없는 보호 화면(`/me/map`, `/matching`)은 보관된 `resultId` 가 있을 때만 통과하고, 그 값으로 조회한다.
  - 공유 랜딩 `/s/:shareId` 는 가드하지 않는다. 방문자가 결과를 만들면 그 `resultId` 가 보관되고 `guestResultId` 로 쓰인다.
- `src/api/client.ts` 는 인증 헤더를 싣지 않고, `INVALID_TOKEN` 응답에 세션을 지우지 않는다(이 코드는 사전신청 매직링크 전용이다).

## Rationale

- 결정적 기준은 "백엔드는 인증을 두지 않기로 설계했고 백엔드 저장소는 이 팀이 바꾸지 않는다 + 9/17 마감"이다. 그래서 대안 3 을 뺐다.
- 대안 2 와 비교하면 보관은 어느 쪽이든 필요하다(`/me/map`·`guestResultId`). 대안 1 의 추가 비용은 가드의 비교 한 번이고, 그 대가로 FR-18 의 의도를 유지한다.
- 보관 위치·모듈·키를 그대로 두어 ADR-20260913 의 localStorage 선택 근거(3일 축제 재방문, 요청 없이 판단하는 가드)가 그대로 성립하고, 바뀌는 코드가 `session.ts`·`results.ts`·`client.ts`·`requireSession.ts`·`routes.tsx` 로 한정된다.
- 결과를 하나만 기억해야 `/me/map` 의 '나'가 하나로 정해진다.

## Consequences

- 긍정: 백엔드 변경 없이 실제 연동으로 입력 → 결과 → 인연카드를 완주한다(03 AC1, 04 AC2). 목 모드에서만 세션이 생기던 차이가 사라진다. PRD Q16 이 닫힌다.
- 부정 / 감수한 것:
  - 다른 브라우저·기기에서 자기 결과 주소를 열면 입력으로 안내된다(인앱 브라우저 → 기본 브라우저 포함). ADR-20260913 이 토큰에 대해 감수한 것과 같다.
  - 같은 브라우저에서 결과를 다시 만들면 이전 결과의 주소는 막힌다.
  - 이 가드는 브라우저 안의 안내다. 백엔드는 `resultId` 만으로 조회를 허용하므로 주소가 새면 API 로는 읽힌다 — 보안 경계는 링크 키(UUIDv4)의 추측 불가능성이며 백엔드가 소유한다.
  - localStorage 의 `resultId` 는 XSS 로 읽힐 수 있다 — 토큰과 같은 노출이고 같은 방법(제3자 스크립트·`dangerouslySetInnerHTML` 금지)으로 줄인다.
- 후속 작업:
  - ADR-20260913-server-state-and-session-storage 의 Status 에 세션 절 대체를 표시 (이 PR)
  - `docs/PRD.md` Constraints·FR-18·Screens, Q16 닫기 · `docs/ARCHITECTURE.md` Data Flow·State Management·Persistence·Cross-cutting Concerns (이 PR)
  - 공지 `2026-09-14-result-ownership` — 토큰을 전제한 이전 공지 항목을 대체 (이 PR)
  - Phase 03 T8: 위 Decision 의 코드 변경과 테스트
  - Phase 06: '내 신청' 식별 — `POST /signups` 가 `resultId`(nullable)를 받는다. 보관된 `resultId` 를 실을지 Phase 06 에서 정한다
