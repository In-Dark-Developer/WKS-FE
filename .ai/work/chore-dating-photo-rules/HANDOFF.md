# Handoff — chore-dating-photo-rules

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

소개팅 사진은 BE 기준(JPG·PNG, 10MB 이하)으로 고르는 순간 걸러지고, 화면이 그 조건을 안내한다.

## Work Completed

- datingPhotoContentTypeSchema 에서 webp 제거, DATING_PHOTO_ACCEPT, 10MB 선검사, 안내·오류 문구 (f41f06e)

## Work In Progress

- 없음

## Files Changed

- src/api/schema/dating.ts · src/api/uploads.ts(+test)
- src/features/dating/profile/DetailsStep.tsx · DatingProfileForm.test.tsx
- docs/api/openapi.yaml (/dating/profile/photo enum)

## Decisions Made

- 2천만 픽셀 제한은 문구·검사에 넣지 않았다(10MB 안에서 드묾)
- 안내 문구는 Figma "서비스 정책에 따릅니다"를 대체 — 디자인 확인 필요

## Tests Executed

- pnpm test · typecheck · lint, /preview/dating-profile (2/2)

## Test Results

- 640 통과

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

<다음 세션(또는 다음 사람)이 첫 번째로 할 일 한 줄>
