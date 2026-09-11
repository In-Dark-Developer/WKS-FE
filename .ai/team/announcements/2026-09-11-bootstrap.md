# 2026-09-11 bootstrap — 템플릿이 운꿰사 프론트엔드 저장소가 되었다

- Required: yes
- Applies to: all
- Change: ADR-20260911-frontend-stack-and-repo-scope.md · PR #1
- Action: `AGENTS.md`(Project·Repository Map·Commands·Rule 13)와 `docs/PRD.md`·`docs/ARCHITECTURE.md`를 다시 읽는다. 스택은 TypeScript/React(Vite SPA)/Tailwind/pnpm이고 검증은 `pnpm test|typecheck|lint`다(설정은 Phase 01 T3에서 생성). 백엔드는 별도 저장소이며 `docs/api/openapi.yaml`은 참조본이다. `src/` 하위 모듈 경계와 의존 방향을 따르고, 코드 작성 규칙은 `docs/CONVENTIONS.md`를 읽는다.
- Until: Phase 01 종료
