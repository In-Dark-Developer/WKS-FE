# Handoff — chore-replace-card-back-and-loading-video

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/- (chore)

## Goal

디자이너가 교체한 인연카드 뒷면 이미지와 점지 대기 영상이 화면에 그대로 반영되고, 교체 때문에 첫 화면이 무거워지지 않는다.

## Work Completed

- 소유자가 `card-back.webp`·`fortune-loading.mp4` 를 교체했다
- `ConnectionCard.css` — 예전 이미지(351×469, 그림자 여백 4px 포함) 기준의 오버행 보정을 없애고 칸을 그대로 채우게 했다(`inset: 0` + `object-fit: cover`)
- `card-back.webp` 를 손실 WebP q90 으로 다시 인코딩했다 — **1160KB → 160KB(-86%)**, 크기(1097×1466)·알파 그대로, PSNR 42.7dB

## Work In Progress

- 없음

## Files Changed

- `src/ui/assets/cards/card-back.webp` · `src/ui/assets/video/fortune-loading.mp4` · `src/features/share/card/ConnectionCard.css`

## Decisions Made

- **칸 비율을 앞면과 같은 `349/461` 로 유지했다.** 교체본 비율은 ≈343:461 로 1.2% 좁지만, 칸을 343 으로 바꾸면 뒤집을 때 카드 폭·높이가 흔들린다. `object-fit: cover` 로 좌우를 아주 조금 덜어내 늘어짐 없이 채운다.
- **무손실로 온 카드를 손실 q90 으로 다시 인코딩했다.** 결과 화면은 뒷면부터 보여 이 이미지가 첫 페인트를 막는다 — 1.16MB 는 4G 에서 LCP(NFR-2 < 2.5s)를 직접 해친다. 무손실 원본은 `%TEMP%\card-back-lossless-original.webp` 에 백업했다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · 재인코딩 전후 PSNR·알파 비교

## Test Results

- 354 tests 통과 · typecheck · lint 경고 0 · build 성공
- 산출물 — `card-back` 164.29KB(이전 1188.22KB) · `fortune-loading` 971.15KB · 초기 JS gzip 160.25KB(NFR-2 예산 250KB 안)

## Known Problems

- 없음

## Unverified Assumptions

- **디자이너 기준 치수(343×461)와 구현 앞면(349×461)이 다르다.** Figma 에 둘 다 있다 — 구 점지 카드 `731:4668`(343) · 현 사주 카드 화면 `658:5102`(349, 04/T8 기준). 1.2% 라 `cover` 로 흡수했고 육안 차이는 없지만, 앞·뒷면 기준 치수는 디자인 쪽에서 하나로 맞추는 편이 낫다.
- 교체본이 실기기에서 의도대로 보이는지는 `pnpm dev` 로 눈 확인이 필요하다 — 재인코딩 화질은 수치로만 확인했다.
- 영상에 오디오 트랙(AAC)이 남아 있다. `muted` 로 재생하므로 빼면 용량이 조금 더 준다(이번에는 손대지 않았다 — 도구 없음).

## Exact Next Action

`pnpm dev` 로 결과 화면 뒷면과 대기 영상을 눈으로 확인한 뒤 PR 을 올린다.
