# Current State — chore-dating-entry-back-flow

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-dating-entry-back-flow
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-dating-entry-back-flow
- Task: -/-
- Issue: none
- Touches: src/features/dating/,src/app/routes/dating.routes.tsx,src/app/preview/screens/dating-profile.tsx
- Supersedes: none
- Acked: none

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: dating-entry-back-flow

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 프로필 단계를 주소(`?step=`)로 올리고 뒤로가기 연결 (d96842f)
- [x] 카카오 로그인 복귀를 `/dating/profile` 로
- [x] test·typecheck·lint·목 모드 브라우저 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`d96842f`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/entry/DatingProfileScreen.tsx:handleBack`
- `src/features/dating/profile/DatingProfileForm.tsx`
- `src/app/routes/dating.routes.tsx:DatingIntroRoute`

## Next Action

PR 리뷰 · CI 확인 후 병합
