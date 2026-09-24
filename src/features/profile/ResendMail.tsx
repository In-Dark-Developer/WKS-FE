import { useFetcher } from 'react-router-dom';

import { Button } from '@/ui/Button';

import { resendActionDataSchema } from './formSchema';

type Props = { email: string };

const resendMessages = {
  sent: '인증 메일을 다시 보냈어요.\n메일함을 확인해 주세요.',
  failed: '지금은 메일을 보내지 못했어요.\n잠시 뒤 다시 시도해 주세요.',
  verified: '이미 인증을 마친 이메일이에요.',
} as const;

// 신청은 됐는데 인증 메일이 안 갔거나(`mailSent: false`) 이미 신청한 이메일(409)일 때 쓰는 재발송 버튼.
// 사전신청과 같은 route action 에 `intent: 'resend'` 로 보낸다(preRegisterAction).
export function ResendMail({ email }: Props) {
  const fetcher = useFetcher();
  const sending = fetcher.state !== 'idle';
  const parsed = resendActionDataSchema.safeParse(fetcher.data);
  const result =
    sending || fetcher.data === undefined ? null : parsed.success ? parsed.data.resend : 'failed';
  const done = result === 'sent' || result === 'verified';

  function handleResend() {
    void fetcher.submit(
      { intent: 'resend', email },
      { method: 'post', encType: 'application/json' },
    );
  }

  return (
    <div className="flex flex-col items-center gap-12">
      {result === null ? null : (
        <p className="text-center text-ui-12 whitespace-pre-line text-muted" role="status">
          {resendMessages[result]}
        </p>
      )}
      {done ? null : (
        <Button loading={sending} onClick={handleResend} size="m" variant="secondary">
          인증 메일 다시 받기
        </Button>
      )}
    </div>
  );
}
