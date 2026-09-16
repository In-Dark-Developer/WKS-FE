import { Button } from '@/ui/Button';

import './PreRegisterComplete.css';

// `mailSent` 가 false 면 신청은 됐지만 인증 메일이 안 갔다 — 백엔드가 그 사실을 응답으로 알려 준다.
type Props = { onDone?: () => void; mailSent?: boolean };

// SCR-09 완료 상태 — Figma 수정본 사전신청 모달 완료(695:2654).
export function PreRegisterComplete({ onDone, mailSent = true }: Props) {
  return (
    <section
      aria-labelledby="pre-register-complete-title"
      className="justify-end gap-48 px-16 pb-48"
      data-pre-register-complete=""
      role="status"
    >
      <div className="flex flex-col items-center gap-24 text-center">
        <h1
          className="font-display text-display-24 text-neutral-900"
          id="pre-register-complete-title"
        >
          신청이 완료되었습니다
        </h1>
        <p className="font-display text-ui-12 whitespace-pre-line text-muted">
          {mailSent
            ? '함께할 새로운 인연을 기다려 주세요.'
            : '인증 메일을 보내지 못했어요.\n잠시 뒤 재발송을 요청해 주세요.'}
        </p>
      </div>
      <Button onClick={onDone} size="l" variant="accent">
        확인
      </Button>
    </section>
  );
}
