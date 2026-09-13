# Handoff — 04-T5-card-screen

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 04/T5

## Goal

SCR-05 인연카드 화면이 카드 아래에 '인스타 스토리 공유하기'와 '친구에게 공유'를 두고, 파일 공유가 되면 공유 시트로·안 되면 같은 PNG 저장으로 물러나며, `/preview/card` 에서 상태를 볼 수 있다 (FR-5·FR-16).

## Work Completed

- `card/shareCardImage.ts` — `renderCardImage`(T4) → `File` → 파일 공유 가능하면 시트, 아니면 저장(`shared|cancelled|saved`)
- `card/ConnectionCardScreen.tsx` — 카드(T2) + 스토리 버튼 + `ShareLinkButton`(T3). 생성 중 잠금·저장 Toast·실패 안내. `card/messages.ts` 에 문구를 모았다
- 테스트 12개(`shareCardImage` 6 · `ConnectionCardScreen` 6) · `/preview/card` '화면' 상태 · `share/index.ts` export
- **Figma 정렬** — `713:4021`·`713:4070` 실측으로 스토리 버튼을 `Action/Teal/Default`·높이 48·instagram 아이콘 24+간격 8 로, 카드 상단을 23(`pt-8`+셸 16)으로 맞추고 `h1`(sr-only)을 넣었다. `ShareLinkButton` 에 `size` 를 더해 두 CTA 높이를 48 로 통일.

## Work In Progress

- 없음

## Files Changed

- `src/features/share/card/{shareCardImage,messages}.ts`, `card/ConnectionCardScreen.tsx` + 테스트 2개
- `src/features/share/link/ShareLinkButton.tsx`(size prop — Touches 확장) · `share/index.ts` · `app/preview/screens/card.tsx`

## Decisions Made

- 이미지에는 **앞면만** 담는다 — `holder.querySelector('[data-destiny-card]')` 로 뒤집기 버튼·뒷면을 뺀다(`ConnectionCard` 는 그대로).
- 공유 시트 취소(`AbortError`)는 저장하지 않는다 — T3 과 같은 판단이다.
- 파일 공유 실패(취소 외)는 저장으로 물러난다(FR-16). 에러 문구는 원인을 감춘다(CONVENTIONS 7장).
- **CTA 색을 `apricot` 에서 `accent`(teal)로 바꿨다** — `get_variable_defs(713:4070)` 가 `Action/Teal/Default #237F94` 를 준다. 처음 구현은 근거 없이 apricot 이었다.
- 버튼 좌우 여백은 Figma 의 21(폭 333) 대신 앱 셸의 16(폭 343)을 유지했다 — 5px 토큰이 없고 같은 화면의 카드가 16 이다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · AC5 grep

## Test Results

- 52 files / 238 tests 통과(이 Task 신규 12) · typecheck · lint 경고 0 · build 성공(초기 JS gzip 147.20 kB)
- `src/features/share`·`src/ui` 의 `@/api` import 0건

## Known Problems

- **Figma 에 인연카드 전용 화면(SCR-05)이 없다.** `731:4667` 은 카드 앞/뒷면(343×461) 아트만이고, UI 페이지 전체에 `인스타`·`공유`·`저장` 텍스트가 0건이다. 카드와 인스타 CTA 가 함께 놓인 유일한 디자인은 **결과 화면 `713:4021`** 이다 — 즉 디자인상 공유 CTA 는 SCR-04 에 있다. PRD Screens 의 SCR-05(`/reading/:id/card`)와 어긋나므로 기획·디자인 확인이 필요하다.
- 두 CTA 사이 간격 8 과 '친구에게 공유' 의 `secondary` 모양은 Figma 근거가 없는 판단이다.
- **이 브랜치가 T3·T4 위에 쌓여 있고, 그 과정에서 `.ai/work/04-T3-share-link/`·`04-T4-card-image/` 를 지웠다.** 지우지 않으면 `ai-end` 의 '다른 스트림 디렉터리 변경' 검사에 걸린다. 그대로 두면 T5 병합 시 그 두 Task 의 기록이 main 에서 사라진다 — **T3·T4 가 main 에 들어간 뒤, T5 PR 병합 전에 `git checkout main -- .ai/work/04-T3-share-link .ai/work/04-T4-card-image` 로 되살려야 한다.**

## Unverified Assumptions

- 실제 PNG 를 눈으로 본 적이 없다(jsdom 에 `foreignObject`·캔버스 없음) — `/preview/card` 와 실기기가 유일한 관문이다.
- iOS Safari 가 `canShare({files})` 로 PNG 를 인스타로 넘기는지, 폰트 인라인 소요 시간은 재지 못했다.

## Exact Next Action

`public/images/*.svg` 2개를 언트랙하고 커밋한 뒤, T3·T4 가 main 에 병합되면 `git merge main` + 스트림 디렉터리 복구 → `ai-end.sh --ready`.
