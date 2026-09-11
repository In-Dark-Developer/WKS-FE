# ADR-20260911: 프론트엔드 스택과 저장소 범위

- Status: Accepted
- Date: 2026-09-11
- Deciders: @jjjung0921 (제안) / 리뷰어는 PR 승인자

## Context

운꿰사는 사주 결과를 보여주고 공유 링크·점지 카드로 퍼뜨린 뒤 소개팅으로 잇는 모바일 웹앱이다 (`docs/PRD.md`).
만세력 계산·문구 생성·매칭·개인정보 저장은 서버가 해야 하고, 이 저장소(`WKS-FE`)는 그중 화면만 맡는다.
정해진 것은 TypeScript / React / Tailwind CSS 뿐이었고, 저장소 범위·빌드 형태·검증 도구가 비어 있었다. NFR-1(모바일 우선)·NFR-2(LCP < 2.5s)·NFR-3(공유 링크 미리보기)이 선택에 걸린다.

## Problem

(1) 이 저장소가 프론트엔드만 담을지, (2) React를 어떤 런타임으로 실행할지(클라이언트 전용 SPA vs 서버 렌더링 프레임워크), (3) 어떤 도구로 test·typecheck·lint 제약을 걸지 정해야 한다.

## Alternatives

1. **Vite SPA + 백엔드 별도 저장소** — 장점: 서버 런타임 없이 정적 호스팅, 빌드·개발 서버가 가볍고 팀이 화면에만 집중. 단점: 공유 링크별 동적 OG 메타·썸네일을 프론트엔드가 못 만든다.
2. **Next.js(App Router) + 백엔드 별도 저장소** — 장점: 공유 링크별 SSR 메타태그와 OG 이미지 생성이 쉽다. 단점: 프론트엔드 전용 저장소인데 Node 서버 배포·운영이 생기고, 백엔드와 책임이 겹친다.
3. **이 저장소에 백엔드까지(모노레포)** — 장점: 계약 변경이 한 PR에 담긴다. 단점: 저장소 이름·팀 분담과 어긋나고 Phase가 구성요소를 섞게 된다.

## Decision

1번을 택한다.

- 저장소 범위: 프론트엔드 전용 단일 패키지(루트 `src/`·`tests/`). 백엔드는 별도 저장소가 소유하고, `docs/api/openapi.yaml`은 **참조본**으로만 둔다.
- 런타임/빌드: Vite + React + TypeScript(SPA), 라우팅은 React Router.
- 스타일: Tailwind CSS(Vite 플러그인). 디자인 토큰은 `src/ui/`가 소유한다.
- 패키지 매니저: pnpm (`packageManager` 필드 + `pnpm-lock.yaml`), Node 버전은 `.nvmrc`로 고정.
- 검증: 테스트 Vitest + React Testing Library(jsdom), 타입체크 `tsc --noEmit`(`strict`, `noUncheckedIndexedAccess`), 린트·포맷 ESLint(flat config, typescript-eslint) + Prettier. 경고는 실패로 돌린다(`--max-warnings=0`).
- 런타임 경계 검증: zod. 백엔드 응답·URL 파라미터는 파싱한 뒤에만 화면으로 넘긴다.
- 서버 상태 캐시 라이브러리와 세션 보관 방식은 이 ADR에서 정하지 않는다 — 백엔드 계약이 확정되는 Phase 03에서 별도 ADR로 정한다.

## Rationale

NFR-3(공유 미리보기)만 Next.js 쪽으로 당기는 요구였는데, 공유 링크(`/s/:shareId`)의 메타태그는 링크를 발급하는 백엔드가 함께 소유하는 편이 자연스럽다. 그 하나 때문에 프론트엔드 전용 저장소에 Node 서버 운영 비용을 들일 이유가 없다.
점지 카드 이미지는 클라이언트에서 만들어 공유(Web Share API)하므로 서버 렌더링이 필요 없다. NFR-2는 SPA 번들 예산(250KB gzip)으로 관리한다.
pnpm·Vitest·ESLint flat config는 Vite 생태계의 기본 조합이라 설정이 적고, AGENTS.md Commands 다섯 줄로 그대로 표현된다.

## Consequences

- 긍정: 정적 호스팅만으로 배포된다. 백엔드와 저장소가 갈려 PR·CI·소유권이 단순하다. 검증 명령 네 개가 모두 pnpm 스크립트 한 줄이다.
- 부정 / 감수한 것: 공유 링크의 동적 OG 메타·썸네일을 백엔드에 요청해야 한다(불가능하면 정적 기본 메타로 시작). 초기 로딩에 SSR 이점이 없어 번들 예산을 계속 지켜야 한다. 계약 변경이 두 저장소에 걸친다.
- 도입 금지: 이 스택 밖의 언어·런타임(서버 프레임워크, CSS-in-JS 런타임, 전역 상태 라이브러리, 다른 패키지 매니저)은 새 ADR 없이 추가하지 않는다. 허용 언어는 TypeScript(앱·테스트)와 CSS(Tailwind 지시문)뿐이다.
- 후속 작업: Phase 01 T3에서 설정 파일·lockfile·버전 고정 파일을 만들고 Commands가 경고 없이 통과하는지 확인한다. `docs/ARCHITECTURE.md`가 이 ADR을 참조한다. 팀 공지 `.ai/team/announcements/2026-09-11-frontend-stack.md`.
