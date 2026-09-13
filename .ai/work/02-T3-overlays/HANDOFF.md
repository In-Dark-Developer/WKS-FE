# Handoff — 02-T3-overlays

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 02/T3

## Goal

`Modal`·`ShareSheet`·`Toast`가 포커스 트랩·ESC 닫기·배경 스크롤 잠금(Modal·ShareSheet)과 자동 닫힘(Toast)을 갖추고 렌더·동작 테스트를 통과한다.

## Work Completed

- `Modal.tsx`: `useOverlayBehavior(open, onClose)` 공용 훅 — 열릴 때 첫 포커스 이동·Tab 트랩·Escape 닫기·`document.body.overflow` 잠금, 닫히면 이전 포커스로 복원. `OverlayBackdrop`(누르면 닫히는 배경, `tabIndex=-1`+`aria-hidden`으로 키보드 순서·AT에서는 뺌)도 같은 파일에서 export해 ShareSheet가 재사용
- `Modal.tsx`의 `Modal` — 가운데 정렬 다이얼로그, 제목 없으면 헤더는 닫기 버튼만
- `ShareSheet.tsx` — `useOverlayBehavior` 재사용한 바텀시트, `options: {id,icon,label,onSelect}[]` 받아 목록으로 그림. 고르면 `onSelect` 뒤 자동으로 `onClose`
- `Toast.tsx` — `duration`(기본 3000ms) 뒤 자동 `onClose`. 모달이 아니라 포커스는 안 가져가고 `role="status"`+`aria-live="polite"`로만 알림
- 세 파일 다 기존 오버레이 토큰(`bg-opacity-overlay-neutral-900-80`) 사용, 새 토큰 필요 없었음
- 테스트 16개(포커스 트랩 순환, 배경 클릭, ESC, 스크롤 잠금/복원, 포커스 복원, 옵션 선택, 타이머)
- (소유자 제안) `src/app/preview/screens/overlays.tsx` 추가 — 버튼 3개로 각 컴포넌트를 열어보는 확인용
  화면. `pnpm dev`+playwright로 실제 브라우저에서 눌러봄: 포커스 트랩·ESC·배경클릭 닫기·스크롤
  잠금/복원·ShareSheet 선택 시 자동 닫힘·Toast 자동 소멸 전부 확인, 콘솔 에러 0건, 스크린샷으로
  스타일도 확인(카드·바텀시트·토스트 다 토큰대로 렌더됨)

## Work In Progress

- 없음 — 구현·테스트·실사용 확인 끝, push 승인 대기

## Files Changed

- `src/ui/Modal.tsx`, `Modal.test.tsx`, `ShareSheet.tsx`, `ShareSheet.test.tsx`, `Toast.tsx`, `Toast.test.tsx` (전부 신규)
- `src/app/preview/screens/overlays.tsx`(신규, Touches 밖 → 소유자 제안으로 추가, CURRENT Touches 갱신함)

## Decisions Made

- 포커스 트랩·ESC·스크롤 잠금 로직을 `Modal.tsx`에서 `useOverlayBehavior`로 뽑아 `ShareSheet`도 같이 쓰게 했다(Touches가 이 두 파일뿐이라 새 공용 파일을 못 만듦) — 시각(가운데 정렬 vs 바텀시트)만 각자 그린다
- 이 Task엔 특정 Figma 프레임 번호가 안 적혀 있어(다른 Task와 달리) 디자인시스템 토큰·기존 컴포넌트(Card·Notice·IconButton) 관례로 만들었다 — 정확한 프레임과 다를 수 있음(아래 Known Problems)
- Toast는 전역 provider 없이 `open`/`message`/`onClose`를 받는 controlled 컴포넌트로 뒀다 — `src/app/`은 Touches 밖이라 전역 마운트는 실제로 쓰는 Task(예: 공유 폴백)가 한다

## Tests Executed

- `pnpm test`(45개 파일, 신규 3개)·`typecheck`·`lint`·`build`
- `pnpm dev` 실사용 확인(playwright): Modal·ShareSheet·Toast 각각 버튼으로 열어 동작·스타일 확인

## Test Results

- 201/201 통과, typecheck·lint·build 전부 통과. 실제 구동 확인도 통과(콘솔 에러 0)

## Known Problems

- Figma 정확한 프레임을 대조하지 못했다(이 Task Done-when에 프레임 번호가 없어 접근 안 함) — 나중에 디자인 검수에서 여백·크기가 조정될 수 있다
- `/preview/overlays`에서 실제로 열어봐 동작은 확인했지만, 세 컴포넌트 다 아직 실제 화면(공유 버튼 등)에는 안 쓰인다 — 진짜로 붙여보기 전까지 props 모양이 안 맞을 가능성은 남아 있음

## Unverified Assumptions

- 없음

## Exact Next Action

소유자 push 승인 → `git merge main` → `scripts/ai-end.sh --ready`로 PR.
