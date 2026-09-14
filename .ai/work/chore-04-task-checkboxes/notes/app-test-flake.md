# 넘길 메모 — `src/app/App.test.tsx` 실패 (담당 @jjjung0921, `src/app/`)

- 증상: `pnpm test` 에서 `src/app/App.test.tsx > 개발 서버에서는 /preview 가 퍼블리싱 확인 목록을 보여 준다` 1건 실패.
  `findByRole('heading', { name: '퍼블리싱 확인' })` 가 못 찾고, 그 자리에 `RouteLoading`(`role=status`, `aria-busy`)이 남아 있다.
- 2026-09-13 세션에서 detached checkout 으로 이등분: `9d3a3dd` 통과 → `865e191` 통과 → `ee970bc`(04/T2 인연카드 퍼블리싱, PR #60) 부터 실패. 2026-09-14 main `2a70b42` 에서도 재현.

## 원인 (2026-09-14 확인)

깨진 코드가 아니라 **대기 시간 부족**이다.

- `src/app/preview/previewScreens.ts` 와 `src/app/preview/PreviewRoute.tsx` 를 테스트에서 직접 `await import()` 하면 **둘 다 정상 로드**된다 (임시 probe 테스트 2건 통과).
- 다만 그 두 import 에만 jsdom 에서 약 5초가 걸린다 — `import.meta.glob(..., { eager: true })` 가 미리보기 화면을 전부 끌어오기 때문이고, 화면이 늘수록(`card.tsx`·`share.tsx`·`pre-register.tsx`·`map.tsx`…) 더 느려진다.
- `App.tsx` 의 `/preview/*` 는 `lazy:` 라우트라 이 import 가 끝나야 목록이 렌더된다. `findByRole` 의 기본 `waitFor` 는 **1000ms** 이고 `--testTimeout` 으로는 늘어나지 않는다. 그래서 04/T2 가 화면을 하나 더 추가한 시점부터 1초를 넘겨 실패하기 시작했다.
- CI 가 초록인 것도 이것으로 설명된다 — 기계·노드 버전에 따라 1초 안에 들어오기도 한다. 즉 상시 실패가 아니라 느린 환경에서 터지는 flake 다.

## 제안 (고치는 사람 판단)

- `findByRole(..., { timeout: 10000 })` 로 대기를 늘리거나,
- 테스트에서 `PreviewRoute` 를 미리 `await import()` 해 두고 렌더하거나,
- `previewScreens.ts` 의 glob 을 `eager: false` 로 바꾼다(화면 수가 계속 늘 것이므로 근본 해결에 가깝다).

## 내가 안 고친 이유

`src/app/` 은 @jjjung0921 담당이고 이 스트림의 Touches 는 `docs/phases/` 뿐이다 (AGENTS.md Rule 6).

## 참고 — 내 로컬 노드가 요구 버전보다 낮다

`.nvmrc`·`package.json engines` 는 `>=26` 인데 이 기계는 `v24.15.0` (`C:\nodeJS`, 버전 매니저 없음). `pnpm` 이 매번 `Unsupported engine` 경고를 낸다. lint·typecheck·build 는 통과하지만, 로컬 테스트 결과를 근거로 쓰기 전에 노드 26 을 깔아야 한다.
