# Handoff — chore-dating-close

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-10-01
- Phase / Task: -/-

## Goal

운영에서 2026-10-02 02:00 KST 부터 프로필이 없는 사용자는 인트로와 프로필 (2/2) 에서 마감 안내를 보고 '내 운명 찾아 떠나기'를 누를 수 없다.

## Work Completed

- 운영 전용 `VITE_DATING_CLOSE_AT`(netlify.toml) · `readDatingCloseAt` · `useIsClosed`(화면을 연 채 시각이 지나도 바뀜)
- 프로필 (2/2) 제출 버튼 비활성·제출 차단·마감 안내(소유자 patch 2개를 그대로 적용)
- 로그인 인트로 시작 버튼 비활성·마감 안내. 미리보기 상태 2개(인트로·(2/2) 등록 마감)

## Work In Progress

- 없음

## Files Changed

- `netlify.toml` · `src/vite-env.d.ts` · `src/features/dating/registrationClose{,.test}.ts`(profile/ 에서 이동)
- `intro/DatingIntro{,.test}.tsx` · `entry/DatingIntroScreen.tsx` · `profile/{DetailsStep,DatingProfileForm,DatingProfileForm.test}.tsx` · preview 2개

## Decisions Made

- 로그인 인트로만 막는다 — `datingIntroLoader` 가 프로필 있는 사용자를 Top 3 로 보내므로 로그인 인트로를 보는 사람은 미등록자다.
- 비로그인 인트로는 그대로 둔다 — 이미 등록한 사용자도 로그인해야 Top 3 로 간다. 미등록자는 로그인 뒤 안내를 본다.
- 마감 판정은 기기 시각이다. 서버는 마감하지 않는다(백엔드 범위).

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 미리보기 모바일 폭 스크린샷(`/preview/dating-intro`·`dating-profile` 등록 마감)

## Test Results

- 125 files / 767 tests 통과, typecheck·lint 경고 없음

## Known Problems

- 백엔드는 마감 뒤에도 프로필 등록 요청을 받는다 — 열어 둔 화면·API 직접 호출은 통과한다.
- `GET /me` 가 실패하면 로그인 인트로가 보여 등록한 사용자도 마감 버튼을 본다 — 새로고침하면 Top 3 로 간다.

## Unverified Assumptions

- 마감 뒤에도 등록한 사용자는 Top 3·요청을 계속 쓴다(소유자 지시는 '접수 마감'만).

## Exact Next Action

dev → main 릴리스 PR 을 02:00 KST 전에 병합하고 운영 빌드에 VITE_DATING_CLOSE_AT 이 들어갔는지 확인한다.
