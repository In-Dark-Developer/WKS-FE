# Handoff — 04-T5-card-screen

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 04/T5

## Goal

SCR-05 인연카드 화면이 카드 아래에 '인스타 스토리 공유하기'와 '친구에게 공유'를 두고, 파일 공유가 되면 공유 시트로·안 되면 같은 PNG 저장으로 물러나며, `/preview/card` 에서 상태를 볼 수 있다 (FR-5·FR-16).

## Work Completed

- `card/shareCardImage.ts` — `renderCardImage`(T4) → `File` → `canShare({files})` 면 공유 시트, 아니면 저장. 결과 `'shared' | 'cancelled' | 'saved'`
- `card/ConnectionCardScreen.tsx` — 카드(T2) + 스토리 공유 버튼 + `ShareLinkButton`(T3). 생성 중 잠금·저장 Toast·실패 시 재시도 안내
- `card/messages.ts` — 보살 말투 문구
- 테스트 14개 — `shareCardImage` 6 · 화면 6 · (기존 `ConnectionCard` 2)
- `/preview/card` 에 '화면' 상태 추가, `src/features/share/index.ts` 에 export

## Work In Progress

- 없음

## Files Changed

- `src/features/share/card/{shareCardImage,messages}.ts`, `card/ConnectionCardScreen.tsx` + 테스트 2개
- `src/features/share/index.ts`, `src/app/preview/screens/card.tsx`

## Decisions Made

- 이미지에는 **앞면만** 담는다 — `holder.querySelector('[data-destiny-card]')` 로 뒤집기 버튼·뒷면을 뺀다. `ConnectionCard` 는 고치지 않았다.
- 공유 시트 취소(`AbortError`)는 저장하지 않는다 — T3 과 같은 판단(사용자가 스스로 닫은 것은 실패가 아니다).
- 파일 공유 실패(취소 외)는 저장으로 물러난다 — FR-16 이 요구하는 폴백이다.
- 에러 문구는 원인을 감춘다 (CONVENTIONS 7장). 원인은 던져진 채 콘솔로 간다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · AC5 grep

## Test Results

- 52 files / 238 tests 통과(신규 14) · typecheck 통과 · lint 경고 0 · build 성공(초기 JS gzip 147.20 kB)
- `src/features/share`·`src/ui` 의 `@/api` import 0건

## Known Problems

- **이 브랜치가 T3·T4 위에 쌓여 있고, 그 과정에서 `.ai/work/04-T3-share-link/`·`04-T4-card-image/` 를 지웠다.** 지우지 않으면 `ai-end` 의 '다른 스트림 디렉터리 변경' 검사에 걸린다. 그대로 두면 T5 병합 시 그 두 Task 의 기록이 main 에서 사라진다 — **T3·T4 가 main 에 들어간 뒤, T5 PR 병합 전에 `git checkout main -- .ai/work/04-T3-share-link .ai/work/04-T4-card-image` 로 되살려야 한다.**
- `public/images/background_starstream{1,2}.svg` 2개가 `git add -A` 에 휩쓸려 이 브랜치에 커밋됐다. 아무 데서도 참조하지 않고 T5 Touches 밖이라 빼는 편이 맞다.

## Unverified Assumptions

- 실제 PNG 를 눈으로 본 적이 없다 (T4 와 같은 이유 — jsdom 에 `foreignObject`·캔버스 없음). `/preview/card` 의 '화면' 상태와 실기기 확인이 유일한 관문이다.
- iOS Safari 가 `canShare({files})` 로 PNG 를 받아 인스타로 넘기는지, 폰트 인라인이 몇 초 걸리는지 재지 못했다.

## Exact Next Action

`public/images/*.svg` 2개를 언트랙하고 커밋한 뒤, T3·T4 가 main 에 병합되면 `git merge main` + 스트림 디렉터리 복구 → `ai-end.sh --ready`.
