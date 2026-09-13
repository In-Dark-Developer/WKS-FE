import { Button } from '@/ui/Button';

import './PreRegisterComplete.css';

type Props = { onDone?: () => void };

// SCR-09 완료 상태 — Figma 수정본 사전신청 모달 완료(695:2654).
export function PreRegisterComplete({ onDone }: Props) {
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
        <p className="font-display text-ui-12 text-muted">함께할 새로운 인연을 기다려 주세요.</p>
      </div>
      <Button onClick={onDone} size="l" variant="accent">
        확인
      </Button>
    </section>
  );
}
