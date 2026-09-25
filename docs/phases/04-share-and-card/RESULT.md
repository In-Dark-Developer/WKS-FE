# Phase 04 — share-and-card · Result

- Completed on: 2026-09-26
- Final Status: DONE
- Tag: `phase/04`

## Completed

- T1. 상세 계획 (commit c05acc4)
- T2. 인연카드 퍼블리싱 — 앞면·뒷면·카드 뒤집기, 십이간지 12종, 문자 등급 SS~B (commit c6a9a57)
- T3. 공유 링크 버튼 — `buildShareUrl`(`location.origin`) + Web Share → 클립보드 → 링크 직접 노출 3단 폴백 (commit 57ed534)
- T4. 카드 이미지 생성 — `src/lib/cardImage.ts`, `html-to-image` 동적 import, ADR-20260914-card-image-rendering (commit f0c9a39)
- T5. 인연카드 화면 — 파일 공유·미지원 시 저장·잠금·재시도 안내 (commit 4030b72, af6bb5d)
- T6. 결과 화면·라우트 조립 (commit 728c168)
- T7. 인연카드를 결과 화면에 합치기 — `/reading/:id/card`·`ConnectionCardScreen` 제거 (commit 737b218, bf9795f)
- T8. 결과 화면을 Figma 658:5075 에 맞추기 (commit 2f07677)

## Not Completed

- 없음

## Deviations from Plan

- **인연카드 화면(SCR-05)이 없어졌다** — 2026-09-15 소유자 결정으로 T7 이 결과 화면(SCR-04)에 합쳤다. T5·T6 이 만든 별도 화면·라우트는 T7 에서 지웠다.
- **'인스타 스토리 공유하기' → '카드 저장하기'** — 2026-09-17 Figma 796:3862 개정(FR-5). 동작(앞면 PNG → Web Share 파일, 미지원·실패 시 저장 + 안내)은 그대로다. AC3 의 버튼 이름은 이 이름으로 읽는다.
- **'친구에게 공유' 위치** — PLAN 은 순위가 비었을 때만이었으나 2026-09-17 Figma(796:3885)로 순위가 있을 때도 목록 아래에 둔다(FR-4).
- 결과 화면이 V1(Phase 09)에서 홈이 되고 잘 맞는 오행 등이 더해졌다 — 이 Phase 의 공유·카드 동작은 바뀌지 않았다.

## Important Decisions

- 카드 이미지는 클라이언트에서 `html-to-image` 로 만든다 — ADR-20260914-card-image-rendering
- 인연카드 등급은 별도 `cardGrades` 없이 결과의 `fortunes[]` 문자 등급을 쓴다 (PRD Q3 의 Phase 04 부분 종료)

## Validation Results

2026-09-26, dev `d7fb52e` 기준.

| Check | Command / Method | Result |
|-------|------------------|--------|
| Tests | `pnpm test` | ✅ 100 files / 528 tests |
| Typecheck | `pnpm typecheck` | ✅ 오류 0 |
| Lint | `pnpm lint` | ✅ eslint `--max-warnings=0` + prettier |
| AC1 | `shareUrl.test.ts`(origin 기준 `/s/<shareId>`) · `shareLink.test.ts`(시트 → 복사 → 직접 노출) · `ShareLinkButton.test.tsx`(복사 알림) · `routes/index.test.tsx`(순위 비었을 때·있을 때 공유 버튼) | ✅ 단위·라우트 테스트 |
| AC2 | `ResultCard.test.tsx`('뒷면부터 보이고 카드 뒤집기로 운명 카드 앞면을 연다') · `routes/index.test.tsx`(인연카드 입구 없음) | ✅ |
| AC3 | `shareCardImage.test.ts`('파일 공유를 지원하면 공유 시트로 PNG 를 넘긴다') · `cardImage.test.ts` 11개 | ✅ |
| AC4 | `shareCardImage.test.ts`('지원하지 않으면 같은 PNG 를 내려받는다'·'canShare 거절 시 저장') · `ResultCard.test.tsx`('저장으로 물러나면 담았다고 알린다') | ✅ |
| AC5 | `grep -rln "@/api" src/features/share src/ui` → 0건 · `src/app/preview/screens/` 에 `share.tsx`·`card.tsx`·`reading.tsx` | ✅ |
| AC6 | `grep -rnE "https?://(www\.)?threadoffate" src` → 0건 (`VITE_API_BASE_URL` 로컬 기본값만) | ✅ |
| AC7 | 위 Tests·Typecheck·Lint | ✅ |

- 실기기(iOS Safari·Android Chrome) 공유 시트·파일 저장은 이 종료 스트림에서 다시 확인하지 않았다 — 08/T4(2026-09-17) 실기기 점검과 운영 사용 중 이상 보고 없음에 기댄다. 08/T6 출시 점검(SC-1~6)이 다시 본다.

## Known Issues

- 공유 방식(OS 공유 시트·링크 복사·완료 안내)의 디자인이 없다(FR-4 '미정') — 지금은 디자인시스템 `ShareSheet`·`Toast` 로 채웠다.

## Follow-up Work

- 없음 — 공유 링크 진입 분기는 09/T5(병합), 초대 티저는 FR-15 V1(담당 Task 미정)
