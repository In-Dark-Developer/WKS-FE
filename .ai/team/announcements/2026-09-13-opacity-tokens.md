# 2026-09-13 opacity-tokens — 반투명 카드·오버레이는 Opacity 토큰으로 쓴다

- Required: yes
- Applies to: touches:src/
- Change: src/ui/tokens/theme.css · docs/CONVENTIONS.md 4장 · PR (chore-opacity-tokens)
- Action: Figma `Opacity/*` 변수 10개가 토큰이 됐다 — `Opacity/Card/Neutral-0/50%` → `bg-opacity-card-neutral-0-50`, `Opacity/Card/Apricot-50/50%` → `bg-opacity-card-apricot-50-50`, `Opacity/Overlay/Neutral-900/80%` → `bg-opacity-overlay-neutral-900-80`. 반투명 배경에 `bg-neutral-0/50` 같은 투명도 표기나 `bg-[rgba(…)]`를 쓰지 않는다. Figma 에 없는 투명도가 필요하면 디자인에 변수 추가를 먼저 요청한다.
- Until: Phase 08 종료
