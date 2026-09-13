# 2026-09-13 design-tokens — 스타일은 Figma 이름 그대로의 토큰 클래스로만 쓴다

- Required: yes
- Applies to: all
- Change: ADR-20260913-design-tokens-and-fonts.md · src/ui/tokens/theme.css · src/lib/cn.ts · eslint.config.js · PR (02-T1-tokens)
- Action: Tailwind 기본 색·간격·radius·글자 크기 스케일이 없어졌다 — Figma 이름이 클래스 이름이다: Space/16 → `p-16`(16px, `p-4`는 4px), Radius/12 → `rounded-12`, UI/14/600 → `text-ui-14 font-semibold`, Display/24 → `font-display text-display-24`, Text/Primary → `text-primary`, Border/Default → `border-default`, Surface/Subtle → `bg-surface-subtle`, Action/Primary/Default → `bg-action-primary-default`, 램프 `bg-primary-500`. 목록에 없는 클래스는 CSS 가 생성되지 않으니 `src/ui/tokens/theme.css`에서 이름을 찾는다. 조건부 클래스는 `@/lib/cn`의 `cn()`으로 합치고, hex·`rgb()` 같은 임의 색상은 `pnpm lint`가 실패시킨다. T2~T5 는 `git merge main` 후 시작한다.
- Until: Phase 08 종료
