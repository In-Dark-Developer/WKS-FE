# Phase 01 — project-setup

- Status: IN_PROGRESS
- Lead: @jjjung0921
- Depends on: none
- Start: 2026-09-11 · End: TBD

## Goal

템플릿이 운꿰사 프론트엔드 저장소가 되어, 어떤 Agent든 `AGENTS.md`의 Commands로 test/typecheck/lint를 경고 없이 실행할 수 있고, 저장소 설정이 끝나 화면 Phase들을 병렬로 시작할 수 있는 상태.

## Motivation

이후 모든 Phase가 같은 규칙·spec·검증 명령·병합 규칙 위에서 진행되려면 그 기반이 먼저 있어야 한다. 이 Phase가 끝나기 전에는 기능 구현을 시작하지 않는다.

## Scope

- 템플릿 placeholder를 프로젝트 내용으로 교체 (`AGENTS.md`, `README.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/api/openapi.yaml` 참조본)
- 스택 결정과 ADR 기록, 팀 공지
- 제약 층 구성: pnpm·Vite·TypeScript·Tailwind·Vitest·ESLint·Prettier 설정과 버전 고정, lockfile
- 최소 실행 가능한 스켈레톤과 테스트 1개 이상
- 전체 개발 계획을 Phase 그래프(Depends on)로 정리
- 저장소 설정: main 보호 · merge commit 전용 · CODEOWNERS · CI

## Out of Scope

- 실제 화면·기능 구현 (Phase 02 이후)
- 배포 인프라·도메인·호스팅 (Phase 08)
- 디자인 토큰 코드화 (Phase 02)

## Dependencies

- 소유자 결정: 백엔드 저장소 위치와 API 계약 공개 시점, 모듈별 Owner(GitHub 핸들), Node 버전
- `docs/product-brief.md`의 기획, Figma 디자인

## Tasks

- [x] T1. spec·계획 초기화 — Done when: `AGENTS.md`·`README.md`·`docs/PRD.md`·`docs/ARCHITECTURE.md`·`docs/api/openapi.yaml`에 placeholder가 없고 Phase 그래프가 있다 · Touches: `.` · Owner: @jjjung0921 (commit 05afd1a, PR #1 · #3)

- [x] T2. 모듈 Owner 확정 → `.github/CODEOWNERS` 생성 — Done when: `docs/ARCHITECTURE.md` Module Boundaries의 Owner 열이 GitHub 핸들로 채워지고 `scripts/ai-stream.sh codeowners --check`가 통과 · Touches: `docs/ARCHITECTURE.md`, `.github/CODEOWNERS`, `docs/phases/` · Owner: @jjjung0921 (commit 5ae8334)

- [x] T3. 제약 층 구성 — Done when: Commands의 install/test/typecheck/lint가 클린 체크아웃에서 경고 없이 성공 · Touches: `package.json`, `pnpm-lock.yaml`, `.nvmrc`, `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `.prettierrc`, `.gitignore` · Owner: @jjjung0921 (commit 0061995)
  - 만들 파일: `package.json`(`packageManager: pnpm@<버전>`, 스크립트 `dev`·`build`·`test`·`typecheck`·`lint`), `pnpm-lock.yaml`, `.nvmrc`(Node major 고정)
  - `tsconfig.json` — `"strict": true`, `"noUncheckedIndexedAccess": true`, `"verbatimModuleSyntax": true`, 경로 별칭 `@/* → src/*`
  - `vite.config.ts` — React 플러그인 + `@tailwindcss/vite`, `vitest.config.ts` — jsdom + `tests/setup.ts`
  - `eslint.config.js`(flat, typescript-eslint + react-hooks + import 경계 규칙), `.prettierrc`
  - 경고=실패: `pnpm lint` = `eslint . --max-warnings=0 && prettier --check .`, `tsc --noEmit`
  - `.gitignore`에 `node_modules/`, `dist/`, `coverage/`, `.vite/` 추가

- [x] T4. 최소 실행 스켈레톤 + 테스트 — Done when: `pnpm dev`로 라우팅된 빈 화면이 뜨고 테스트 1개 이상이 통과 · Touches: `index.html`, `src/`, `tests/`, `vitest.config.ts`, `tsconfig.json` · Owner: @jjjung0921 (commit 61b0728)

- [x] T5. CI에서 Commands 실행 — Done when: `.github/workflows/ci.yml`의 commands 잡이 실제 pnpm 명령을 돌리고 PR에서 통과 · Touches: `.github/workflows/ci.yml`, `tsconfig.json` · Owner: @jjjung0921 (commit 024da75)

- [x] T6. 백엔드 계약 동기화 — Done when: 백엔드 api-spec.md(2026-09-13)와 `docs/api/openapi.yaml` 참조본(`/results` · `/results/{id}` · `/results/{id}/compatibility` · `/signups` · `/signups/resend` · `/signups/verify` · `/health`, 공통 봉투)이 일치하고, 디자인·기획과의 차이가 PRD Q3·Q7·Q14와 백엔드 문의 목록(`.ai/work/spec-planning-feedback-0913/notes/backend-questions.md`)으로 등록됨. 백엔드 답변 반영은 Phase 03 T1이 계약 필드로 시작한 뒤 후속 spec 스트림으로 한다 · Touches: `docs/api/openapi.yaml` · Owner: @jjjung0921 (commit 13e3691, PR #15)

## Relevant Specifications

- `docs/PRD.md` — 전체
- `docs/ARCHITECTURE.md` — Module Boundaries, Dependency Direction
- `docs/decisions/ADR-20260911-frontend-stack-and-repo-scope.md`

## Acceptance Criteria

- [x] AC1. `AGENTS.md`, `README.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`에 placeholder(`<...>`)와 작성 지침 주석이 남아 있지 않다
- [ ] AC2. `AGENTS.md` Commands의 모든 명령이 클린 체크아웃에서 경고 없이 성공한다 (typecheck·lint는 경고=실패 옵션으로 실행)
- [x] AC3. 스택 결정 ADR이 존재하고 `docs/ARCHITECTURE.md`가 이를 참조한다
- [x] AC4. `docs/phases/README.md` 표가 PLAN 머리들과 일치하고 Phase 02·03 PLAN이 상세하게 존재한다
- [x] AC5. 툴체인 버전 고정 파일(`.nvmrc`, `packageManager`), `pnpm-lock.yaml`, 도구 설정 파일이 커밋되어 있고 `.gitignore`에 Node 항목이 있다
- [x] AC6. `AGENTS.md` Rule 13에 언어별 규칙이 3줄 이내로 있고 마지막 줄이 허용 언어 목록이며, 스택 ADR에 도구 선택 이유가 있다
- [ ] AC7. 병합 방식이 merge commit뿐이고 `.github/CODEOWNERS`가 ARCHITECTURE의 Owner 열과 일치한다. main 보호 규칙은 걸지 않는다 — private + GitHub Free 제약으로 규칙(`AGENTS.md` Rule 9)과 로컬 훅·CI로 대체하기로 결정했다(2026-09-11). 저장소가 public이 되거나 유료 플랜이 되면 `ai-stream.sh setup`을 다시 실행한다
- [x] AC8. CI가 PR에서 install/test/typecheck/lint와 `ai-end.sh --ci`를 돌린다

## Validation Plan

- AC1: `grep -n "<" AGENTS.md README.md docs/PRD.md docs/ARCHITECTURE.md` 출력에 placeholder·지침 주석이 없는지 확인
- AC2·AC5: 새로 클론한 디렉터리에서 Install → Test → Typecheck → Lint 순으로 실행
- AC3·AC4·AC6: 해당 파일 확인, `scripts/ai-stream.sh phases --check`
- AC7: `scripts/ai-stream.sh setup --check` 출력에서 병합 방식 확인(보호 규칙 없음이 정상), `scripts/ai-stream.sh codeowners --check`
- AC8: PR에서 두 잡이 모두 초록인지 확인
