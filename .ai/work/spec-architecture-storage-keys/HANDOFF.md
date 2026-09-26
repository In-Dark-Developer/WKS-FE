# Handoff — spec-architecture-storage-keys

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: -/-

## Goal

ARCHITECTURE 의 브라우저 저장소 설명이 실제 코드의 키와 로그인 쿠키와 같다.

## Work Completed

- sessionStorage `wks:joined-shares`(이름 명시)·`wks:kakao-login` 추가, 티저 지남은 메모리(`wks:teaser-passed` 폐기), 목 전용 `wks:mock-account`, 쿠키 `wks_token` 속성

## Work In Progress

- 없음

## Files Changed

- `docs/ARCHITECTURE.md`

## Decisions Made

- 없음

## Tests Executed

- `grep` 으로 src 의 localStorage·sessionStorage 사용처와 대조

## Test Results

- 문서와 코드 키 일치

## Known Problems

- `src/api/auth.ts`·`src/api/schema/auth.ts` 주석의 'FE 가정 계약' 표현은 Touches 밖이라 남겼다

## Unverified Assumptions

- 없음

## Exact Next Action

없음.
