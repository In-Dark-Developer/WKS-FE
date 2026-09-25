# Phase 05 — friend-score · Result

<!-- Phase 종료 시 작성한다. PLAN.md와 대조해 사실만 적는다. 실행하지 않은 검증을 완료로 적지 않는다. -->

- Completed on: (Phase 04 종료 대기 — 아래 Not Completed)
- Final Status: (종료 조건 충족 전)
- Tag: `phase/05`

## Completed

- T1. Phase 05 상세 계획 (commit b9a58c2, PR #101)
- T2. 궁합 지도 퍼블리싱 — 달·궤도·등급별 구슬·인원 4칸·순위·빈 상태 (commit 573adfb, PR #99·#74)
- T3. 궁합 지도 라우트 `/me/map` 과 결과 화면 '지도 보기' (commit ea218bd, PR #99)
- T4. 공유·궁합 API — `getSharedResult`·`createCompatibility` 와 zod 경계 검증 (commit 27e78a1, PR #102)
- T5. SCR-06 방문자용 지도 변형 — 주인 닉네임 제목·부제, `/preview` 2상태 (PR #109)
- T7. 공유 링크 흐름 조립 — `/s/:shareId` loader·궁합 생성·결과 복귀 (commit 0a01628, PR #110)
- T8. 인트로 건너뛰기 2초 카운트다운 (commit 85999c7, PR #116)
- T9. 궁합 지도 애니메이션 — 등급 궤도·30초 회전·동작 줄이기 존중 (commit a763e6e, PR #114)
- T10. 공유 링크를 입력 먼저로 재조립 — 입력 → 대기 → 결과·궁합 → 지도 (commit 7851f37·b44fa5d, PR #117)

## Not Completed

- **Phase 종료 선언 자체** — `Depends on: 04` 인 Phase 04(Lead @gn00py48)가 아직 `PLANNED` 다. Phase 규칙상 선행 Phase 가 DONE 이어야 05 를 닫을 수 있다.
- AC3·AC6·AC8 의 **수동 검증 일부** (아래 Validation Results). 자동 검증과 브라우저 확인은 각 Task PR 에 기록돼 있다.

## Deviations from Plan

- **T6 은 없다** — 계획 초기의 SCR-07(별도 궁합 결과 화면)이 2026-09-15 소유자 결정으로 삭제되면서 함께 빠졌다. 공유받은 사람은 별도 랜딩·결과 화면 없이 **링크 주인의 궁합 지도 → 자기 결과 화면**으로 간다. 그래서 Task 는 T1~T10 중 9개다.
- **흐름 순서가 두 번 바뀌었다** — T7 은 '지도 먼저', T10 이 '입력 먼저'로 재조립했다(PR #117). 링크를 처음 받은 사람이 주인 지도부터 보면 자기 자리를 알 수 없다는 판단이었다.
- **담당 이동** — T5·T8 이 2026-09-15 계획 변경(PR #105)으로 @jjjung0921 에게 갔다. 퍼블리싱/연동 분리(공지 `2026-09-13-publishing-first`)를 따른 것이다.
- **Phase 종료 후 후속 수정이 여러 건 병합됐다** — 공유 대기 화면 최소 노출(#145·#148), 인스타 공유를 카드 저장으로(#147), 순위 아래 공유(#149). 기능 자체는 이 Phase 범위 안이고 QA 로 들어온 것이다.

## Important Decisions

- 공유받은 `shareId` 는 **탭 단위**(sessionStorage)로 보관한다 — 뒤로가기로 돌아온 입력 화면이 입력을 건너뛰지 않게 한다 (FR-6)
- 궁합 등급은 백엔드 응답 `tier` 를 그대로 쓴다 — 점수 구간을 프론트가 다시 계산하지 않는다
- 화면 컴포넌트는 `@/api` 를 import 하지 않는다. 응답 → 뷰 모델 변환은 feature 의 loader 가 한다 (공지 `publishing-first`)
- 궁합 지도 애니메이션은 `prefers-reduced-motion` 에서 멈춘다 (NFR-5)

## Validation Results

| Check | Command / Method | Result |
|-------|------------------|--------|
| Tests | `pnpm test` | pass — 100 files / 527 tests (2026-09-25 재실행) |
| Typecheck | `pnpm typecheck` | pass — 오류 0 |
| Lint | `pnpm lint` | pass — 경고 0 |
| Build | `pnpm build` | pass — 517 modules, 253ms |
| AC7 (의존 방향) | `src/features/friends/` 화면(.tsx)의 `@/api` import 검사 | pass — loader 만 `@/api` 를 쓴다 |

| AC | 방법 | 결과 |
|----|------|------|
| AC1·AC2·AC4·AC5 | T7·T10 loader·action·라우트 테스트 + 운영/목 브라우저 확인 | pass (PR #110·#117 에 기록 — 입력 → 대기 → 결과·궁합 → 지도, 뒤로 온 입력 폼, 재시도) |
| AC3 | 실제 백엔드로 브라우저 두 개(주인·방문자) 수동 1회 | **미실행** — 운영에 결과 2건·궁합 1건·LLM 2회가 생겨 미뤘다. 부분 확인만 있다(PR #110: 기존 테스트 링크로 궁합 200·순위 반영) |
| AC6 | T8 컴포넌트 테스트(가짜 타이머) + 실기기 1회 | 테스트 pass · **실기기 미실행** (PR #116 'Not done: 실기기 확인') |
| AC8 | 컴포넌트 테스트 + `/preview` 수동 + `prefers-reduced-motion` 에뮬레이션 | 테스트·데스크톱 `/preview` pass · **실기기(iOS Safari·Android Chrome) 미실행** (PR #114) |

- 남은 수동 검증 3건(AC3·AC6·AC8 실기기)은 **08/T6 출시 점검**에서 실기기로 함께 확인한다 — 같은 기기·같은 절차라 따로 돌리지 않는다.

## Follow-up Work

- Phase 04 종료(@gn00py48) → 이 Phase 를 `DONE` 으로 바꾸고 `ai-stream.sh tag 05`
- 08/T6 실기기 점검에서 AC3·AC6·AC8 확인 결과를 이 문서에 추가
