# 2026-09-23 v1-architecture — V1 로그인·소개팅이 ARCHITECTURE 에 들어왔다

- Required: yes
- Applies to: all
- Change: ADR-20260923-v1-account-and-kakao-login.md · docs/ARCHITECTURE.md
- Action: `docs/ARCHITECTURE.md` 를 다시 읽는다 — (1) 로그인 여부는 쿠키가 아니라 `src/api/me.ts` 의
  `GET /me` 응답으로만 판단한다. JWT 는 `HttpOnly` 쿠키라 프론트가 읽을 수 없고, 인앱에서 쿠키가 막힌
  경우를 같은 경로로 다뤄야 한다(NFR-7·NFR-8). `client.ts` 는 `credentials: 'include'` 로 보내고 401 을
  로그아웃으로 다룬다. (2) 가드가 셋으로 갈린다 — `requireSaju`(기존 `requireSession` 이 이어받는다) ·
  `requireAuth` · `requireDatingProfile`, 전부 `src/app/routes/guards.ts` 에만 둔다. (3) 계정 기록이
  게스트 기록을 이긴다 — 계정이 비어 있을 때만 브라우저의 `resultId` 를 연결하고, 두 기록을 합치지 않는다
  (FR-21). 비로그인 사주·공유·친구 궁합 경로는 바뀌지 않는다(FR-20). (4) 소개팅은 `src/features/dating/`
  하나 안에서 단계 폴더로 나눈다 — `features ↔ features` import 를 만들지 않기 위해서다. (5) `api/` 는
  `me.ts`·`auth.ts`·`dating.ts`·`unlocks.ts`·`matchRequests.ts`·`threads.ts`·`uploads.ts`·
  `compatibilityReasons.ts` 로 나뉘고, `ui/` 에 `BottomNav`·`BottomSheet`·`Tabs`·`LockedValue`·
  `ThreadCount`·`Avatar`·`BlurredPhoto`·`ProfileCard` 가 더해진다. 기존 입력 컨트롤은 그대로 재사용한다.
  **(V1)** 표시가 붙은 항목은 spec 으로 확정됐고 아직 구현되지 않은 것이다 — V1 API 계약(`docs/api/openapi.yaml`)은
  아직 비어 있으니 Phase 09/T2 전까지는 함수 시그니처만 두고 화면을 진행한다.
- Until: Phase 11 종료
