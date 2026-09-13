# Handoff — 02-T4-card-state

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: codex
- To: 없음
- Date: 2026-09-13
- Phase / Task: 02/T4

## Goal

Card/Shell 슬롯, SectionHeader, Notice, 로딩·에러·빈 ContentState가 순수 props 기반으로 렌더되고 테스트·타입·린트가 통과한다.

## Work Completed

- `Card`에 Header·Media·Body(children)·Footer 선택 슬롯을 구현했다.
- `SectionHeader`, `Notice`, 로딩·에러·빈 `ContentState`를 순수 props 기반으로 구현했다.
- 공개 컴포넌트의 렌더·접근성 역할 테스트를 추가했다. Task commit: `8acba79`.

## Work In Progress

- 없음

## Files Changed

- `src/ui/Card.tsx`, `src/ui/SectionHeader.tsx`, `src/ui/Notice.tsx`
- `src/ui/state/ContentState.tsx`와 각 인접 `*.test.tsx`

## Decisions Made

- 상태는 도메인/API를 판단하지 않고 `state`, 문구, 액션 props만 받는다.
- 로딩·빈 상태는 `status`, 오류는 즉시 알림을 위한 `alert` 역할을 쓴다.

## Tests Executed

- `pnpm test -- src/ui/Card.test.tsx src/ui/SectionHeader.test.tsx src/ui/Notice.test.tsx src/ui/state/ContentState.test.tsx`
- `pnpm test`; `pnpm typecheck`; `pnpm lint`; `git diff --check`

## Test Results

- 7 files, 30 tests 통과. typecheck·lint·format·whitespace 검사 통과.

## Known Problems

- 현재 라이브 Figma 파일이 계획의 디자인시스템 대신 단일 배경 이미지로 보여 정확한 치수 대조는 못 했다.

## Unverified Assumptions

- 라이브 Figma 파일에는 계획의 디자인시스템 노드 대신 단일 배경 이미지 프레임만 보여, T4의 정확한 치수는 현재 재검증할 수 없다. 병합된 토큰과 PLAN의 슬롯 계약을 기준으로 한다.

## Exact Next Action

PR에서 T4 슬롯 계약과 기본 상태 문구를 검토한 뒤 병합한다.
