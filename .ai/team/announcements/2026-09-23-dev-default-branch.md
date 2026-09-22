# 2026-09-23 dev-default-branch — 스트림은 이제 `dev` 로 PR 한다

- Required: yes
- Applies to: all
- Change: ADR-20260923-dev-as-default-branch.md
- Action: 새 스트림은 `dev` 에서 갈라진다(`ai-stream.sh open` 이 알아서 한다). 동기화는 `git merge main`
  이 아니라 **`git merge dev`**, Task 완료 절차도 `git merge dev` → `ai-end.sh --ready` 다. PR base 는
  `dev` — 이 공지 전에 열어 둔 PR 은 base 가 `main` 이니 그대로 병합한다. 운영 배포는 `dev` → `main`
  릴리스 PR 이 일으킨다(Netlify 는 계속 `main` 을 빌드한다). 스크립트의 `main_ref()` 는 `integ_ref()` 로
  바뀌었다 — 직접 부르는 개인 스크립트가 있으면 고친다.
- Until: Phase 08 종료
