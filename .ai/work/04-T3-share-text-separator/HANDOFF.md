# Handoff — 04-T3-share-text-separator

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 04/T3

## Goal

공유 시트로 보낸 문구에서 링크가 문구와 붙지 않아, 받은 사람이 `/s/:shareId` 를 그대로 연다.


## Work Completed

- `navigator.share({ title, text: "문구\n링크" })` — url 필드를 따로 넘기지 않는다 (commit 3a43aca)
- 테스트: 줄바꿈 뒤 링크·url 필드 없음, 버튼 테스트 기대값 갱신


## Work In Progress

- 없음


## Files Changed

- `src/features/share/link/shareLink.ts` · `shareLink.test.ts` · `ShareLinkButton.test.tsx`


## Decisions Made

- url 을 text 에 넣고 url 필드는 뺐다 — 운영에서 카카오톡이 url+text 를 공백 없이 붙여 `…28ea멋쟁이토깽이님의` 가 링크가 됐다(소유자 제보 2026-09-14). 클립보드 복사는 여전히 링크만 복사


## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`


## Test Results

- 259 tests 통과, typecheck·lint(경고 0) 통과. 실기기(카카오톡) 미확인


## Known Problems

- `/s/:shareId` 랜딩(SCR-06)이 아직 없어 링크를 열면 404 화면 — Phase 05 몫
- url 필드를 뺀 뒤 링크를 url 로만 받는 공유 대상(북마크 등)에서 동작은 실기기 미확인


## Unverified Assumptions

- 카카오톡·인스타 DM 이 text 안 줄바꿈 뒤 링크를 링크로 인식한다


## Exact Next Action

배포 후 iOS·Android 카카오톡으로 공유해 링크가 `/s/:shareId` 에서 끝나는지 확인.
