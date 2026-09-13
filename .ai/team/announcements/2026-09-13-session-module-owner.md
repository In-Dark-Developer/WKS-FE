# 2026-09-13 session-module-owner — `src/api/session.ts` 는 03/T3 이 만든다

- Required: yes
- Applies to: touches:src/api/
- Change: docs/phases/03-saju-reading/PLAN.md T3 Touches · PR (03-T3-route-session)
- Action: 03/T1 은 `src/api/session.ts` 를 만들지 않고 import 만 한다 — `readSession(): Session | null` · `writeSession(token)` · `clearSession()`. `client.ts` 는 `readSession()?.token` 을 `Authorization: Bearer` 로 싣고, 세션 무효 응답에서 `clearSession()` 한다. T3 병합 전에 T1 을 진행하면 병합 전 `git merge main` 으로 받는다.
- Until: Phase 03 종료
