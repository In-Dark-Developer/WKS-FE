# Team — 공지 색인

<!-- `scripts/ai-stream.sh announce` 가 아래 표를 생성한다. 손으로 고치지 않는다. 공지 형식은 announcements/_template.md -->

<!-- announcements:begin -->
| 공지 | Required | Applies to | Until |
|------|----------|------------|-------|
| [2026-09-14-result-ownership](announcements/2026-09-14-result-ownership.md) | yes | all | Phase 08 종료 |
| [2026-09-14-netlify-personal-fork](announcements/2026-09-14-netlify-personal-fork.md) | no | all | Phase 08 종료 |
| [2026-09-14-domain-threadoffate](announcements/2026-09-14-domain-threadoffate.md) | no | all | Phase 08 종료 |
| [2026-09-14-aws-cloudfront-hosting](announcements/2026-09-14-aws-cloudfront-hosting.md) | no | all | Phase 08 종료 |
| [2026-09-13-workers-static-assets](announcements/2026-09-13-workers-static-assets.md) | no | all | Phase 08 종료 |
| [2026-09-13-task-after](announcements/2026-09-13-task-after.md) | yes | all | Phase 08 종료 |
| [2026-09-13-session-token-and-contact](announcements/2026-09-13-session-token-and-contact.md) | yes | all | Phase 08 종료 |
| [2026-09-13-session-module-owner](announcements/2026-09-13-session-module-owner.md) | yes | touches:src/api/ | Phase 03 종료 |
| [2026-09-13-server-state-session](announcements/2026-09-13-server-state-session.md) | yes | all | Phase 08 종료 |
| [2026-09-13-screen-ownership](announcements/2026-09-13-screen-ownership.md) | yes | all | Phase 06 종료 |
| [2026-09-13-publishing-first](announcements/2026-09-13-publishing-first.md) | yes | touches:src/ | Phase 08 종료 |
| [2026-09-13-planning-feedback](announcements/2026-09-13-planning-feedback.md) | yes | all | Phase 07 종료 |
| [2026-09-13-opacity-tokens](announcements/2026-09-13-opacity-tokens.md) | yes | touches:src/ | Phase 08 종료 |
| [2026-09-13-notion-index-sync](announcements/2026-09-13-notion-index-sync.md) | yes | all | Phase 08 종료 |
| [2026-09-13-issue-link](announcements/2026-09-13-issue-link.md) | yes | all | Phase 08 종료 |
| [2026-09-13-hosting-domains](announcements/2026-09-13-hosting-domains.md) | no | all | Phase 08 종료 |
| [2026-09-13-form-owner-change](announcements/2026-09-13-form-owner-change.md) | no | all | Phase 03 종료 |
| [2026-09-13-drop-birth-region](announcements/2026-09-13-drop-birth-region.md) | yes | docs/phases/03-saju-reading/, src/features/saju/, src/api/ | Phase 03 종료 |
| [2026-09-13-design-tokens](announcements/2026-09-13-design-tokens.md) | yes | all | Phase 08 종료 |
| [2026-09-13-cloudflare-pages](announcements/2026-09-13-cloudflare-pages.md) | no | all | Phase 08 종료 |
| [2026-09-13-backend-contract](announcements/2026-09-13-backend-contract.md) | yes | all | Phase 08 종료 |
| [2026-09-13-backend-contract-r2](announcements/2026-09-13-backend-contract-r2.md) | yes | touches:src/ | Phase 03 종료 |
| [2026-09-12-pr-body-autofill](announcements/2026-09-12-pr-body-autofill.md) | yes | all | Phase 08 종료 |
| [2026-09-12-notion-board-sync](announcements/2026-09-12-notion-board-sync.md) | yes | all | Phase 08 종료 |
| [2026-09-12-design-first-prd](announcements/2026-09-12-design-first-prd.md) | yes | all | Phase 08 종료 |
| [2026-09-12-commit-type-ci](announcements/2026-09-12-commit-type-ci.md) | yes | all | Phase 08 종료 |
| [2026-09-12-board-rows-for-streams](announcements/2026-09-12-board-rows-for-streams.md) | yes | all | Phase 08 종료 |
| [2026-09-11-bootstrap](announcements/2026-09-11-bootstrap.md) | yes | all | Phase 01 종료 |
<!-- announcements:end -->

- 공지는 팀 전체가 행동해야 하는 변경(AGENTS.md·ARCHITECTURE·API의 breaking 변경, 새 관례)에만 쓴다. 개인 간 요청은 이슈·PR 코멘트로.
- 각 스트림의 `ai-start.sh`가 미확인 공지를 맨 앞에 보여주고, Agent는 Action 수행 후 `CURRENT.md`의 `Acked:`에 id를 적는다. `Required: yes` 공지는 확인 전 PR 병합이 막힌다(`ai-end.sh --ci`).
- `Until`이 지난 공지는 Phase 종료 스트림에서 삭제한다(결정은 ADR에 이미 있다).
