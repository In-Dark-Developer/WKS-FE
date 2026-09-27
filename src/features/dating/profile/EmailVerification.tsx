import { useEffect, useState } from 'react';

import { Button } from '@/ui/Button';
import { Field } from '@/ui/Field';
import { TextField } from '@/ui/TextField';

import {
  emailVerificationMessages,
  isCodeError,
  type EmailVerificationView,
} from './emailVerificationView';

const CODE_LENGTH = 6;

type Props = {
  email: string;
  // 형식 검사 오류 — 제출을 시도한 뒤에만 온다.
  emailError?: string;
  onEmailChange: (email: string) => void;
  view: EmailVerificationView;
  onSendCode: () => void;
  onVerifyCode: (code: string) => void;
};

function secondsUntil(time: number | undefined, now: number) {
  return time === undefined ? 0 : Math.max(0, Math.ceil((time - now) / 1000));
}

function formatCountdown(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// 재발송 가능 시각까지 1초마다 다시 그린다. 부르는 쪽이 시각마다 key 를 바꿔 다시 마운트한다 —
// 처음 그린 시각으로 재면 발송 응답이 늦게 온 만큼 남은 시간이 길게 보인다.
function useSecondsUntil(time: number | undefined) {
  const [now, setNow] = useState(() => Date.now());
  const seconds = secondsUntil(time, now);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return seconds;
}

type SendButtonProps = {
  resendAvailableAt?: number;
  hasSent: boolean;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

function SendButton({ resendAvailableAt, hasSent, disabled, loading, onClick }: SendButtonProps) {
  const resendSeconds = useSecondsUntil(resendAvailableAt);
  const label =
    resendSeconds > 0 ? `재발송 ${formatCountdown(resendSeconds)}` : hasSent ? '재발송' : '인증';

  return (
    <Button
      className="shrink-0 px-16"
      disabled={disabled || resendSeconds > 0}
      loading={loading}
      loadingLabel="발송 중"
      onClick={onClick}
      size="m"
      type="button"
      variant="secondary"
    >
      {label}
    </Button>
  );
}

// 학교(DGU) 메일 코드 인증 — '인증' → 6자리 코드 메일 → 같은 화면에서 입력(FR-25, BE api-spec §10.7).
// 디자인에 없는 상태라 기존 Field·TextField·Button 으로 그린다.
export function EmailVerification({
  email,
  emailError,
  onEmailChange,
  view,
  onSendCode,
  onVerifyCode,
}: Props) {
  const [code, setCode] = useState('');
  const { status, error } = view;
  const isVerified = status === 'verified';
  const hasSent = status === 'sent' || status === 'verifying';
  const sendError = error && !isCodeError(error) ? emailVerificationMessages[error] : undefined;
  const codeError = error && isCodeError(error) ? emailVerificationMessages[error] : undefined;

  return (
    <div className="flex flex-col gap-16">
      <Field
        error={sendError ?? emailError}
        help="소속 확인을 위해 dgu 메일을 작성해주세요."
        label="이메일"
        success={isVerified ? '학교 메일 인증을 마쳤어요' : undefined}
      >
        {(control) => (
          <div className="flex gap-8">
            <TextField
              {...control}
              appearance="soft"
              autoComplete="email"
              className="min-w-0 flex-1 bg-surface-default"
              inputMode="email"
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="example@domain.com"
              readOnly={isVerified}
              type="email"
              value={email}
            />
            {isVerified ? null : (
              <SendButton
                disabled={email.trim() === '' || status === 'verifying'}
                hasSent={hasSent}
                key={view.resendAvailableAt}
                loading={status === 'sending'}
                onClick={onSendCode}
                resendAvailableAt={view.resendAvailableAt}
              />
            )}
          </div>
        )}
      </Field>

      {hasSent ? (
        <Field
          error={codeError}
          help="메일로 받은 6자리 코드를 10분 안에 입력해 주세요."
          label="인증 코드"
        >
          {(control) => (
            <div className="flex gap-8">
              <TextField
                {...control}
                appearance="soft"
                autoComplete="one-time-code"
                className="min-w-0 flex-1 bg-surface-default"
                inputMode="numeric"
                maxLength={CODE_LENGTH}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                value={code}
              />
              <Button
                className="shrink-0 px-16"
                disabled={code.length !== CODE_LENGTH}
                loading={status === 'verifying'}
                loadingLabel="확인 중"
                onClick={() => onVerifyCode(code)}
                size="m"
                type="button"
                variant="secondary"
              >
                확인
              </Button>
            </div>
          )}
        </Field>
      ) : null}
    </div>
  );
}
