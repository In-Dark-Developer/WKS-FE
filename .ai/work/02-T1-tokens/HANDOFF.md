# Handoff — 02-T1-tokens

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 02/T1

## Goal

Figma 색·타이포·Space·Radius 토큰이 `@theme` 한 곳에 있고 Pretendard 번들·`cn()`이 적용되며, 토큰 밖 색을 쓰면 `pnpm lint`가 실패한다.

## Work Completed

- `src/ui/tokens/theme.css` — Figma 로컬 변수 57개(램프 41·Space 10·Radius 6)·paint style 54개·text style 21개를 `@theme`으로. Tailwind 기본 색·spacing·radius·text 스케일은 비움
- `src/index.css`(tailwindcss → Pretendard dynamic-subset → theme.css) · `src/main.tsx` import
- `src/lib/cn.ts` — clsx + tailwind-merge(Figma 스케일 등록) · 임의 색상 금지 ESLint 규칙 · prettier-plugin-tailwindcss(`cn` 안 정렬)
- Display 폰트 `src/ui/tokens/fonts/dongguk-university.woff2` · ADR · 공지 `2026-09-13-design-tokens`

## Work In Progress

- 없음 — PR 생성 대기

## Files Changed

- `src/ui/tokens/{theme.css,theme.test.ts,fonts/dongguk-university.woff2}` · `src/index.css` · `src/main.tsx` · `src/lib/{cn.ts,cn.test.ts}`
- `eslint.config.js` · `.prettierrc` · `package.json` · `pnpm-lock.yaml` · `.ai/team/{announcements/2026-09-13-design-tokens.md,README.md}` · ADR · PLAN

## Decisions Made

- 소유자 지시(2026-09-13): T1 을 @jjjung0921 명의로 진행(PLAN Owner 는 @gn00py48 그대로), Pretendard 번들, 클래스 이름은 Figma 이름 그대로(`p-16`=16px), Display 폰트 파일은 소유자 제공
- 토큰 파일은 PLAN 문구(`src/index.css @theme`) 대신 `src/ui/tokens/theme.css` — ARCHITECTURE 가 토큰을 `ui` 소유로 둔다(Truth ⑤ > ⑧). `index.css` 가 import
- `main.tsx` 에 vite/client 타입 참조(triple-slash) 추가 — TS 6 이 CSS side-effect import 타입을 요구, `tsconfig.json` 은 Touches 밖
- Touches 추가: `src/lib/cn.test.ts`(Rule 8), 공지·색인(Rule 14)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · 임시 파일로 린트 규칙 확인(hex·rgb()·[color:] 4건 실패, `#root`·토큰 클래스 통과) · dev 서버에서 `document.fonts` 로드 확인

## Test Results

- test 22 통과, typecheck·lint 경고 0, build 성공(Pretendard woff2 92조각 + 동국체 434kB), 브라우저에서 두 폰트 loaded

## Known Problems

- 토큰 밖 팔레트 클래스(`bg-red-500`)는 린트가 아니라 "CSS 미생성"으로만 막힌다 — 린트로 잡으려면 등록되지 않은 클래스 검사 플러그인(eslint-plugin-better-tailwindcss) 도입 필요(의존성 추가 제안 사항)
- `docs/CONVENTIONS.md` 4장에 클래스 이름 규칙이 아직 없다 — 공지·ADR 에만 있음(Touches 밖)

## Unverified Assumptions

- 동국체 원본(© DONGGUK UNIVERSITY, All rights reserved, fsType 4)의 웹 임베드 허용 — 학교 배포 폰트로 가정. 원본 OTF 는 CFF 이름 공백 때문에 브라우저 OTS 가 거부해 이름만 `DONGGUKUNIVERSITY` 로 바꿔 woff2 변환(fontTools)

## Exact Next Action

`git merge main` 후 `scripts/ai-end.sh --ready --pr` 로 PR 생성
