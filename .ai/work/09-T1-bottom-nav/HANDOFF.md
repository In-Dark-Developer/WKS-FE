# Handoff — 09-T1-bottom-nav

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: 09/T1

## Goal

홈·궁합지도·소개팅 세 탭 네비가 viewport 하단에 고정되고, 홈 탭은 사주 유무로 결과/입력으로 가며, 공유 Flow 에서는 보이지 않는다(FR-19).

## Work Completed

- `ui/BottomNav` — 탭 목록·선택 탭을 받는 표현 컴포넌트. 아이콘 home·map·heart 는 Figma 에셋 그대로
- `app/screens/BottomNavBar` — 탭→경로. 홈은 누를 때 세션을 읽어 결과 또는 `/` (FR-19)
- `RootLayout` 이 가장 깊은 `handle.nav` 로 네비를 켠다 — `reading/:id`=home · `me/map`=map · `dating`=dating
- `/dating` 자리(`dating.routes.tsx`, Placeholder) — 인트로는 10/T4 퍼블리싱 뒤 10/T1 이 붙인다
- 레이아웃: 네비 있으면 콘텐츠 아래 여백 +83px, Safe Area(`viewport-fit=cover`), 토스트를 네비 위로

## Work In Progress

- 네비는 라우트 `handle.nav`('home'·'map'·'dating')로 켠다 — 배경 `handle.backdrop` 과 같은 방식. 핸들 없는 라우트(입력·공유·궁합 이유)는 네비가 없다
- Figma 원본: 276×63 알약, 하단 20px, GLASS, 배경 Rose/50 20%·선택 Primary/500 80% (변수가 아닌 raw paint)

## Files Changed

- `src/ui/BottomNav.tsx`(+test) · `src/ui/Toast.tsx` · `src/ui/tokens/theme.css` · `src/ui/assets/icons/{home,map,heart}.svg`
- `src/app/{AppShell,RootLayout,Placeholder}.tsx` · `src/app/layout.css` · `src/app/screens/BottomNavBar.tsx`
- `src/app/routes/{index,saju.routes,map.routes,dating.routes}.tsx` · `index.test.tsx` · `index.html`

## Decisions Made

- 네비 색 두 개(배경 Rose/50 20%·선택 Primary/500 80%)는 Figma 변수가 아니라 raw paint — `opacity-nav-*` 토큰으로 두고 출처를 주석에 남겼다(text-display-40 선례)
- 아이템 간격 3px 은 스케일에 없어 gap-4 — 높이 63→64px
- `/dating` 에 가드를 두지 않았다 — 기능명세서 1.3, 로그인·프로필 조건은 소개팅 Flow 가 판단

## Tests Executed

- `pnpm test`(70 files, 378) · `pnpm typecheck` · `pnpm lint`
- 브라우저 375×812(mock): `/dating`·결과(홈)·`/me/map` 네비와 선택 탭, 입력 화면 네비 없음, 맨 아래 콘텐츠가 네비 위에서 끝남(713 < 728), 콘솔 에러 0

## Test Results

- 전부 통과

## Known Problems

- 궁합 지도 상단의 '뒤로가기'가 네비와 역할이 겹친다 — Figma 3.1 에도 있어 그대로 뒀다
- `/dating` 은 지금 빈 자리다 — 10/T4·10/T1 전까지 dev→main 릴리스에 내보내지 않는 게 낫다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합. 다음은 openapi 참조본 갱신(spec) → 09/T4.
