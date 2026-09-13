# 2026-09-13 server-state-session — 서버 데이터는 route loader·action으로, 세션은 `api/session.ts`로만

- Required: yes
- Applies to: all
- Change: ADR-20260913-server-state-and-session-storage.md · docs/ARCHITECTURE.md State Management·Persistence·External Systems·Cross-cutting · PR (03-T2-state-session-adr)
- Action: 요청/캐시 라이브러리(TanStack Query 등)를 추가하지 않는다. `src/api/` 함수는 라우터를 모르고, 화면은 feature가 export 한 route `loader`(읽기)·`action`/`useFetcher`(쓰기)로 부른다 — 컴포넌트 `useEffect` fetch 금지. `/reading/:id` 하위 화면은 `useRouteLoaderData`로 부모 결과를 쓴다. 세션(`resultId`, 토큰은 Q16 뒤)은 `src/api/session.ts`의 `readSession`·`writeSession`·`clearSession`만 쓰고 localStorage를 직접 만지지 않는다. POST는 자동 재시도하지 않는다. T1은 `session.ts`·GET 재시도를, T3은 loader 가드·`errorElement`·`HydrateFallback`을 맡는다.
- Until: Phase 08 종료
