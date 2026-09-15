# Handoff — 08-T4-share-link-preview

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 08/T4

## Goal

`https://threadoffate.site/s/{shareId}` 를 카카오톡·인스타·메신저에 붙이면 제목·설명·썸네일이 보이고, `shareId` 별 동적 미리보기 채택·기각이 ADR 로 남는다.

## Work Completed

- `public/og/og.jpg`(소유자 전달 `src/ui/assets/og.png` 1920×1080·3.2MB 를 1200×675 JPEG 85·250KB 로 변환) + `og:image`·`og:image:width/height/alt`·`twitter:card summary_large_image`·`twitter:image` (commit b19cf37)
- `index.html`: title 태그 운꿰사 → "운명도 꿰어야 사랑이다", `description`·`og:*`(type·site_name·title·description·url·locale)·`twitter:*`(card summary·title·description) (commit d32d0e7, Wip)
- ADR-20260915-share-preview-static-meta: 동적 미리보기(Edge Functions·백엔드 렌더) 기각, 공통 메타 채택 — 재검토 조건 Q12 (commit 16129b5, Wip)

## Work In Progress

- 없음 (PR 리뷰·배포 뒤 앱 미리보기 확인 대기)

## Files Changed

- `index.html` · `public/og/og.jpg` · `docs/decisions/ADR-20260915-share-preview-static-meta.md`

## Decisions Made

- 소유자 결정: 서비스 이름 교체는 사용자 노출 문구(title 태그·OG/Twitter 제목)만. 문서 제목·주석·미사용 `src/app/Placeholder.tsx`·테스트 입력값의 "운꿰사" 는 그대로
- 설명 문구는 입력 화면 부제 "생년월일로 점지받는 나의 인연"(`src/features/saju/SajuForm.tsx`)을 그대로 쓴다
- 썸네일은 원본 비율(16:9) 유지 1200×675 — 1.91:1 로 자르면 글자·캐릭터가 잘린다. 용량은 메신저 썸네일 한도(수백 KB)를 고려해 JPEG 로 줄였다
- 동적 미리보기 기각 — 소유자 확인 2026-09-15

## Tests Executed

- `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`

## Test Results

- test 280 passed, typecheck·lint 경고 없음, `dist/og/og.jpg` 생성·`dist/index.html` og:image 확인. 실제 앱 미리보기는 배포 전이라 미확인

## Known Problems

- `og:url` 은 크롤러용 절대 주소라 공지 hosting-domains(절대 주소 금지)의 예외다 — PLAN T4 Done when 이 요구
- 운영 번들 JS gzip 147KB (T5 예산 250KB 참고)

## Unverified Assumptions

- 카카오·인스타·메신저가 1200×675(16:9) 이미지를 잘림 없이 보여준다 — 배포 뒤 확인

## Exact Next Action

병합·배포 뒤 카카오 공유 디버거로 `https://threadoffate.site/s/test` 미리보기 확인 → PLAN T4 체크(SHA b19cf37)
