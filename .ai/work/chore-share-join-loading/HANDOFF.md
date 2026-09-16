# Handoff — chore-share-join-loading

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (`src/app/` Owner — 리뷰) · @gn00py48 (`src/ui/assets/` 이미지 — 리뷰)
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

공유 링크를 누른 사람이 궁합 지도가 뜨기 전 Figma 1044:4150 의 대기 화면(코끼리·문구·늘어나는 점)을 본다.

## Work Completed

- 소유자 요청(2026-09-17): 공유 링크 첫 진입 대기 화면 추가, 문구는 "이전 정보로 궁합지도를 만들고 있어요", 점 . → .. → ... 애니메이션

## Work In Progress

- 없음 (소유자 push 승인 대기)

## Files Changed

- `src/features/friends/ShareJoinLoading.tsx`·`.css`·`.test.tsx`(신규)·`index.ts`
- `src/app/routes.tsx`(세 공유 주소의 `hydrateFallbackElement`)·`routes.test.tsx` · `src/app/preview/screens/share-loading.tsx`(신규)
- `src/ui/assets/elephant-loading.png`(신규, 260px 111KB — Figma 에셋 1254px 를 줄였다) · `src/app/layout.css`(대기 화면 리본 끔)

## Decisions Made

- 라우트의 `hydrateFallbackElement` 로 붙였다 — 링크를 눌러 새로 열리는 첫 진입이 정확히 이 경우다. 앱 안 이동은 이전 화면이 남으므로 이 화면이 끼어들지 않는다
- `AppShell` 로 감쌌다 — hydrate 중에는 `RootLayout` 이 없어 배경이 안 그려진다
- 배경은 기존 'result' 배경 그대로다 — 디자인 그라데이션과 값이 같다(164.75deg, primary-400 → #eee3d2 → primary-300)
- 점은 자리(3ch)를 처음부터 잡아 두고 `clip-path` 로 드러낸다 — 폭이 바뀌면 가운데 정렬 문구가 밀린다(소유자 요청 2026-09-17). 점 세 개를 그려 두고 하나씩 켠다(없음 → `.` → `..` → `...`, 1.6s). 폭을 자르는 방식은 점 글자가 1ch 보다 좁아 경계가 어긋났다. 동작 줄이기면 '...' 고정
- 이 화면에서는 'result' 배경의 별자리 리본을 끈다(디자인에 없다) — 기존 `:has([data-pre-register-teaser])` 선례와 같은 방식
- 보관된 결과가 없는 첫 방문자에게는 이 화면을 보이지 않는다(소유자 요청 2026-09-17) — 곧바로 사주 입력이라 '이전 정보로 …' 가 맞지 않다. 그 경우 공통 로딩(SCR-12)만 보인다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build`
- 목 dev + playwright: `/preview/share-loading` 위치·폰트·배경 측정, 점 폭 변화 관찰

## Test Results

- 358 tests pass(신규 4), typecheck·lint 0, build 성공(에셋 111KB)
- 375×812 에서 문구 top 305·코끼리 top 377·130px — Figma(306·377·130)와 일치. 보이는 점 0 → 1 → 2 → 3 반복(글자 오른쪽 끝 343.5px 고정), 리본 content: none(결과·지도 화면은 그대로), 콘솔 에러 0

## Known Problems

- 코끼리 PNG 111KB — webp 변환 도구가 로컬에 없어 PNG 로 뒀다(`src/ui/assets/` 는 ui Owner 영역, 더 줄일 수 있으면 교체)


## Unverified Assumptions

- 실기기 카카오톡 인앱 브라우저에서 첫 진입에 이 화면이 보이는지는 08/T6 에서 확인

## Exact Next Action

소유자 승인 → push → PR.
