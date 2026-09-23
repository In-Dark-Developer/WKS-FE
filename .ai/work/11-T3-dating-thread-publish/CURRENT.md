# Current State — 11-T3-dating-thread-publish

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 11-T3-dating-thread-publish
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/11-T3-dating-thread-publish
- Task: 11/T3
- Issue: none
- Touches: src/features/dating/, src/ui/, src/app/preview/screens/
- Supersedes: none
- Acked: none

## Current Phase

11-dating-thread — `docs/phases/11-dating-thread/PLAN.md`

## Current Task

T3. 해금·운명의 실·요청함 퍼블리싱

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- Figma 76-3401·76-3400 읽기, 에셋 6개(webp) 반입
- ui: LockedValue(자물쇠 알약) · Tabs(요청함 탭)
- 해금 모달(다중 선택·합계·이미 연 항목·잔액 부족) · 구매 완료(1~4개)
- 운명의 실 확인·보낸 뒤 모달 · DatingDialog(닫기 없는 가운데 모달)
- 카드 앞·뒷면 CandidateFaces 로 분리 — 일부 해금 시 항목별 알약
- 요청함 목록·탭·상세 카드(대기 취소·실패·수락/거절) · preview 3화면 · test 442

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`2c7a29d`

## Relevant Documents

- `docs/phases/11-dating-thread/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/card/CandidateFaces.tsx:CandidateBack` · `unlock/UnlockDialog.tsx` · `thread/ThreadDialogs.tsx` · `requests/RequestInbox.tsx` · `src/ui/LockedValue.tsx` · `src/ui/Tabs.tsx`

## Next Action

PR 리뷰 대응. 병합 뒤 11/T1(강근우)·T2 가 이 컴포넌트에 데이터를 잇는다.
