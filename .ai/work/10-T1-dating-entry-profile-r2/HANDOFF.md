# Handoff — 10-T1-dating-entry-profile-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (Phase 10 Lead · src/app/ Owner — PR 리뷰)
- Date: 2026-09-25
- Phase / Task: 10/T1

## Goal

#200 이 가안으로 둔 프로필 저장·사진 업로드를 WKS-BE 가 실제로 구현한 계약(api-spec.md §10, dev 5ec80d2)에 맞춘다.

## Work Completed

- openapi.yaml: `/dating/profile/photo`(photoId) · `/dating/profile` · `GET·PATCH /dating/profile/me` · `DatingProfile*` 스키마 · DATING_* 에러 5개 (WKS-BE api-spec.md §10, dev 5ec80d2)
- `api/uploads.ts`: `uploadDatingPhoto` — `/signups/photo-upload-url`+photoKey → `/dating/profile/photo`+photoId
- `api/dating.ts`: `createDatingProfile` — 요청에서 `resultId` 를 뺐다(서버가 계정 결과를 쓴다). 응답을 `DatingProfile` 로 파싱
- `DatingProfileScreen`: photoId 로 저장, 사주는 없을 때만 만든다(재시도해도 한 번)
- `schema/upload.ts` 삭제 — `schema/dating.ts` 로 합쳤다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `docs/api/openapi.yaml` · `src/api/{dating,uploads,schema/dating,schema/envelope}.ts` (+테스트) · `src/api/schema/upload.ts` 삭제
- `src/features/dating/entry/DatingProfileScreen.tsx` (+테스트)

## Decisions Made

- 목 모드는 계정 결과가 없으면 백엔드처럼 `RESULT_NOT_FOUND` 로 막되, 이 브라우저의 `resultId` 가 있으면 계정에 연결해 흐름을 잇는다 — 백엔드는 로그인 때만 연결하기 때문이다(아래 Known Problems).
- 실패 문구는 퍼블리싱(10/T4)의 한 가지 '연결 실패' 상태를 그대로 쓴다 — 404·409 전용 문구를 새로 만들지 않았다.
- openapi 사본은 `/dating/**` 을 cookieAuth 로 적었다(#205 · 공지 2026-09-25-cookie-auth-contract). 백엔드는 아직 Bearer 다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 97 files / 513 passed · typecheck·lint 경고 0 · redocly 새 문제 없음(기존 오류 1·경고 5 그대로)
- 목 모드 브라우저 확인은 아직 안 했다

## Known Problems

- **계정에 사주를 붙일 방법이 없다**: `POST /dating/profile` 은 계정 결과가 없으면 404 인데(§10.2), 연결은 로그인 때만 일어난다(§9). 로그인한 뒤 이 화면에서 사주를 만든 사람은 다시 로그인해야 연결된다 — 백엔드에 연결 API 나 규칙 추가가 필요하다(inconsistency 보고)
- BE `/dating/**` 은 `Authorization: Bearer` 인데 FE 는 쿠키 계약을 가정했다(#205 · 공지 2026-09-25-cookie-auth-contract) — 전환 전까지 실제 모드로 부를 수 없다
- 실(`/api/wallet/**`)·리롤·해금은 BE 미구현(api-spec.md §10 '#84 구현 상태') — 10/T2·T3 는 가정이 필요하다
- `GET /dating/recommendations` 는 학교 메일 인증 연동 전까지 `DATING_NOT_VERIFIED` 403 — 10/T3 의 전제
- 겹침 경고: `09-T8-map-login-cta`(@jjjung0921)가 `LoginSheet.tsx`·`map.routes.tsx` 를 건드린다 — 이 스트림은 두 파일을 고치지 않았다

## Unverified Assumptions

- 학교 메일 인증(Q20) 흐름이 프로필 등록 뒤에 따로 온다 — 지금 화면은 `emailVerified` 를 쓰지 않는다

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR 을 낸 뒤, 다음은 10/T3(추천 `GET /dating/recommendations`).
