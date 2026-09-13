# Current State — 02-T1-tokens

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 02-T1-tokens
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/02-T1-tokens
- Task: 02/T1
- Issue: #22
- Touches: src/ui/tokens/, src/index.css, src/main.tsx, src/lib/cn.ts, src/lib/cn.test.ts, package.json, pnpm-lock.yaml, .prettierrc, eslint.config.js, .ai/team/announcements/2026-09-13-design-tokens.md, .ai/team/README.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap,2026-09-12-board-rows-for-streams,2026-09-12-commit-type-ci,2026-09-12-design-first-prd,2026-09-12-notion-board-sync,2026-09-12-pr-body-autofill,2026-09-13-backend-contract,2026-09-13-drop-birth-region,2026-09-13-issue-link,2026-09-13-notion-index-sync,2026-09-13-planning-feedback,2026-09-13-task-after,2026-09-13-design-tokens

## Current Phase

02-design-system — `docs/phases/02-design-system/PLAN.md`

## Current Task

T1. Figma 토큰 → `@theme` · 폰트 · `cn()`

## Status

REVIEW

## Progress

1. 의존성·`theme.css`·`index.css`·`cn()`·린트·prettier 플러그인 ✓
2. Display 폰트 woff2(CFF 이름 수정)·ADR·공지 ✓
3. test·typecheck·lint·build·브라우저 폰트 로드 확인 ✓

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`32a858d`

## Relevant Documents

- `docs/phases/02-design-system/PLAN.md`
- `docs/CONVENTIONS.md` 4장 · `docs/decisions/ADR-20260913-design-tokens-and-fonts.md`

## Relevant Source Files

- `src/ui/tokens/theme.css`·`theme.test.ts` — 토큰 원본과 생성/미생성 계약
- `src/lib/cn.ts:cn`(tailwind-merge 스케일 목록) · `eslint.config.js:ARBITRARY_COLOR`

## Next Action

PR 생성(`scripts/ai-end.sh --ready --pr`) 후 리뷰 대응. 병합되면 T2~T5 가 `git merge main`.
