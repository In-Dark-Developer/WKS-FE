# 개발 컨벤션 — 운꿰사 프론트엔드

<!-- 사람과 Agent가 코드를 쓸 때 지키는 규칙. 협업 절차(스트림·커밋·PR)는 AGENTS.md, 구조·소유권은 docs/ARCHITECTURE.md 에 있으므로 여기서 반복하지 않는다.
     도구가 잡을 수 있는 규칙은 문장이 아니라 설정(eslint.config.js · .prettierrc · tsconfig.json)으로 옮기고, 옮긴 뒤에는 이 문서에서 지운다 — Phase 01 T3. -->

- Last updated: 2026-09-13
- Status: 팀 합의 대기 (Phase 01 T3에서 도구 설정으로 고정)

## 1. 타입

- `any` 금지. 모르는 값은 `unknown`으로 받고 좁힌다. 타입 단언(`as`)과 `@ts-expect-error`는 이유를 한 줄 주석으로 남긴다.
- `enum` 대신 유니온 문자열(`type Grade = 'gwiin' | 'chaltteok' | 'beot' | 'seuchim'`)을 쓴다.
- 백엔드 응답 타입은 손으로 쓰지 않고 zod 스키마에서 추론한다(`z.infer<typeof schema>`).
- 객체 형태는 `type`으로 쓰고, 선언 병합이 필요할 때만 `interface`.
- 모듈 밖으로 나가는 함수는 반환 타입을 명시한다. 모듈 안의 지역 함수는 추론에 맡긴다.

## 2. 이름과 파일

- 컴포넌트 파일 `PascalCase.tsx`, 훅 `useThing.ts`, 그 외 `camelCase.ts`, 폴더 `kebab-case`.
- 파일 하나에 공개 컴포넌트 하나. 그 파일에서만 쓰는 비공개 하위 컴포넌트는 같은 파일에 둔다.
- `default export` 금지 — named export만 쓴다(자동 import·검색·리네임이 안정적이다).
- 배럴 `index.ts`는 feature 진입점에만 둔다. `src/ui/`는 배럴 없이 파일에서 직접 import 한다 — 공유 배럴은 모든 Task가 동시에 건드리는 충돌 지점이 된다.
- 테스트는 대상 파일 옆에 `Thing.test.tsx`. 여러 기능을 가로지르는 시나리오만 `tests/`에 둔다.
- 불리언은 `is/has/can` 접두, 이벤트 핸들러는 `handleX`, props로 받는 콜백은 `onX`.

## 3. 컴포넌트

- 함수 선언형으로 쓰고 props 타입은 `Props`로 이름 짓는다. 기본값은 매개변수 기본값으로 준다.
- `useEffect`는 외부 시스템과 동기화할 때만 쓴다. 값 계산·props 파생 상태에는 쓰지 않는다.
- 조건부 렌더는 early return 또는 삼항으로. `&&` 중첩과 숫자 단축 평가(`count && ...`)는 쓰지 않는다.
- 리스트 `key`에 배열 인덱스를 쓰지 않는다 — 서버가 준 id를 쓴다.
- 한 컴포넌트가 화면 하나를 다 담아 200줄을 넘으면 쪼갠다.

## 4. 스타일 (Tailwind)

- 색·타이포·간격은 `src/ui/tokens/theme.css`가 정의한 토큰만 쓴다. 임의값(`text-[#1a1a1a]`, `mt-[13px]`)은 쓰지 않는다.
- 토큰 클래스 이름은 Figma 이름을 그대로 옮긴다. Tailwind 기본 색·간격·radius·글자 크기 스케일은 없다(ADR-20260913-design-tokens-and-fonts).

  | Figma | 클래스 | 비고 |
  |-------|--------|------|
  | 램프 `Primary/500` · `Neutral/0` | `bg-primary-500` · `text-neutral-0` | Primary·Apricot·Rose·Neutral |
  | `Text/Primary` · `Text/OnBrand` | `text-primary` · `text-on-brand` | 글자색 전용. placeholder는 `placeholder:text-muted` |
  | `Border/Default` · `Border/Secondary/Hover` | `border-default` · `border-secondary-hover` | 테두리 전용 |
  | `Border/Focus` | `outline-focus` · `outline-secondary-focus` | 포커스 링은 outline으로 |
  | `Surface/*` · `Action/*` · `Graphic/*` · `Status/*` | `bg-surface-subtle` · `bg-action-primary-default` · `fill-graphic-lake` · `text-status-error-foreground` | 그룹 이름을 접두로 붙이고 어느 유틸리티에나 쓴다 |
  | `Space/16` | `p-16` · `gap-8` · `mt-24` | 숫자가 곧 px — `p-4`는 4px |
  | `Radius/12` · `Radius/999` | `rounded-12` · `rounded-999` | |
  | `UI/14/600 Semi Bold` | `text-ui-14 font-semibold` | 크기·행간은 `text-ui-*`, 굵기는 `font-normal`·`medium`·`semibold`·`bold` |
  | `Display/24/400 Regular` | `font-display text-display-24` | 동국체 |

- 목록에 없는 클래스(`bg-red-500`, `p-2`, `text-sm`)와 hex·`rgb()` 같은 색 리터럴은 `pnpm lint`가 실패시킨다. Figma 토큰이 바뀌면 `theme.css`를 먼저 맞추고, 스케일 이름이 바뀌면 `src/lib/cn.ts`의 목록도 맞춘다.
- 조건부 클래스는 문자열 접합 대신 `cn()` 헬퍼(`@/lib/cn`, clsx + tailwind-merge)로 합친다.
- 같은 클래스 묶음이 세 번째로 반복되면 `src/ui/` 컴포넌트로 올린다.
- 레이아웃 기준은 모바일(360–430px)이고 데스크톱은 중앙 정렬 폴백이다. 가로 스크롤이 생기면 잘못된 것이다.
- 클래스 순서는 Prettier 플러그인이 정렬한다 — 손으로 맞추지 않는다.

## 5. 데이터와 상태

- 네트워크 호출은 `src/api/`에서만 한다. 컴포넌트 안에서 `fetch`를 직접 부르지 않는다.
- 모든 응답은 zod로 파싱한 뒤 화면으로 넘긴다. 파싱 실패는 네트워크 실패와 구분해 다룬다.
- 전역 스토어는 두지 않는다(도입하려면 ADR). 상태는 쓰는 곳에서 가장 가까운 곳에 둔다.
- 파생 값은 상태로 저장하지 않고 렌더 중에 계산한다.
- 점수 구간·등급 같은 도메인 규칙은 `src/ui/`가 아니라 feature 또는 `src/lib/`에 둔다.

## 6. import

- 모듈 참조는 절대경로 `@/`로 한다. 같은 폴더 안에서만 상대경로(`./`)를 쓴다.
- 순서: 외부 패키지 → `@/` → 상대경로. 그룹 사이는 빈 줄.
- 의존 방향(`app → features → { ui, api, lib }`)을 어기는 import는 금지다 — `docs/ARCHITECTURE.md` 참고.
- feature가 다른 feature를 import 하지 않는다. 공유할 것이 생기면 `ui`·`lib`·`api`로 내린다.

## 7. 화면 상태와 문구

- 데이터를 부르는 화면은 로딩·에러·빈 상태 셋을 모두 갖는다. 빈 화면을 그냥 두지 않는다.
- 사용자에게 보이는 문구는 '보살' 말투로 쓰고 코드에 직접 쓰기보다 한곳에 모은다.
- 에러 화면은 원인을 사용자에게 노출하지 않는다. 원인은 콘솔에 남긴다.
- 모든 입력에 라벨을 붙이고, 누를 수 있는 것은 `button`·`a`로 만든다(`div` + onClick 금지).

## 8. 테스트

- 새 기능·버그 수정은 같은 커밋에 테스트를 넣는다(AGENTS.md Rule 8).
- 구현이 아니라 행동을 확인한다 — 역할과 라벨로 찾고(`getByRole`), 클래스 이름이나 내부 상태를 단언하지 않는다.
- 네트워크는 `src/api/` 경계에서 대체한다. 컴포넌트 테스트가 실제 요청을 보내지 않는다.
- 최소선: 공개 컴포넌트·훅마다 렌더 또는 동작 테스트 1개, 폼은 검증 실패 경로 1개.

## 9. 남기지 않는 것

- `console.log`(디버깅 흔적), 주석 처리된 코드, 참조 없는 TODO — 지우거나 이슈로 옮긴다.
- 쓰지 않는 export·파일. 내 변경이 만든 고아만 지우고, 원래 있던 죽은 코드는 HANDOFF의 Known Problems에 적는다.
- 비밀값·개인정보. 프론트엔드에 두지 않고 `.ai/`에도 적지 않는다.
