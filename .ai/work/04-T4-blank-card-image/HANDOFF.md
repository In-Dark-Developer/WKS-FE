# Handoff — 04-T4-blank-card-image

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: 04/T4

## Goal

'인스타 스토리 공유하기' PNG 에 카드(배경·캐릭터·글자·스탬프)가 그대로 담긴다 — 소유자 실기기에서 흰 이미지 제보(2026-09-15).


## Work Completed

- 원인 1: html-to-image 가 프레임의 계산된 스타일(position fixed, left -2160px)을 사본에 복사 → SVG 안에서 캔버스 밖에 그려져 투명 PNG. `toBlob` 에 `style: { position: 'static', left: '0', top: '0' }`
- 원인 2: 사본 img 가 디코딩 전 → `img.decode()` 대기(실패는 넘김)
- 원인 3: WebKit 이 SVG 안 이미지를 첫 그리기에 빠뜨림 → 한 장 버리고 두 번째 사용
- 테스트 3개 추가·수정 (commit e42f429)


## Work In Progress

- 없음


## Files Changed

- `src/lib/cardImage.ts` · `src/lib/cardImage.test.ts`


## Decisions Made

- 두 번 그리기는 WebKit 만이 아니라 항상 한다 — 브라우저 판별 분기를 두지 않는다. 공유 버튼을 누른 뒤 잠깐 더 걸린다


## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 목 모드 dev 서버에서 Playwright WebKit 으로 새 페이지 첫 캡처·연속 캡처(앞면·뒷면 상태) PNG 확인


## Test Results

- 258 tests 통과 · 수정 전: 전부 투명(36KB), style 만 고쳤을 때 첫 장은 캐릭터·배경 누락(346KB) · 최종: 세 장 모두 카드 전체(1.5MB, 동일)


## Known Problems

- 파일 이름이 `닉네임-인연카드.png` 그대로 (범위 밖)
- 실기기(iOS 카카오톡·Safari) 확인은 배포 후


## Unverified Assumptions

- Playwright WebKit 결과가 iOS WebKit 과 같다


## Exact Next Action

배포 후 폰에서 인스타 스토리 공유 이미지 확인.
