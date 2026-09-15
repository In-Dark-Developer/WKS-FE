# Handoff — 08-T4-preview-check

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 08/T4

## Goal

`https://threadoffate.site/s/:shareId` 를 카카오·인스타·메신저에 붙였을 때 제목·설명·썸네일이 보이는 것을 실기기로 확인해 RESULT 에 남긴다 (SC-6, AC3).

## Work Completed

- 서버측 사전 점검 — `/s/:shareId`·`/reading/:id` 가 OG·Twitter 메타 13개를 주고, og 이미지 200·`image/jpeg`·224KB·1200×630, `www`→apex 301
- 1차 실기기 검증(iPhone 13 · iOS 26.3.1 · Safari · 카카오톡에서 진입)을 RESULT 에 기록 — 미리보기 판정 전에 화면 확인으로 빠졌다
- 보고된 3건을 코드·Figma·**브라우저 실측**으로 판정 — 3건 모두 결함이 아니었다(2건 스펙대로, 1건 재현 실패)

## Work In Progress

- 없음

## Files Changed

- `docs/phases/08-launch-readiness/RESULT.md`

## Decisions Made

- **`index.html` 의 `og:url` 을 고치지 않았다.** 카드 탭이 `shareId` 를 잃는지 아직 확인되지 않았고, 지우면 이미 동작하는 카카오 미리보기가 깨질 수 있으며 카카오 캐시 초기화(@jjjung0921 계정)가 다시 필요하다.
- **iOS 버전 가설을 폐기했다** — 기기가 iOS 26.3.1 이라 `container-type`·`cqw`·`color-mix`·Tailwind v4(Safari 16.4+) 모두 지원된다. 스크린샷에서도 카드 내부·등급 스탬프·인스타 버튼이 정상으로 렌더된다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · `curl` 운영 메타 · Figma `658:5075` 실측 · `/preview/reading` 브라우저 실측

## Test Results

- 통과 — 61 files / 322 tests · typecheck · lint 0 · build 성공
- Figma 실측 = 코드와 일치: 콘텐츠 349(좌우 13) · 카드 349×461 · 카드→CTA 20 · CTA 333×48(좌우 8) · CTA→행운 16 · 운세 349×262(간격 24) · 순위 333

## Known Problems

1. **[스펙대로 — 고칠 것 없음] 내 결과가 있는 기기에서 내 링크를 열면 내 결과로 간다.** `shareInputLoader` → `joinShare` → 백엔드 `SELF_COMPATIBILITY` → `/reading/:내resultId`. PRD **FR-6** 이 명시한다("자기 링크면 궁합 없이 자기 결과(SCR-04)로 간다"). 공유 흐름은 **다른 기기·다른 사람 링크**로만 검증된다.
2. **[스펙대로 — 고칠 것 없음] 사생활 보호 탭에서 인트로 뒤 '사주 입력 화면' 이 뜨는 것은 SCR-06 이다.** `IntroGate` 는 이동하지 않고 children 을 바꿀 뿐이라 주소는 `/s/:shareId` 그대로다. 홈(`/`)과 구분되는 표시: 설명이 "아래 정보를 입력하고 나와 OO 님의 귀인 궁합을…", 버튼이 **'운명 지도 확인하기'**(홈은 "생년월일로 점지받는 나의 인연" · '점지 확인하기'). 재검증 때 이 두 가지로 확인한다.
3. **[재현 실패 — 결함 아님] 카드 레이아웃은 Figma 와 정확히 일치한다.** 스크린샷만 보고 "뒷면이 왼쪽으로 넘친다·앞면 높이가 비율을 넘는다"고 적었던 1차 판단은 **틀렸다.** `/preview/reading` 을 띄워 `getBoundingClientRect` 로 실측한 결과 — 카드 좌 13 / 우 13, 인스타 버튼 좌 21 / 우 21(= 13 + 8), 뒷면 이미지 오버행 좌 8.4 / 우 8.4 로 **모두 대칭**이고, 앞면 높이 533.6 이 `aspect-ratio: 349/461` 값 533.7 과 일치하며 뒤집기 전후 높이가 같다. '긴 제목' 상태에서도 카드 높이가 그대로고 문구 칸 아래로 280px 이 남으며 가로 스크롤이 없다. 축소된 스크린샷에서 `card-back.webp` 의 부드러운 가장자리가 배경과 섞여 왼쪽이 화면 끝에 붙은 것처럼 보였을 뿐이다. **chore 스트림을 열지 않았다 — 고칠 것이 없다.**

## Unverified Assumptions

- 미리보기 **카드**(링크 텍스트가 아니라)를 탭할 때 `og:url` 로 가는지 — 앱마다 다르고 아직 확인되지 않았다.
- 소유자가 본 '깨짐' 이 무엇이었는지 아직 특정되지 않았다. 결과 화면이 **뒷면부터** 시작하는 것(`ResultCard initialFace="back"`, 04/T7 결정)이 기대와 달라 보였을 가능성이 있다.

## Exact Next Action

08/T4 2차 검증 — **다른 기기**에서 남의 `/s/:shareId` 를 열어 SCR-06 문구·버튼으로 확인하고, 카카오 미리보기 **카드 탭**이 `shareId` 를 지키는지 본 뒤 인스타 DM·기타 메신저 스크린샷으로 RESULT AC3 을 채운다.
