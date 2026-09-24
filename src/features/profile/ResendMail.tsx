import { useState } from 'react';

import { resendSignupMail } from '@/api/signups';
import { Button } from '@/ui/Button';

type Props = { email: string };

type ResendState = 'idle' | 'sending' | 'sent' | 'failed' | 'verified';

const resendMessages = {
  sent: '인증 메일을 다시 보냈어요.\n메일함을 확인해 주세요.',
  failed: '지금은 메일을 보내지 못했어요.\n잠시 뒤 다시 시도해 주세요.',
  verified: '이미 인증을 마친 이메일이에요.',
} as const;

// 신청은 됐는데 인증 메일이 안 갔거나(`mailSent: false`) 이미 신청한 이메일(409)일 때 쓰는 재발송 버튼.
// 백엔드는 인증을 마친 이메일이면 400 INVALID_INPUT 을 준다 — 이 화면들에서는 신청 내역이 있으니 '이미 인증'으로 본다.
export function ResendMail({ email }: Props) {
  const [state, setState] = useState<ResendState>('idle');

  async function handleResend() {
    setState('sending');
    const outcome = await resendSignupMail(email);
    if (outcome.ok) {
      setState(outcome.data.mailSent ? 'sent' : 'failed');
    } else if (outcome.error.kind === 'api' && outcome.error.code === 'INVALID_INPUT') {
      setState('verified');
    } else {
      console.error('POST /signups/resend 실패', outcome.error);
      setState('failed');
    }
  }

  const done = state === 'sent' || state === 'verified';

  return (
    <div className="flex flex-col items-center gap-12">
      {state === 'idle' || state === 'sending' ? null : (
        <p className="text-center text-ui-12 whitespace-pre-line text-muted" role="status">
          {resendMessages[state]}
        </p>
      )}
      {done ? null : (
        <Button loading={state === 'sending'} onClick={handleResend} size="m" variant="secondary">
          인증 메일 다시 받기
        </Button>
      )}
    </div>
  );
}
