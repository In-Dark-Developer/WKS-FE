# Handoff — plan-08-delegate

<!-- 60줄 이내. 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @jjjung0921 (Phase 08 Lead) · claude-code
- To: @gn00py48 (08/T4 확인 · 08/T5) · @nicerjs23 (08/T6)
- Date: 2026-09-15
- Phase / Task: 08/T4 · T5 · T6 (plan)

## Goal

Phase 08 의 남은 Task 셋이 새 Owner 에게 넘어가 각자 스트림을 열고 끝낼 수 있다.

## Work Completed

- **08/T4 공유 링크 미리보기 → @gn00py48** — 끝난 것: 공통 OG·Twitter 메타, `public/og/og-v2.jpg`(1200×630, 225KB), 동적 미리보기 기각 ADR-20260915-share-preview-static-meta, 파비콘. 카카오 공유 디버거 캐시 초기화 뒤 카카오톡에 OG 뜨는 것 @jjjung0921 확인(2026-09-15). **남은 것**: 인스타 DM·기타 메신저(라인·iMessage 등)에 `https://threadoffate.site/s/<shareId>` 를 붙여 제목·설명·썸네일 스크린샷 → 08 RESULT Validation AC3 에 기록 → PLAN T4 체크. 코드 변경 없음이 기본. 인수: `scripts/ai-stream.sh open 08/T4 preview-check --reopen`
- **08/T5 성능 예산 측정 → @gn00py48** — 현재(2026-09-15 `pnpm build`): 초기 JS `index-*.js` 516.75KB · gzip 155.19KB(예산 250KB 안), Vite 500KB 청크 경고 있음. 폰트 동국체 434KB·성곡체 205KB woff2 가 첫 화면 LCP 후보. **남은 것**: 운영 주소 Lighthouse 모바일(느린 4G) 3회 중앙값 → RESULT, 넘으면 원인 줄이는 변경, `scripts/check-bundle-size.mjs` + `ci.yml` 단계 + `package.json` 스크립트로 JS gzip 250KB 초과 시 CI 실패. `ci.yml` 은 병합 전 Lead(@jjjung0921) 리뷰. 인수: `scripts/ai-stream.sh open 08/T5 perf-budget`
- **08/T6 출시 점검 → @nicerjs23** — 기간 2026-09-18 ~ 09-28, 05·07 병합 뒤. **남은 것**: iOS Safari·Android Chrome 실기기 각 1대로 SC-1~6, 360·390·430px 가로 스크롤 0, 키보드로 폼 완주, 본문 대비 4.5:1 → 발견한 문제는 이슈로 · RESULT 에 기기별 표. 인수: `scripts/ai-stream.sh open 08/T6 launch-check`

## Work In Progress

- 없음 (PLAN Owner 변경 PR 리뷰 대기)

## Files Changed

- `docs/phases/08-launch-readiness/PLAN.md` — T4·T5·T6 Owner, T4·T5 Touches 에 RESULT 경로, 위임 주석

## Decisions Made

- 위임 기준: @gn00py48 는 `src/ui/` 폰트·에셋 Owner 이고 06/T3 이 Q14(백엔드 `/signups`) 대기라 여유가 있다 → 크기·폰트가 걸린 T5 와 짧은 T4 확인. @nicerjs23 는 05·07 공유·매칭 흐름을 만들어 SC-3~5 를 가장 잘 안다 → T6(07 병합 뒤)
- 위임하지 않는 것: `main` 병합(Netlify 무료 플랜 빌드 차단 — fork 소유자 @jjjung0921만), Phase 08 종료(Lead), 카카오 공유 디버거 캐시 초기화(카카오 개발자 계정)

## Tests Executed

- 문서 변경만 — `ai-end.sh --ci` · 번들 크기는 `pnpm build` 로 측정

## Test Results

- 통과 · 수치는 위 T5 항목

## Known Problems

- 운영 DB 에 대조용 결과 2건(테스트주인·테스트친구)·궁합이 있다 — T6 에서 순위·지도에 보이면 이것이다(지우는 API 없음)
- Figma 720:3653 부제 "귀인 궁합을 관계로 확인해보아요" 문구 기획 확인 전 · 운영 Swagger `compatibilities` 항목 타입이 실제 응답과 다름(백엔드 전달 전)
- 링크를 새 창에서 바로 열면 친구의 궁합 지도 뒤로가기가 갈 곳이 없다(브라우저 제약) — T6 에서 카카오톡 인앱 브라우저 동작 확인

## Unverified Assumptions

- @gn00py48·@nicerjs23 의 일정 — PR 리뷰에서 수락 여부를 확인한다

## Exact Next Action

PR 병합 → @gn00py48 `open 08/T4 … --reopen`·`open 08/T5 perf-budget`, @nicerjs23 07 병합 뒤 `open 08/T6 launch-check`
