# Current State — chore-map-back-to-reading

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-map-back-to-reading
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-map-back-to-reading
- Task: -/-
- Issue: none
- Touches: src/app/routes.tsx,src/app/routes.test.tsx,src/features/saju/ReadingResult.tsx,src/features/saju/ReadingResult.test.tsx,src/features/friends/map/CompatibilityMapScreen.tsx,src/features/friends/map/CompatibilityMapScreen.test.tsx,src/app/preview/screens/map.tsx,src/app/preview/screens/reading.tsx,docs/PRD.md
- Supersedes: none
- Acked: none

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: map-back-to-reading

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 지도 뒤로가기 제거 · 내 사주 뒤로가기(지도에서 온 경우만) + 테스트 · preview (commit 5d9bd35)
- 2. PRD SCR-04·SCR-13·FR-6 (commit 453740a) → PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`453740a`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/routes.tsx:ReadingResultRoute`
- `src/app/routes.tsx:SharedMapRoute`
- `src/features/saju/ReadingResult.tsx:ReadingResult`

## Next Action

PR 리뷰 → 병합
