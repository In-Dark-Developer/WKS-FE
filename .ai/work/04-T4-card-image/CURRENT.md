# Current State — 04-T4-card-image

- Stream: 04-T4-card-image
- Owner: gn00py48@gmail.com
- Branch: ws/04-T4-card-image
- Task: 04/T4
- Issue: none
- Touches: src/lib/cardImage.ts, src/lib/cardImage.test.ts, docs/decisions/, package.json, pnpm-lock.yaml
- Supersedes: none
- Acked: 2026-09-13-publishing-first, 2026-09-13-design-tokens, 2026-09-13-opacity-tokens, 2026-09-13-hosting-domains, 2026-09-12-design-first-prd, 2026-09-13-task-after

## Current Phase

04-share-and-card — `docs/phases/04-share-and-card/PLAN.md`

## Current Task

T4. 카드 이미지 생성

## Status

REVIEW

## Progress

- [x] HANDOFF Goal · 카드 CSS·에셋·폰트 조사
- [x] 방식 비교 4안 → `html-to-image` 채택 · 의존성 추가
- [x] `cardImage.ts` 구현 · 테스트 7개
- [x] ADR-20260914 작성
- [x] 검증 test 213 · typecheck · lint · 청크 분리 실측(gzip 5.10KB)
- [x] 커밋 f0c9a39

## Last Checkpoint

`f0c9a39`

## Relevant Documents

- `docs/phases/04-share-and-card/PLAN.md`

## Relevant Source Files

- `src/lib/cardImage.ts:renderCardImage` — 동적 import + toBlob
- `src/lib/cardImage.ts:buildStoryFrame` — 화면 밖 1080×1920 프레임
- `src/ui/DestinyCard.css` — 컨테이너 쿼리 기반 레이아웃(재현도 판단 근거)

## Next Action

`docs/phases/04-share-and-card/PLAN.md`에서 04/T4의 Done when·Acceptance Criteria를 확인하고 HANDOFF의 Goal·Work In Progress를 쓴 뒤 시작한다.
