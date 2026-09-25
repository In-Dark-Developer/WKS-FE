# 2026-09-25 cookie-auth-contract — 로그인은 쿠키 계약을 가정하고 이어서 진행한다

- Required: yes
- Applies to: all
- Change: docs/api/openapi.yaml (/auth/kakao · /auth/logout · /me · /me/result · cookieAuth) · docs/phases/09-auth-and-shell/PLAN.md
- Action: 백엔드 쿠키 전환을 기다리지 않는다. 인증이 필요한 호출(`/me`·`/me/result`·소개팅·실)은 `openapi.yaml` 의 쿠키 계약을 가정하고
  목 모드(`VITE_API_MOCK=true`)로 진행한다 — `Authorization` 헤더를 싣지 말고, 토큰을 저장하지 말고, 로그인 여부는 `src/api/me.ts` 로만 판단한다.
  `client.ts` 의 `credentials: 'include'` 는 09/T2 가 넣는다. 실제 모드 확인은 백엔드 전환 뒤로 미루고 PR 에 '부분 전달'로 적는다.
  백엔드(dev 5ec80d2)는 아직 Bearer 이며 `/dating/**` 도 Bearer 다 — 곽도윤이 쿠키로 옮길 때 계약이 달라지면 새 공지로 알린다.
- Until: 백엔드 쿠키 전환 반영 (Phase 09 종료)
