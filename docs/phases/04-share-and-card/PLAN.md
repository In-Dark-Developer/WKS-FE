# Phase 04 — share-and-card

- Status: PLANNED
- Lead: @gn00py48
- Depends on: 03
- Start: 2026-09-13 · End: 2026-09-17 (MVP 마감 — PRD Constraints)

## Goal

결과를 공유 링크('친구에게 공유')와 인연카드 이미지('인스타 스토리 공유하기', 카드 뒤집기)로 내보내 인스타·메신저에 퍼뜨릴 수 있고, Web Share 미지원 시 저장·복사 폴백이 있다.

## Motivation

사주 결과를 본 사람이 친구를 데려오는 유일한 통로가 이 Phase다. Phase 05(궁합)는 공유 링크로 들어온 방문자가 있어야 성립하므로, 여기서 링크와 카드가 실제로 밖으로 나가지 않으면 그 뒤가 전부 비어 있게 된다.
화면(인연카드)은 04/T2 가 이미 퍼블리싱했다. 남은 것은 **밖으로 내보내는 동작** — 링크를 만들어 공유하는 것(FR-4), 카드를 이미지로 만들어 공유하는 것(FR-5), 그리고 두 경로가 막혔을 때의 폴백(FR-16)이다.
공유 방식은 디자인·기획서에 없어 미정이었다(PRD Q11). 이 PLAN 이 **Web Share 우선 · 실패하면 복사/저장 폴백**으로 정하고, 다르게 가려면 이 PLAN 을 고친다.

## Scope

- `docs/PRD.md`의 FR-4(공유 링크) · FR-5(인연카드 이미지 공유) · FR-16(폴백)을 구현하는 화면과 상태
- SCR-04 사주 결과 화면 — 운명 카드의 '카드 뒤집기'와 카드 아래 '인스타 스토리 공유하기', 친구 궁합 순위 빈 상태의 '친구에게 공유' (2026-09-15 — 인연카드 화면 SCR-05 를 결과 화면에 합쳤다, T7)
- 공유 URL 생성 규칙과 카드 PNG 생성기

## Out of Scope

- **NFR-3(공유 링크 미리보기 OG 메타·썸네일)** — Phase 08 T4 가 `index.html`·`public/og/` 에서 맡는다. 이 Phase 는 링크를 만들어 내보내는 데까지만 책임진다
- 궁합 지도(SCR-08)의 '친구에게 공유' 배치 — Phase 05 가 화면을 만들 때 T3 의 버튼을 가져다 쓴다
- 공유 링크로 들어온 방문자가 보는 랜딩(SCR-06)과 궁합 산출 — Phase 05
- 인연카드 디자인 자체의 갱신(0–100 바 → 문자 등급) — 04/T2 에서 이미 등급으로 퍼블리싱했다

## Dependencies

- Phase 03 — T5(결과 화면 `share` 슬롯)·T7(`routes.tsx`·loader) 병합 완료
- 04/T2 `src/features/share/card/ConnectionCard.tsx` — 앞면·뒷면·뒤집기(props 전용) 병합 완료
- 디자인 — 공유 시트·Toast 는 디자인시스템 `ShareSheet`(85:1959)·`Toast`(80:651)를 쓴다. 결과 화면의 배치는 「UI 최종 - 개발용」 사주 결과 화면 Frame 93(713:4021) 기준(카드 → 인스타 스토리 공유 713:4070 → 행운 → 운세 → 친구 궁합 순위 713:4078), 카드 뒷면·뒤집기 버튼은 점지 카드(731:4667·558:2788)
- 백엔드 — `shareId` 는 `POST /results`·`GET /results/{resultId}` 응답에 이미 있다. **인연카드 등급은 별도 `cardGrades` 없이 `SharedResult.fortunes[]`(MARRIAGE·CHILDREN·LOVE, `Grade` SS~B)를 그대로 쓴다** — PRD Q3 중 Phase 04 를 막던 부분은 이것으로 닫힌다
- 미해결 — PRD Q3 의 나머지(후보·운명의 실 API)는 Phase 07 건이라 이 Phase 를 막지 않는다

## Tasks

- [x] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/04-share-and-card/` · Owner: @gn00py48 (commit c05acc4)

- [x] T2. 인연카드 퍼블리싱 — Done when: Figma 「UI 최종 - 개발용」 점지 카드(731:4667, 예전 558:2711) 앞면·뒷면과 '카드 뒤집기'(558:2788)와 십이간지 카드 12종이 props(닉네임·십이간지·운명 제목·연애·결혼·자녀 문자 등급 SS~B 6단계 — FR-5, 디자인의 0–100 바가 아니다)로만 렌더되고 `/preview` 에서 가짜 데이터로 확인된다 (테스트 포함). 앞면은 03/T5 의 `src/ui/DestinyCard.tsx`(캐릭터 `ZodiacCharacter`·스탬프 포함)를 인연카드 문구('님의 인연카드'·'당신의 인연 운명은..', Figma 731:4740)로 넓혀 쓴다 · Touches: `src/features/share/card/`, `src/ui/DestinyCard.tsx`, `src/ui/DestinyCard.css`, `src/features/share/index.ts`, `src/app/preview/screens/card.tsx` · Owner: @jjjung0921 (commit c6a9a57)

- [x] T3. 공유 링크 버튼 퍼블리싱 — Done when: `buildShareUrl(shareId)` 가 `location.origin` 으로 `/s/<shareId>` 를 만들고(절대 주소를 코드에 쓰지 않는다 — 공지 hosting-domains), '친구에게 공유' 버튼이 Web Share(`navigator.share` text·url) → 미지원·취소·거부 시 클립보드 복사 → 클립보드도 막히면 링크를 선택 가능한 텍스트로 노출하는 3단 폴백으로 동작하며, 복사 성공이 `Toast` 로 안내되고 `/preview/share` 에서 세 분기를 가짜 데이터로 볼 수 있다 (테스트 포함 — `navigator.share`·`clipboard` 가 없는 분기 각각). `shareId` 는 props 로만 받고 `src/api/` 를 import 하지 않는다 · Touches: `src/features/share/link/`, `src/features/share/index.ts`, `src/app/preview/screens/share.tsx` · Owner: @gn00py48 (commit 57ed534)

- [x] T4. 카드 이미지 생성 — Done when: `src/lib/cardImage.ts` 의 `renderCardImage(element)` 가 인연카드 앞면 DOM 을 PNG `Blob` 으로 만들고(인스타 스토리 1080×1920 캔버스에 카드를 가운데 배치), 웹폰트(Pretendard)·`ZodiacCharacter` SVG 가 빠지지 않으며, 생성 방식(외부 라이브러리 추가 vs canvas 직접 그리기)과 기각한 대안이 ADR 로 남는다 (테스트 포함). 의존성을 추가한다면 같은 PR 에 ADR 이 있어야 한다 (AGENTS.md Rule 13·14) · Touches: `src/lib/cardImage.ts`, `src/lib/cardImage.test.ts`, `docs/decisions/`, `package.json`, `pnpm-lock.yaml` · Owner: @gn00py48 (commit f0c9a39 — ADR-20260914-card-image-rendering)

- [x] T5. 인연카드 화면 — Done when: SCR-05 화면이 `ConnectionCard`(T2) 아래에 '카드 뒤집기'·'인스타 스토리 공유하기'·'친구에게 공유'(T3)를 배치하고, '인스타 스토리 공유하기'가 T4 의 PNG 를 `navigator.share({files})` 로 넘기며, `canShare({files})` 가 false 이거나 실패하면 같은 PNG 를 내려받게 하고 안내를 띄우고(FR-16), 만드는 동안 버튼이 잠기고 실패 시 재시도 안내가 뜨며 `/preview/card` 에서 상태를 볼 수 있다 (테스트 포함 — 파일 공유 지원·미지원 분기). 화면은 `src/api/` 를 import 하지 않는다 · Touches: `src/features/share/card/`, `src/features/share/index.ts`, `src/app/preview/screens/card.tsx` · After: T3, T4 · Owner: @gn00py48 (commit 4030b72, af6bb5d)

- [x] T6. 결과 화면·라우트 조립 — Done when: `/reading/:id/card` 가 `routes.tsx` 에 등록돼 결과 화면에서 인연카드로 들어가고 뒤로 돌아오며, 결과 화면의 비어 있던 `share` 슬롯에 '친구에게 공유'(T3)가 채워지고, loader 의 결과(`fortunes[]`·`nickname`·`zodiac`·`destiny`·`shareId`)가 뷰 모델로 변환돼 두 화면에 전달된다 (테스트 포함) · Touches: `src/app/routes.tsx`, `src/features/share/cardLoader.ts` · After: T5 · Owner: @nicerjs23 (commit 728c168 — `/reading/:id/card` 는 `reading/:id` 의 형제 라우트다: `ConnectionCardScreen` 이 전체 화면이라 결과 화면의 `<Outlet />` 에 넣으면 결과 아래에 덧붙는다. 그 `<Outlet />` 은 06/T3 사전신청 모달이 쓴다)

- [x] T7. 인연카드를 결과 화면에 합치기 — Done when: 결과 화면(SCR-04)이 Figma Frame 93(713:4021) 순서대로 운명 카드 → '인스타 스토리 공유하기' → 행운의 장소·아이템 → 운세 카드 → 친구 궁합 순위로 그려지고, 운명 카드(앞면 `DestinyCard` 운명 카드 문구, 뒷면 점지 카드 뒷면)가 '카드 뒤집기' 버튼으로 앞뒤를 전환하며, '인스타 스토리 공유하기'가 T5 와 같은 동작(앞면 PNG → `navigator.share({files})`, 미지원·실패 시 저장 + 안내, 만드는 동안 잠금, 실패 안내)을 하고, '친구에게 공유'는 친구 궁합 순위가 비어 있을 때 안내 아래에만 있으며, 운명 카드 문구 영역(`[data-destiny-card-destiny]` 의 운명 제목·설명, 합 120자 이내)이 말줄임 없이 전문을 보이고 등급 스탬프와 겹치지 않으며, '인연카드 보기' 버튼·`/reading/:id/card` 라우트·`cardLoader`·`ConnectionCardScreen` 이 없어진다(그 주소는 없는 경로 화면) (테스트 포함). 화면 컴포넌트는 `src/api/` 를 import 하지 않는다 · Touches: `src/app/routes.tsx`, `src/app/routes.test.tsx`, `src/features/saju/ReadingResult.tsx`, `src/features/saju/ReadingResult.test.tsx`, `src/features/share/`, `src/app/preview/screens/card.tsx`, `src/app/preview/screens/reading.tsx`, `src/ui/DestinyCard.css`, `src/ui/DestinyCard.tsx`, `src/ui/DestinyCard.test.tsx` · After: T6 · Owner: @jjjung0921 (commit 737b218, bf9795f — 긴 운명 제목은 글자 수로 글자 크기를 줄여 한 줄)

<!-- 퍼블리싱 먼저(2026-09-13 공지): T3·T5 는 props 만 받는 화면이고, 응답 → 뷰 모델 변환과 라우트 등록은 조립 Task 인 T6 이 한다.
     T6 의 Touches 에 `src/app/routes.tsx` 를 넣었다 — 그 파일은 03/T7 이 단독 소유했으나 Phase 03 Task 7개가 모두 병합되고 활성 스트림이 없어 소유가 이 Task 로 넘어온다. 06/T3 의 `/reading/:id/pre-register` 등록도 같은 파일이므로, 두 Task 가 동시에 열리면 먼저 연 쪽이 갖고 나중이 `git merge main` 으로 받는다. 리뷰는 `src/app/` Owner 인 @jjjung0921 이 한다.
     T6 Owner 를 @nicerjs23 으로 둔 근거는 공지 publishing-first 의 '연동·라우트는 조립 Task' 원칙과 03/T7 담당이다 — 본인 확인 전까지는 제안이며 PR 리뷰에서 확정한다.
     T7(2026-09-15): 소유자 결정으로 인연카드 전용 화면(T5·T6 의 `/reading/:id/card`)을 결과 화면에 합친다 — Figma 결과 화면에 '인연카드 보기'가 없고 인스타 스토리 공유가 카드 바로 아래에 있다. 카드 뒤집기는 자동 연출이 아니라 버튼이다. 결과 화면에 인연이 생긴 뒤의 공유 진입은 추후 네비게이션 바(궁합 지도)로 간다.
     T4 를 T5 에서 뗀 이유: 이미지 생성은 외부 의존성 판단(ADR)이 걸려 있어 화면 작업과 속도가 다르다. T3 은 T4·T5 와 파일이 겹치지 않으므로 병렬로 연다. -->

## Relevant Specifications

- `docs/PRD.md` — Screens(SCR-04·SCR-05), FR-4, FR-5, FR-16, Open Questions Q3·Q11
- `docs/api/openapi.yaml` — `Result.shareId`, `SharedResult.fortunes[]`, `Grade`
- `docs/ARCHITECTURE.md` — Data Flow, Module Boundaries(`features` → `lib`), Dependency Direction
- Figma 「UI 최종 - 개발용」 — 점지 카드(731:4667) · 십이간지 카드 12종, 디자인시스템 `ShareSheet`(85:1959) · `Toast`(80:651)
- 공지 — `2026-09-13-publishing-first`, `2026-09-13-hosting-domains`, `2026-09-13-server-state-session`, `2026-09-13-planning-feedback`

## Acceptance Criteria

- [ ] AC1. 결과 화면(친구 궁합 순위가 비어 있을 때)의 '친구에게 공유'가 현재 origin 기준 `/s/<shareId>` 를 공유 시트로 넘기고, Web Share 가 없는 브라우저에서는 클립보드 복사와 완료 안내로 대체된다 (FR-4)
- [ ] AC2. 결과 화면(`/reading/:id`)의 운명 카드가 '카드 뒤집기'로 앞면·뒷면을 전환하고, 등급은 `fortunes[]` 의 SS~B 문자 등급이다. 별도 인연카드 화면·'인연카드 보기' 버튼은 없다 (FR-5)
- [ ] AC3. '인스타 스토리 공유하기'가 카드를 PNG 로 만들어 Web Share(파일)로 넘긴다 (FR-5)
- [ ] AC4. 파일 공유를 지원하지 않는 브라우저에서 같은 PNG 를 저장할 수 있고 안내가 뜬다 (FR-16)
- [ ] AC5. `src/features/share/` 와 `src/ui/` 의 화면 컴포넌트가 `src/api/` 를 import 하지 않고, 모든 화면 상태를 `/preview` 에서 가짜 데이터로 볼 수 있다 (publishing-first)
- [ ] AC6. 절대 주소가 코드에 없다 — 공유 URL 은 `location.origin` 으로 만든다 (hosting-domains)
- [ ] AC7. 새 화면·로직에 테스트가 있고 Commands 4개가 경고 없이 통과한다

## Validation Plan

- AC1: 데스크톱 Chrome(Web Share 없음)에서 복사 폴백과 Toast 를 눈으로 확인하고, iOS Safari·Android Chrome 실기기에서 공유 시트가 열리는지 확인한다. 분기별 단위 테스트는 `navigator.share`·`navigator.clipboard` 를 각각 지운 상태로 돌린다
- AC2: `/preview/card` 의 앞면·뒷면·십이간지 12종 + `ConnectionCard` 컴포넌트 테스트
- AC3·AC4: `navigator.canShare` 가 `true`/`false` 를 주도록 바꾼 테스트 두 개, 그리고 데스크톱에서 실제로 파일이 내려받아지는지 확인
- AC5: `grep -rn "@/api" src/features/share src/ui` 가 0건, `/preview` 화면 목록에 share·card 가 있는지 확인
- AC6: `grep -rn "threatoffate" src` 가 0건
- AC7: `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`
