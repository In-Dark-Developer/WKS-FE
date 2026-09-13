# ADR-20260913: 디자인 토큰은 Figma 이름 그대로 Tailwind 스케일을 대체하고, 폰트는 번들한다

- Status: Accepted
- Date: 2026-09-13
- Deciders: @jjjung0921 (제안) / 리뷰어는 PR 승인자

## Context

Phase 02 T1 은 Figma 디자인시스템(16-2)의 로컬 변수·스타일을 코드 한 곳으로 옮긴다 — 색 램프 41개(Primary·Apricot·Rose·Neutral), paint style 54개(Text·Border·Surface·Action·Graphic·Status), Space 10개·Radius 6개, text style 21개(UI 17개는 Pretendard, Display 4개는 동국체 "DONGGUK UNIVERSITY"). PRD Constraints 는 Pretendard 조달 방식(번들 vs CDN)을 이 Task 에서 정하라고 한다. CONVENTIONS 4장은 토큰 밖 색·간격을 금지하지만, Tailwind 기본 스케일(`bg-red-500`, `p-1.5`, `text-sm`)이 남아 있으면 그 규칙은 리뷰에만 기댄다. 화면 Phase 는 여러 사람이 병렬로 만들고 기준은 Figma 다.

## Problem

1. 토큰을 어떤 클래스 이름으로 노출하고, 토큰 밖 값을 어떻게 막는가.
2. Pretendard 와 Display 폰트를 어디서 받는가.

## Alternatives

1. **Tailwind 기본 스케일 유지 + 색만 추가** — 익숙하다(`p-4`=16px). 토큰 밖 값(`p-1.5`, `bg-red-500`)이 계속 생성되고 Figma 의 `Space/16` 을 `p-4` 로 번역해야 한다.
2. **Figma 이름으로 기본 스케일을 대체** — `--color-*`·`--spacing-*`·`--radius-*`·`--text-*` 를 비우고 Figma 이름으로 다시 채운다. Figma ↔ 코드가 1:1 이고 토큰 밖 클래스는 CSS 가 생기지 않는다. `p-4` 가 4px 이라 Tailwind 습관과 다르다.
3. **Pretendard CDN(jsDelivr)** — 의존성이 없다. 제3자 도메인에 묶이고 축제 현장 네트워크에서 연결이 하나 더 생긴다.
4. **Pretendard 번들(npm `pretendard`, variable dynamic-subset)** — 같은 origin 에서 필요한 unicode-range 조각(woff2 ~40kB)만 받는다. 의존성 1개, 빌드 산출물에 woff2 92개.

## Decision

- 대안 2 와 4 를 택한다.
- 토큰은 `src/ui/tokens/theme.css` 의 `@theme` 한 곳에 두고 `src/index.css` 가 import 한다(ARCHITECTURE: 토큰은 `ui` 소유). 이름 규칙: 램프 `bg-primary-500`, Text → `text-primary`(`--text-color-*`), Border → `border-default`(`--border-color-*`), 나머지 → `bg-surface-subtle`·`bg-action-primary-default`·`text-status-error-foreground`(`--color-*`), Space/16 → `p-16`(16px), Radius/12 → `rounded-12`, UI/14/600 → `text-ui-14 font-semibold`, Display/24 → `font-display text-display-24`. 포커스 링은 `outline-focus`.
- 시맨틱 색은 같은 hex 의 램프 변수를 참조한다. 램프에 없는 Status 4색만 hex 로 둔다.
- 토큰 밖 클래스는 ESLint `better-tailwindcss/no-unknown-classes`(entryPoint `src/index.css`)로, 임의 색상(hex·색 함수·`[color:…]`)이 든 문자열은 `no-restricted-syntax` 로 막는다(테스트 파일 제외).
- Display 폰트는 원본 OTF 를 woff2 로 바꿔 `src/ui/tokens/fonts/` 에 번들한다. 원본의 CFF 이름("DONGGUK UNIVERSITY")에 공백이 있어 브라우저 폰트 검사기(OTS)가 파일 전체를 거부하므로, CFF 이름과 name ID 6 을 `DONGGUKUNIVERSITY` 로 바꾼 뒤 변환했다(fontTools, 글리프·메트릭 변경 없음). CSS `font-family` 이름은 Figma 와 같은 `'DONGGUK UNIVERSITY'` 다.

## Rationale

병렬 화면 작업에서 결정적인 기준은 "Figma 에서 읽은 이름을 번역 없이 쓴다"와 "토큰 밖 값은 애초에 동작하지 않는다"였다. 폰트는 MVP 가 축제 현장 모바일 네트워크(NFR-1)에서 쓰이므로 외부 CDN 연결을 줄이는 쪽을 택했다.

## Consequences

- 긍정: Figma 토큰 이름 = 클래스 이름. 토큰 밖 색·간격·radius·글자 크기 클래스는 CSS 가 생성되지 않고(`src/ui/tokens/theme.test.ts`) `pnpm lint` 가 실패한다.
- 부정 / 감수한 것: `p-4`=4px 등 Tailwind 기본 숫자와 뜻이 다르다. 토큰 밖 클래스 검사를 위해 dev 의존성 eslint-plugin-better-tailwindcss 가 늘었다. 스케일 이름을 바꾸면 `src/lib/cn.ts` 의 tailwind-merge 목록도 같이 바꿔야 한다. 동국체 woff2 는 435kB 다. 원본 라이선스(© DONGGUK UNIVERSITY)의 웹 사용은 2026-09-13 @jjjung0921 이 확인했다.
- 후속 작업: T2~T5 는 이 이름 규칙을 쓴다(공지 2026-09-13-design-tokens, `docs/CONVENTIONS.md` 4장). Figma 토큰이 바뀌면 `theme.css` 를 맞춘다.
