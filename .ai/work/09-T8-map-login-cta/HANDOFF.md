# Handoff — 09-T8-map-login-cta

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-25
- Phase / Task: 09/T8

## Goal

비로그인 사용자의 내 궁합지도 맨 아래에 저장 유도 카드가 보이고, 누르면 '궁합지도 저장하기' 카카오 로그인 시트가 뜨며, 로그인 뒤 지도로 돌아와 카드가 사라진다.

## Work Completed

- `MapSaveCard`(Figma v1.0 23:4901, 에셋 `ui/assets/friends/save-elephant.webp`) · `CompatibilityMapScreen` footer 슬롯(공유 버튼 아래 40px)
- `LoginSheet` title·description props(기본값은 소개팅 문구) — 지도는 '궁합지도 저장하기'
- `/me/map` loader 가 GET /me 로 로그인 판단, 비로그인만 카드·시트, 카카오 로그인 복귀 `/me/map`

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/{index.ts,map/MapSaveCard.tsx,map/CompatibilityMapScreen.tsx}` · `src/features/dating/intro/LoginSheet.tsx` · `src/app/screens/MyMapScreen.tsx(+test)` · `src/app/routes/map.routes.tsx` · `src/ui/assets/friends/save-elephant.webp`

## Decisions Made

- GET /me 실패(401 외 포함)는 비로그인으로 보고 카드를 보인다 — 지도는 그대로 연다.
- 공유 버튼 위치는 바꾸지 않았다(Figma 비로그인 프레임은 지도 바로 아래, 로그인 프레임은 순위 아래).

## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 목 모드 브라우저: 비로그인 지도에 카드 → 시트 '궁합지도 저장하기' → 로그인, 로그인 지도에 카드 없음

## Test Results

- 통과. 목 결과가 메모리라 로그인 왕복(전체 새로고침) 뒤 `/me/map` 은 결과를 잃고 `/` 로 간다 — 목 한계, 실제 모드에선 없음

## Known Problems

- 실제 모드 미검증(BE 쿠키 전환 대기). 스크린샷 대조는 못 함(브라우저 캡처 멈춤) — DOM·테스트로 확인

## Unverified Assumptions

- 없음

## Exact Next Action

BE 쿠키 전환 후 실제 모드에서 로그인 → /me/map 복귀·카드 사라짐 확인.
