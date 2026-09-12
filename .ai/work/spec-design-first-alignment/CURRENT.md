# Current State — spec-design-first-alignment

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-design-first-alignment
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-design-first-alignment
- Task: -/-
- Touches: docs/PRD.md,docs/ARCHITECTURE.md,docs/api/openapi.yaml,docs/phases/,README.md,AGENTS.md,.ai/team/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-notion-board-sync, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: design-first-alignment

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] PRD: 디자인 우선 원칙 · Screens 절 · FR-2/3/4/5/7/8/9/10/17/18 개정 · FR-1/11 MVP 제외 · 마감 2026-09-17 · Open Questions Q6~Q10
- [x] openapi 참조본: ReadingRequest(양·음력·12시진·8자) · Reading(운명 카드) · 등급 구간 · /readings/{id} · /me · /me/profile · /matching/candidates · /me/threads(GET) · pull
- [x] ARCHITECTURE: Data Flow 1~3 · Persistence · External Systems · Figma 기준 갱신, intro 제거
- [x] PLAN 01: T1 완료 표기 · T6 선행 조건 · AC1/3/4/5/6/8 체크 (AC2·AC7은 Lead가 실행)
- [x] PLAN 02~08: End 2026-09-17 · 02 T1 Touches(@theme) · 컴포넌트 배분 · 03 인트로 제거 · FR-15/16/17 배정 · 디자인 미비 Dependencies
- [x] README·AGENTS stale 제거 · Figma 링크 · 공지 design-first-prd · phases README 재생성

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`9a4f5f7`

## Relevant Documents

- `docs/PRD.md` · `docs/api/openapi.yaml` · `docs/phases/*/PLAN.md` · `.ai/team/announcements/2026-09-12-design-first-prd.md`

## Relevant Source Files

- (아직 없음)

## Next Action

push 후 PR. 병합되면 Notion 결정 안건(등급 구간·결과 영역·음력·시진·닉네임·사전신청 항목·인스타 공유·인트로)을 `이관 완료`로, PRD 색인에 FR-15~18 추가.
