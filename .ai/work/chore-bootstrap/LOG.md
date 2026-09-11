# Work Log — chore-bootstrap

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-12 · claude-code · 01/T1 · CI 에 스트림 소유자 검사 추가

- Commits: (feat(ai-end) 커밋)
- Done: `ai-end.sh --ci` 에 `chk_owner` — PR author(`PR_AUTHOR`)와 CURRENT 의 Owner(noreply 이메일 → 핸들)를 대조하고, main 의 Owner 와 달라졌으면 take 커밋을 요구. ci.yml 에 `PR_AUTHOR` 주입
- Not done: 기술적 강제(브랜치 보호·CODEOWNERS 리뷰 필수)는 private + Free 라 불가 — 그대로
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: PR 게이트만 막는다 — main 직접 push 와 take 커밋 제목 위조는 여전히 통과한다
- Verification: `--ci` 를 일치/불일치/PR_AUTHOR 없음/소유자 변경(take 유무) 경우로 실행, 각각 ok·FAIL·warn 확인

## 2026-09-11 · claude-code · 01/T1 · main 보호 결정 반영

- Commits: 446e552
- Done: 소유자 결정(③ 규칙·로컬 훅으로만 지킨다)을 Phase 01 AC7 에 반영 — 보호 규칙을 AC 에서 빼고 대체 수단과 재적용 조건(public 전환·유료 플랜 시 `setup` 재실행) 명시
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 이 PR 누적 — docs/PRD.md·docs/ARCHITECTURE.md 신규 작성, docs/api/openapi.yaml 을 백엔드 계약 참조본 초안으로 교체 (이번 세션 자체의 spec 변경은 없음)
- Needs your attention: main 직접 push 가 기술적으로 가능하다 — 팀에 알려야 한다
- Verification: 문서 변경만

## 2026-09-11 · claude-code · 01/T1 · Phase 02·03 Touches 를 파일 단위로

- Commits: (직전 작업 커밋)
- Done: Phase 02 를 T1~T5 로 재분할(토큰 → 폼/모달/카드·상태/앱셸 병렬), Phase 03 은 라우트 파일을 T3 단독 소유로. 각 PLAN 에 AC5(자기 Touches 안) 추가
- Not done: Phase 04~08 은 상세 계획이 없어 그대로 (각 계획 스트림에서)
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: `src/ui/` 배럴을 없앴다 — CONVENTIONS 의 배럴 규칙도 같이 바꿨다
- Verification: `ai-stream.sh phases` 재생성, 02/03 Task 수 5/5

## 2026-09-11 · claude-code · 01/T1 · 역할 메모리를 미추적 개인 영역으로

- Commits: e300ae0
- Done: `.gitignore` 에 `.claude/agent-memory/*`(README 제외) 추가, `.gitattributes` 의 `merge=union` 삭제, `AGENTS.md` Repository Map·Rule 9(close commit 대상)·Rule 15 수정, README 를 미추적 전제로 재기술, 공지에 한 줄 추가
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 팀이 나중에 공유하기로 하면 되돌리는 절차를 README 에 적어뒀다
- Verification: `git check-ignore -v .claude/agent-memory/<역할>/MEMORY.md` 로 제외 확인, 추적 파일은 README 하나

## 2026-09-11 · claude-code · 01/T1 · 역할 메모리 규약을 레포 안으로

- Commits: 389e9a0
- Done: `.claude/agent-memory/README.md` 재작성 — 형식(MEMORY.md 인덱스 + 토픽 파일)·기록 기준·갱신 시점·우선순위를 레포 안에 직접 기술, `~/` 경로 참조 제거
- Not done: 역할 에이전트·스킬 자체의 공유는 보류 — 절대 홈 경로 의존이라 이식 작업이 별도로 필요(ADR 대상)
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음 — 팀원은 개인 에이전트 설정 없이도 이 폴더 규약을 읽을 수 있다
- Verification: `grep '~/' .claude/agent-memory/README.md` 0건

## 2026-09-11 · claude-code · 01/T1 · CONVENTIONS 를 Truth·Loading 순서에 등록

- Commits: 2b785af
- Done: Rule 2 에 `docs/CONVENTIONS.md` 를 6위로 삽입(ARCHITECTURE 아래·PRD 위, 이하 한 칸 밀림), Rule 3 읽는 순서 끝에 "코드를 쓰기 전" 으로 추가, `.claude/agent-memory/README.md` 의 ⑩→⑪ 수정
- Not done: `.claude/agent-memory/README.md` 가 레포 밖 `~/.agents/skills/agent-memory-protocol` 을 규약 소유자로 지목하는 문제는 소유자 판단 대기
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 역할 에이전트·스킬을 팀에 공유할지, 아니면 레포에서 참조를 끊을지
- Verification: 문서 변경만

## 2026-09-11 · claude-code · 01/T1 · 개발 컨벤션 문서화

- Commits: 3385cfc
- Done: `docs/CONVENTIONS.md` 신규(타입·이름·컴포넌트·Tailwind·데이터·import·화면 상태·테스트·금지 항목), AGENTS.md Rule 13·Repository Map·README·공지에서 참조
- Not done: 도구 설정으로의 이관(ESLint 규칙화)은 Phase 01 T3
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: PRD·ADR·Phase 계획은 팀 회의 확정 전까지 병합하지 않는다
- Verification: 문서 변경만

## 2026-09-11 · claude-code · 01/T1 · 템플릿 → 운꿰사 프론트엔드 초기화

- Commits: b7304ab
- Done: PRD·ARCHITECTURE·openapi 참조본·스택 ADR·공지·Phase 01~08 계획·AGENTS/README 교체, BOOTSTRAP 삭제, 기획 메모를 `docs/product-brief.md`로 이동
- Not done: main 보호 규칙 — private 저장소 + GitHub Free 라 API가 403 (Pro 이거나 public 이어야 함). 병합 방식(merge commit 전용·PR 제목/본문)은 적용됨. 브랜치 자동 삭제는 소유자 요청으로 제외
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: docs/PRD.md·docs/ARCHITECTURE.md 신규 작성, docs/api/openapi.yaml 을 백엔드 계약 참조본 초안으로 교체
- Needs your attention: 모듈 Owner(GitHub 핸들), 백엔드 저장소·계약 공개 시점, Node 버전, main 보호 대안
- Verification: 문서 변경만 — `ai-stream.sh phases --check`, `announce --check` 통과

## 2026-09-11 · ai-stream · -/- · 스트림 열기

- Commits: (open)
- Done: 스트림 `chore-bootstrap` 생성 (브랜치 `ws/chore-bootstrap`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
