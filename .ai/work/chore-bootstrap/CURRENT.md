# Current State — chore-bootstrap

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-bootstrap
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-bootstrap
- Task: 01/T1
- Touches: .
- Supersedes: none
- Acked: 2026-09-11-bootstrap

## Current Phase

01-project-setup — `docs/phases/01-project-setup/PLAN.md`

## Current Task

chore: bootstrap — 01/T1 spec·계획 초기화

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 기획 메모·소유자 확인으로 범위 확정 (채팅·결제 MVP 제외, FE 전용 저장소, Vite SPA)
- [x] spec 작성 (PRD · ARCHITECTURE · openapi 참조본)
- [x] 스택 ADR + 공지
- [x] Phase 01~08 PLAN·Phase 그래프
- [x] BOOTSTRAP·README 정리, 병합 방식 설정(main 보호 대신 CI 의 PR author = Owner 검사), `docs/CONVENTIONS.md` 작성

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`bcd75d8`

## Relevant Documents

- `docs/phases/01-project-setup/PLAN.md` · `docs/product-brief.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

팀 회의에서 PRD·ADR·Phase 계획 확정 → PR 병합 → T2(Owner·CODEOWNERS) → T3.
