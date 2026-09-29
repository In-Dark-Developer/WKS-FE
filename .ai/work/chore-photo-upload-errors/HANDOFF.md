# Handoff — chore-photo-upload-errors

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: 10/T21

## Goal

사진 업로드가 실패하면 무엇을 고쳐야 하는지 문구만 보고 알 수 있다.

## Work Completed

- `uploads.ts` — `PhotoUploadFailure` 7가지(type·size·pixels·unreadable·auth·rejected·network)를 돌려준다
- 화소 사전 검사(`createImageBitmap`) — 백엔드가 저장 때 거절하던 2천만 화소를 고를 때 걱러낸다
- `photoErrorMessage` · `toProfileSubmitError` — 원인별·오류 코드별 문구
- `DetailsStep` 안내 문구를 Figma 134:3639 그대로('JPEG·PNG, 최대 10MB로 등록해주세요.')
- 미리보기 상태 10개 추가 — 로그인 없이 모든 안내를 볼 수 있다

## Work In Progress

- 없음

## Files Changed

- commit de79e24 참조 (src/api/uploads.ts, src/features/dating/, src/app/preview/)

## Decisions Made

- `uploadDatingPhoto` 의 반환값을 `ApiOutcome` 에서 도메인 결과로 바꿨다 — 문구를 api 계층에 두지 않는다
- S3 4xx 는 'rejected'(다시 고르기), 5xx 는 'network'(다시 시도) 로 나눴다
- `createImageBitmap` 이 없는 환경은 화소 검사를 건너뛴다 — 막는 것은 편의고 판정은 백엔드가 한다

## Tests Executed

- `npx vitest run --pool=forks` · `pnpm typecheck` · `pnpm lint`
- 브라우저: `/preview/dating-profile` 의 새 상태 10개

## Test Results

- 742 중 741 통과 — 실패한 `openingGate.test.ts` 는 이 변경 전에도 같이 실패하는 node v24 ICU 로케일 문제다
- typecheck · lint 통과

## Known Problems

- `DetailsStep.tsx` 는 10-T1-profile-form-narrow-width(nicerjs23) 와 겹친다 — 병합 순서에 따라 충돌이 날 수 있다
- 백엔드가 저장 때 사진을 거절하는 이유를 모두 `INVALID_INPUT` 로 보낸다 — 화면은 사진 문제로 묶어 안내한다
- 리롤 비용이 BE 에서 5실 → 20실 로 바뀜었다(49d8c32) — FE 문구 확인이 필요하다(이 스트림 밖)

## Unverified Assumptions

- `createImageBitmap` 이 실패하는 파일은 백엔드 ImageIO 도 열지 못한다고 보았다

## Exact Next Action

PR 을 dev 로 올린다.
