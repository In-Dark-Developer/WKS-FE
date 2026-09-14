# Phase 02 — design-system · Result

<!-- Phase 종료 시 작성한다. PLAN.md와 대조해 사실만 적는다. 실행하지 않은 검증을 완료로 적지 않는다. -->

- Completed on: 2026-09-14
- Final Status: DONE
- Tag: `phase/02`

## Completed

- T1. Figma 램프·시맨틱·Space·Radius 토큰을 `src/index.css` `@theme` 한 곳에 정의하고, Pretendard 를 번들로 조달, `cn()`(clsx + tailwind-merge)과 prettier-plugin-tailwindcss 도입 (commits 32a858d, ada94b7, 60ad436)
- T2. Button(4 variant·로딩·비활성)·IconButton·TextField·Checkbox·SegmentedControl·Field 와 각 렌더 테스트 (commit 0dbf26a)
- T3. Modal(포커스 트랩·ESC·배경 스크롤 잠금·포커스 복원)·ShareSheet·Toast 와 테스트 (commit 65cdc15)
- T4. Card/Shell(Header·Media·Body·Footer)·SectionHeader·Notice·ContentState(로딩·에러·빈) 와 테스트 (commit 8acba79, PR #38)
- T5. 360–430px 가로 스크롤 없는 앱 셸과 전역 배경(그라데이션 고정 · 별자리 상승) (commit 3f9a1c0, PR #39)
- T6. Select(옵션은 props 로만)·TextArea(글자 수 카운터)·PhotoUpload(미리보기·안내) 와 테스트 (commit 9094369)

## Not Completed

- Scope 의 `ActionGroup` 은 만들지 않았다 — T2~T6 어느 Done when 에도 들어가지 않았고, 03~06 화면이 버튼을 직접 배치해 필요가 생기지 않았다. 필요해지는 Phase 에서 그 Task 가 만든다.
- Scope 가 이름을 나눠 적은 `SelectTrigger`·`OptionRow`·`PickerSheet` 는 별도 파일이 아니라 `src/ui/Select.tsx` 안에 구현됐다 (동작·테스트는 충족).

## Deviations from Plan

- T2 담당이 @gn00py48 → @jjjung0921 로 바뀌었다 (2026-09-13, 03/T4 와 함께 인수). 공지 `2026-09-13-form-owner-change`·`2026-09-13-screen-ownership`.
- 원래 한 Task 였던 폼 컴포넌트를 T2(기본 입력)·T6(선택·긴 입력·사진)으로 쪼갰다 — 수정본(558-3526) 기준으로 T2·03/T4·06 이 한 사람에게 몰려 03/T4 가 막히는 것을 풀기 위해서다.
- T2 가 선언한 Touches 밖의 `src/ui/Icon.tsx`·`src/ui/assets/icons/`(check·spinner)를 함께 추가했다. Button 로딩·Checkbox 체크 표시에 필요했고 다른 Task 의 파일은 건드리지 않았다.
- `src/ui/index.ts` 배럴을 두지 않기로 했다 — 모든 Task 가 건드려 충돌 지점이 되기 때문이다. 소비자는 파일에서 직접 import 한다 (`docs/CONVENTIONS.md`).
- Phase 종료 이후 `src/ui/DestinyCard.tsx`·`ZodiacCharacter.tsx` 가 03/T5 에서 추가됐다 (commit 7fc2ccf) — Phase 02 산출물이 아니라 화면 Phase 가 공용 요소를 `src/ui/` 에 올린 것이다.

## Important Decisions

- Tailwind v4 `@theme` 단일 소스 — `tailwind.config.ts` 를 두지 않는다. Figma 변수 이름이 곧 클래스 이름이다.
- Pretendard 번들 조달 (CDN 아님) — 축제 현장 네트워크에서 폰트 로딩 실패를 피한다.
- 임의 색상 금지를 린트로 강제한다 — `eslint.config.js` 의 `no-restricted-syntax` 가 hex·CSS 색 함수·`[color:…]` 를 문자열 단계에서 막는다.
- 반투명 배경은 `/50` 표기나 `rgba()` 가 아니라 Figma `Opacity/*` 토큰을 쓴다 (공지 `2026-09-13-opacity-tokens`).

## Validation Results

| Check     | Command / Method                                   | Result                                     |
|-----------|----------------------------------------------------|--------------------------------------------|
| Tests     | `pnpm test`                                         | pass — 52 files / 238 tests                |
| Typecheck | `pnpm typecheck`                                    | pass                                       |
| Lint      | `pnpm lint`                                         | pass (eslint `--max-warnings=0` + prettier)|
| Build     | `pnpm build`                                        | pass                                       |
| AC1       | `pnpm lint` + `src/**` 에서 hex·`rgb()`·`rgba()` grep | pass — 테스트 제외 소스에 하드코딩 색 0건  |
| AC2       | `npx vitest run src/ui`                             | pass — 20 files / 88 tests, `src/ui/` 컴포넌트 19개 전부 `*.test.tsx` 보유 |
| AC3       | Modal·Select 키보드 테스트 + 라벨 단위 테스트        | pass — Modal 은 ESC·포커스 트랩·포커스 복원·배경 클릭, Select 는 키보드 열기·이동·선택·ESC, Field·Checkbox·TextField·TextArea·PhotoUpload·Card 는 라벨 연결 테스트 |
| AC4       | `src/ui/` 에서 `@/api`·`@/features` import grep + eslint boundary 규칙 | pass — 0건               |
| AC5       | T2~T6 각 커밋의 `git show --name-only`               | pass — 다섯 Task 의 파일 집합이 서로 겹치지 않는다 (T2 의 Icon 추가는 위 Deviations 참고) |

## Known Issues

- `src/ui/` 컴포넌트의 시각적 회귀를 잡는 수단이 없다 — 렌더 테스트는 구조·접근성만 본다. 디자인 변경은 `/preview/*`(03/T6) 수동 확인에 의존한다.
- 접근성은 라벨·포커스·키보드까지만 확인했다. 스크린리더 실사용과 색 대비(NFR-5)는 측정하지 않았다.

## Follow-up Work

- `ActionGroup` 이 필요해지면 그 화면 Phase 의 Task 가 `src/ui/` 에 만든다.
- 색 대비·스크린리더 확인은 Phase 08 launch-readiness 의 점검 항목으로 넘긴다.
