# Handoff — 08-T4-share-link-preview

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 08/T4

## Goal

`https://threadoffate.site/s/<id>` 를 카카오톡·인스타·메신저에 붙이면 제목·설명·썸네일이 보이고, `shareId` 별 동적 미리보기 채택·기각이 ADR 로 남는다.

## Work Completed

- `index.html`: `<title>` 운꿰사 → "운명도 꿰어야 사랑이다", `description`·`og:*`(type·site_name·title·description·url·locale)·`twitter:*`(card summary·title·description) (commit d32d0e7, Wip)

## Work In Progress

- 썸네일(`og:image`) — 디자인 전달 대기 (소유자 결정 2026-09-14)

## Files Changed

- `index.html`

## Decisions Made

- 소유자 결정: 서비스 이름 교체는 사용자 노출 문구(`<title>`·OG/Twitter 제목)만. 문서 제목·주석·미사용 `src/app/Placeholder.tsx`·테스트 입력값의 "운꿰사" 는 그대로
- 설명 문구는 입력 화면 부제 "생년월일로 점지받는 나의 인연"(`src/features/saju/SajuForm.tsx`)을 그대로 쓴다
- 이미지가 없어 `twitter:card` 는 `summary` — 썸네일이 오면 `summary_large_image`

## Tests Executed

- `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`

## Test Results

- test 52 files·238 passed, typecheck·lint 경고 없음, `dist/index.html` 에 새 제목·OG 메타 확인

## Known Problems

- `og:url` 은 크롤러용 절대 주소라 공지 hosting-domains(절대 주소 금지)의 예외다 — PLAN T4 Done when 이 요구
- 운영 번들 JS gzip 147KB (T5 예산 250KB 참고)

## Unverified Assumptions

- 없음

## Exact Next Action

썸네일을 받으면 `public/og/` 에 넣고 `og:image`(절대 주소)·`og:image:width/height`·`twitter:card summary_large_image` 추가 → 동적 미리보기 ADR → 병합·배포 뒤 카카오 공유 디버거로 확인
