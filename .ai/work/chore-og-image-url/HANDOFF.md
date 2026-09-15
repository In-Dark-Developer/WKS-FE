# Handoff — chore-og-image-url

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

공유 미리보기 이미지 주소가 바뀌어 메신저가 이전 이미지 캐시 대신 새 이미지를 받는다(소유자 요청 2026-09-15).

## Work Completed

- `public/og/og.jpg` → `public/og/og-v2.jpg`(내용 같음) · `index.html` `og:image`·`twitter:image` → `https://threadoffate.site/og/og-v2.jpg` (commit 8279fbc)

## Work In Progress

- 없음

## Files Changed

- `index.html` · `public/og/og-v2.jpg`

## Decisions Made

- 이미지를 뺐다 다시 넣는 대신 주소를 바꾼다 — 이미지 없는 배포 틈에 빈 미리보기가 캐시되지 않는다. 이후 이미지 교체도 파일 이름 버전을 올린다

## Tests Executed

- `pnpm build`

## Test Results

- build 성공, `dist/og/og-v2.jpg` 생성, `dist/index.html` 에 새 주소 2곳

## Known Problems

- 없음

## Unverified Assumptions

- 배포 뒤 카카오가 새 주소 이미지를 받는지 — 미확인

## Exact Next Action

PR 병합 → 카카오 공유 디버거 캐시 초기화 → 미리보기 확인
