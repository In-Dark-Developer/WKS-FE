# 운꿰사 (WKS) — Frontend

> "부처가 점지해준 나의 운명" — 사주로 보는 대학 축제 소개팅

대학 축제 참가자가 생년월일로 자기 운세를 보고, 점지 카드를 인스타에 공유하고, 공유 링크로 들어온 친구와의 궁합 점수를 쌓다가, 소개팅 상대에게 '운명의 실'을 보내 연락처를 주고받는 모바일 웹앱이다.
이 저장소는 그중 **프론트엔드(화면)** 만 담는다. 사주(만세력) 계산·문구 생성·매칭·저장은 별도 백엔드 저장소가 담당한다.

- 요구사항: [`docs/prd/`](docs/prd/README.md)
- 구조: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · 코딩 컨벤션: [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) · 스택 결정: [`docs/decisions/ADR-20260911-frontend-stack-and-repo-scope.md`](docs/decisions/ADR-20260911-frontend-stack-and-repo-scope.md)
- 소비하는 API 계약(참조본): [`docs/api/openapi.yaml`](docs/api/openapi.yaml)
- 개발 계획: [`docs/phases/README.md`](docs/phases/README.md)
- 원본 기획 메모: [`docs/product-brief.md`](docs/product-brief.md)

## Stack

TypeScript · React (Vite SPA) · Tailwind CSS · pnpm. 테스트는 Vitest + React Testing Library, 타입체크는 `tsc --noEmit`, 린트·포맷은 ESLint + Prettier.

## Getting Started

```bash
pnpm install --frozen-lockfile   # 설치
pnpm dev                         # 개발 서버
pnpm test                        # 테스트
pnpm typecheck                   # 타입체크
pnpm lint                        # 린트·포맷 검사
```

환경변수는 `VITE_` 접두로만 주입한다 (`VITE_API_BASE_URL`). 비밀값은 프론트엔드에 두지 않는다.

## Layout

```text
src/
  app/        라우팅 · 전역 프로바이더 · 레이아웃
  features/   화면 기능 (saju · share · friends · profile · matching)
  ui/         디자인 시스템 (토큰 · 표현 전용 컴포넌트)
  api/        백엔드 REST 호출 + zod 스키마
  lib/        도메인 비의존 유틸
tests/        교차 기능 테스트와 테스트 설정
docs/         PRD · ARCHITECTURE · api · decisions(ADR) · phases
.ai/          스트림 상태 · 팀 공지 · 개인 메모리
scripts/      ai-start.sh · ai-end.sh · ai-stream.sh
```

의존 방향은 `app → features → { ui, api, lib }`이며 `features` 끼리 직접 import 하지 않는다.

## How We Work

개발자와 AI Agent가 같은 규칙으로 병렬 작업한다. 작업 단위는 **스트림**이다 — 브랜치 `ws/<id>` = `.ai/work/<id>/` = 소유자 1명 = Task 1개.

```bash
scripts/ai-stream.sh setup --local          # clone 후 한 번 (훅 · 커밋 템플릿 · git ai-log)
scripts/ai-stream.sh open 02/T1 <slug>      # 스트림 열기
scripts/ai-start.sh                         # 세션 시작 점검
scripts/ai-end.sh --ready                   # Task 완료 → PR 초안
```

규칙 전문은 [`AGENTS.md`](AGENTS.md), 협업 장치의 상세는 [`.ai/README.md`](.ai/README.md)에 있다. 스트림 PR의 base는 통합 브랜치 `dev`이고, 운영 배포는 `dev` → `main` 릴리스 PR이 일으킨다. 두 브랜치 모두 PR로만 바뀌고 병합은 merge commit이다.

## Design

디자인은 Figma를 따른다 — [어둠의 개발자·기획자·디자이너 모임](https://www.figma.com/design/tzWb3S2guXz5zH2DMeX8Yt/): 디자인시스템 `16-2` · [UI 최종 - 개발용 `558-2430`](https://www.figma.com/design/tzWb3S2guXz5zH2DMeX8Yt/?node-id=558-2430)(구현 기준) · [기능명세서 `560-2`](https://www.figma.com/design/tzWb3S2guXz5zH2DMeX8Yt/?node-id=560-2)(PRD 파생 요약). 디자인과 spec이 어긋나면 디자인이 우선한다. MVP(채팅 제외, API 연결 포함) 마감은 2026-09-17.
디자인 토큰과 공통 컴포넌트는 Phase 02에서 `src/ui/`로 코드화한다.
