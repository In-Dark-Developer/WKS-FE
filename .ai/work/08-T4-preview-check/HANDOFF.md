# Handoff — 08-T4-preview-check

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음 (진입 동작 QA 는 별도 담당자에게 이관 — 2026-09-15 소유자 결정)
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

1. **[스펙대로지만 사용자에게 버그로 읽힌다] 내 결과가 있는 기기에서 공유 링크를 열면 입력 없이 다른 화면으로 끌려간다.** `shareInputLoader` 는 세션이 있으면 폼을 건너뛰고 `joinShare` → `/s/:shareId/map`(자기 링크면 `/reading/:내resultId`)로 `replace` 한다 — PRD **FR-6** 이 명시한 동작이다. 2026-09-15 제3자 검증에서 그대로 재현됐다: "내 기록이 자동으로 뜨네 / 입력 안 했는데 / 이름이 내가 아닌데 사주가 내꺼네". **축제에서 링크를 받는 사람마다 이 반응이 나올 수 있어 기획 확인이 필요하다**(건너뛰기를 없애거나 건너뛰기 전에 안내). 바꾸려면 FR-6 을 `spec` 스트림으로 먼저 고친다(Rule 7).
   - "이름이 내가 아닌데 사주가 내꺼" 의 정체는 **아직 특정되지 않았다.** 프론트에는 한 사람의 닉네임과 다른 사람의 사주를 섞는 경로가 없다 — `/reading/:id` 의 값은 모두 `GET /results/{id}` 응답 하나에서 오고(`toReadingView`), 캐시·병합·세션 유래 값이 없으며 지도 화면(SCR-13)은 사주를 렌더하지 않는다(FR-15). 후보는 (a) SCR-13 의 주인 닉네임을 자기 결과로 오인 (b) 예전에 넣은 닉네임이 본인 이름이 아님 (c) **백엔드가 섞인 응답을 준다**. **필요한 증거: 그 화면의 주소(`/reading/...` vs `/s/.../map`)와 스크린샷.** 이 건의 QA 는 2026-09-15 소유자 결정으로 **별도 담당자에게 이관**했다 — 08/T4 의 범위가 아니다.
2. **[스펙대로 — 고칠 것 없음] 사생활 보호 탭에서 인트로 뒤 '사주 입력 화면' 이 뜨는 것은 SCR-06 이다.** `IntroGate` 는 이동하지 않고 children 을 바꿀 뿐이라 주소는 `/s/:shareId` 그대로다. 홈(`/`)과 구분되는 표시: 설명이 "아래 정보를 입력하고 나와 OO 님의 귀인 궁합을…", 버튼이 **'운명 지도 확인하기'**(홈은 "생년월일로 점지받는 나의 인연" · '점지 확인하기'). 재검증 때 이 두 가지로 확인한다.
3. **[재현 실패 — 결함 아님] 카드 레이아웃은 Figma 와 정확히 일치한다.** 스크린샷만 보고 "뒷면이 왼쪽으로 넘친다·앞면 높이가 비율을 넘는다"고 적었던 1차 판단은 **틀렸다.** `/preview/reading` 을 띄워 `getBoundingClientRect` 로 실측한 결과 — 카드 좌 13 / 우 13, 인스타 버튼 좌 21 / 우 21(= 13 + 8), 뒷면 이미지 오버행 좌 8.4 / 우 8.4 로 **모두 대칭**이고, 앞면 높이 533.6 이 `aspect-ratio: 349/461` 값 533.7 과 일치하며 뒤집기 전후 높이가 같다. '긴 제목' 상태에서도 카드 높이가 그대로고 문구 칸 아래로 280px 이 남으며 가로 스크롤이 없다. 축소된 스크린샷에서 `card-back.webp` 의 부드러운 가장자리가 배경과 섞여 왼쪽이 화면 끝에 붙은 것처럼 보였을 뿐이다. **chore 스트림을 열지 않았다 — 고칠 것이 없다.**

## Unverified Assumptions

- 미리보기 **카드**(링크 텍스트가 아니라)를 탭할 때 `og:url` 로 가는지 — 앱마다 다르고 아직 확인되지 않았다.
- 소유자가 본 '깨짐' 과 제3자가 본 '이름·사주 불일치' 둘 다 주소·스크린샷이 없어 특정되지 않았다. 결과 화면이 **뒷면부터** 시작하는 것(04/T7)도 오인 후보다.

## Exact Next Action

이 Task 에 남은 것은 **앱별 미리보기 확인 하나**다 — 인스타 DM·iMessage·라인에 `https://threadoffate.site/s/:shareId` 를 붙여 제목·설명·썸네일 스크린샷을 찍고(카카오톡은 확인됨), 카카오 미리보기 **카드 탭**이 `shareId` 를 지키는지 함께 본 뒤 RESULT 의 T4 표를 채우고 PLAN T4 를 `[x]` 로 바꾼다. 카드 탭이 `/` 로 가면 `index.html` 의 `og:url` 을 지우고 카카오 캐시를 초기화한다(@jjjung0921).
