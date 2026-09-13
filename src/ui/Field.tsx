import { useId, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

// Figma 디자인시스템 C04 Field — 라벨 + 교체 가능한 컨트롤 + 도움말, Status Default·Error·Success·Disabled.
export type FieldControlProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  disabled?: boolean;
};

type Props = {
  label: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  success?: ReactNode;
  disabled?: boolean;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
};

export function Field({ label, help, error, success, disabled, className, children }: Props) {
  const id = useId();
  const message = error ?? success ?? help;
  const messageId = message ? `${id}-message` : undefined;

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <label className="text-ui-14 font-medium text-primary" htmlFor={id}>
        {label}
      </label>
      {children({
        id,
        'aria-describedby': messageId,
        'aria-invalid': error ? true : undefined,
        disabled,
      })}
      {message ? (
        <p
          className={cn(
            'text-ui-12',
            error
              ? 'text-status-error-foreground'
              : success
                ? 'text-status-success-foreground'
                : 'text-muted',
          )}
          id={messageId}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
