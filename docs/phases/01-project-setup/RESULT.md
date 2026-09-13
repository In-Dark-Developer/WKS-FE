# Phase 01 — project-setup · Result

<!-- Phase 종료 시 작성한다. PLAN.md와 대조해 사실만 적는다. 실행하지 않은 검증을 완료로 적지 않는다. -->

- Completed on: 2026-09-13
- Final Status: DONE
- Tag: `phase/01`

## Completed

- T1. 템플릿을 운꿰사 프론트엔드로 초기화하고 Phase 그래프(01~08)를 작성, PR 작성자 ≠ 스트림 소유자면 CI 실패 (commits 05afd1a, PR #1 · #3)
- T2. ARCHITECTURE Module Boundaries Owner 열을 GitHub 핸들로 채우고 CODEOWNERS 생성 (commit 5ae8334, PR #7)
- T3. pnpm·Vite·TypeScript·Tailwind v4·Vitest·ESLint·Prettier 버전 고정과 경고=실패 설정 (commit 0061995, PR #9)
- T4. 라우팅된 최소 스켈레톤과 테스트 (commit 61b0728, PR #10)
- T5. CI commands 잡이 실제 pnpm install/test/typecheck/lint 실행 (commit 024da75, PR #11)
- T6. 백엔드 api-spec.md(2026-09-13)와 `docs/api/openapi.yaml` 참조본 일치, 차이는 PRD Q3·Q7·Q14로 등록 (commit 13e3691, PR #15 · #19)

## Not Completed

- 없음 — AC1~AC8 충족

## Deviations from Plan

- T6(백엔드 계약 동기화)은 착수 후 추가된 Task다 — 백엔드가 2026-09-13에 계약을 공개해 Phase 03 T1 전에 참조본을 맞춰야 했다.
- main 보호 규칙은 걸지 않았다 — private + GitHub Free 제약(403). 규칙(AGENTS.md Rule 9)·로컬 훅·CI로 대체 (AC7에 기록된 2026-09-11 결정).
- 계획에 없던 협업 도구가 Phase 기간에 들어왔다: Notion Task 보드·색인 동기화(PR #2 · #6 · #17 · #33 · #34), PR 본문 자동 채움(#14), GitHub track 이슈로 스트림 열기(#32), Task 선후 `After:`(#35).
- 기획·디자인 피드백으로 spec이 여러 번 갱신됐다: 디자인 우선 PRD(#13), 태어난 지역 제거(#16), 백엔드 소스 대조(#18), 세션 토큰·연락처·채팅 제외(#37).

## Important Decisions

- 스택과 저장소 범위 → ADR-20260911-frontend-stack-and-repo-scope
- Notion 보드·색인 동기화 → ADR-20260912-notion-task-board-sync, ADR-20260912-notion-board-rows-for-streams, ADR-20260913-notion-index-sync
- 병합은 merge commit만(squash·rebase 끔), main 보호 없음(플랜 제약)

## Validation Results

| Check     | Command / Method | Result              |
|-----------|------------------|---------------------|
| Install   | 새 클론(ded7ee6)에서 `pnpm install --frozen-lockfile` | pass |
| Tests     | 새 클론에서 `pnpm test` | pass, 32 tests |
| Typecheck | 새 클론에서 `pnpm typecheck` | pass |
| Lint      | 새 클론에서 `pnpm lint` (`--max-warnings=0` + prettier --check) | pass |
| AC1       | `grep` placeholder·지침 주석 | 남은 것 없음 (`<id>` 등은 문법 표기) |
| AC3·AC4   | ARCHITECTURE의 ADR 참조 확인, `scripts/ai-stream.sh phases --check` | pass |
| AC5·AC6   | `.nvmrc`·`packageManager`·lockfile·`.gitignore`, AGENTS.md Rule 13 확인 | pass |
| AC7       | `scripts/ai-stream.sh setup --check` (merge_commit=true squash=false rebase=false, 보호 규칙 없음), `codeowners --check` | pass |
| AC8       | PR #42 CI `commands` 잡 | pass |

## Known Issues

- `delete_branch_on_merge=false` — 병합된 `ws/*` 원격 브랜치가 남아 `ai-stream.sh gc`가 그 스트림 디렉터리를 지우지 못한다.
- Phase 03 T1이 기준으로 삼는 백엔드 계약이 참조본 동기화(2026-09-13 15:18) 이후 다시 바뀌었다(결과 조회 API, 등급 6단계, 궁합 구간).

## Follow-up Work

- 백엔드 계약 재대조 → Phase 03 T1·T2 착수 전 spec 스트림
- 배포 인프라·도메인 → Phase 08
