# Handoff — 10-T10-card-flip-animation

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @gn00py48 (강근우 · `src/ui/` Owner — ProfileCard 구조 변경) · @jjjung0921 (이정진 · Phase 10 Lead)
- Date: 2026-09-28
- Phase / Task: 10/T10

## Goal

'카드 뒤집기'가 홈 운명 카드와 같은 Y축 회전으로 앞뒤를 바꾸고, 동작 줄이기 설정에서는 애니메이션 없이 바뀐다.

## Work Completed

- 전에는 앞뒷면을 `hidden` 으로 **숨겼다 보이기만** 해서 뒤집는 모습이 없었다
- 홈 운명 카드(`ConnectionCard.css`)와 같은 방식으로 바꿨다 — 원근 **1200px**, Y축 **180도**, `backface-hidden` 으로 뒤통수 감추기, 전환 0.5s ease-out
- 두 면을 같은 자리에 겹쳐 두고 뒷면만 미리 180도 돌려 둔다. **닫힌 면은 `aria-hidden`·`inert`** 로 낭독기·탭 이동에서 뺀다(ConnectionCard 와 같다)
- **`motion-reduce:transition-none`** — 동작 줄이기 설정에서는 전환 없이 면만 바뀐다(NFR-5)
- 테두리·모서리·배경을 바깥 칸에서 **각 면으로 옮겼다** — 카드가 틀 안에서가 아니라 카드째로 뒤집힌다. 바깥 칸은 비율(343:433)과 원근만 갖는다
- 뒤집기 칩은 회전하는 칸 **밖**에 둔다(같이 돌면 글자가 뒤집힌다)

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/ui/ProfileCard.tsx` · `src/ui/ProfileCard.test.tsx`

## Decisions Made

- CSS 파일을 새로 만들지 않고 Tailwind v4 의 3D 유틸리티(`transform-3d`·`rotate-y-180`·`backface-hidden`·`perspective-[1200px]`)로 했다 — T10 Touches 가 `ProfileCard.tsx` 하나이고, 홈 카드처럼 별 CSS 를 둘 만큼 복잡하지 않다
- 전환 시간은 0.5s 다(홈 카드는 0.6s) — 소개팅 카드는 좌우로 넘기며 여러 장을 보는 화면이라 조금 짧게 뒀다. 맞추라면 한 줄이다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 116 files / 669 passed · typecheck·lint 경고 0

## Known Problems

- **눈으로 본 확인이 필요하다** — jsdom 은 3D 변환을 계산하지 않아 테스트는 클래스와 `aria-hidden` 만 본다. 실제로 도는 모습·뒤통수가 비치지 않는지는 브라우저에서 봐야 한다
- 기존 테스트가 `hidden` 에 기대 '보인다/안 보인다' 를 단언했는데, 이제 두 면이 다 DOM 에 있어 `aria-hidden` 기준으로 바꿨다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올린다. QA 8건이 모두 끝난다.
