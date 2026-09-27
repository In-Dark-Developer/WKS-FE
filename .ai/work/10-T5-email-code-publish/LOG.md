# Work Log — 10-T5-email-code-publish

<!-- 소유자 보고. 세션마다 맨 위에 추가(최신순), 제목은 `## YYYY-MM-DD · <agent> · <phase>/<task> · <한 줄 요약>`, 항목당 8줄 이내. PR 본문 초안(ai-end.sh --ready)의 재료가 된다. -->

## 2026-09-27 · claude-code · 10/T5 · V1 코드 인증 포함으로 되돌림

- Commits: ffb0b7c
- Done: 이후 버전 표기 제거, /preview 기본 (2/2) 에 인증 버튼, 상태 이름 정리
- Not done: 없음
- Upstream changes: spec #248(V1 코드 인증 포함) 병합 반영
- Spec changes: 없음
- Needs your attention: 10/T1 이 `emailVerification` 을 연결해야 실제 등록이 403 을 피한다
- Verification: test 593 · typecheck · lint · 브라우저 (2/2) 기본 확인

## 2026-09-27 · claude-code · 10/T5 · 학교 메일 도메인 검사, 코드 인증 UI 보관

- Commits: 146612c
- Done: (2/2) 이메일 `@dgu.ac.kr` 만 통과, 코드 인증 UI 는 선택 prop·/preview 로만 남김
- Not done: 없음
- Upstream changes: spec #245(도메인만 확인) 병합 반영
- Spec changes: 없음
- Needs your attention: WKS-BE 의 403 DATING_NOT_VERIFIED 요구 제거 필요
- Verification: test 593 · typecheck · lint · 브라우저 확인

## 2026-09-27 · ai-stream · 10/T5 · 스트림 열기

- Commits: (open)
- Done: 스트림 `10-T5-email-code-publish` 생성 (브랜치 `ws/10-T5-email-code-publish`)
- Not done: 없음
- Developer changes: 없음
- Upstream changes: 없음
- Spec changes: 없음
- Needs your attention: 없음
- Verification: 없음
