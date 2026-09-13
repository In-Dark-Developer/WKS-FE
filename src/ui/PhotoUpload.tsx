import { useRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Button } from '@/ui/Button';

// Figma 디자인시스템 C11 PhotoUpload — Empty·Uploading·Uploaded·Error·Disabled.
// 파일 형식·용량 검증과 업로드 실행은 쓰는 화면이 한다 (PRD Q10).
type Status = 'empty' | 'uploading' | 'uploaded' | 'error';

type Props = {
  status: Status;
  onSelect: (file: File) => void;
  previewUrl?: string;
  previewAlt?: string;
  accept?: string;
  buttonLabel?: string;
  message?: ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
  'aria-describedby'?: string;
};

const copy: Record<Status, { placeholder: string; message: string }> = {
  empty: {
    placeholder: '사진을 추가해 주세요',
    message: '사진 형식과 용량은 서비스 정책에 따릅니다',
  },
  uploading: { placeholder: '사진 업로드 중', message: '업로드 중 · 잠시만 기다려 주세요' },
  uploaded: { placeholder: '사진 미리보기', message: '사진이 준비되었습니다' },
  error: { placeholder: '사진을 올리지 못했어요', message: '파일을 확인하고 다시 시도해 주세요' },
};

export function PhotoUpload({
  status,
  onSelect,
  previewUrl,
  previewAlt = '선택한 사진 미리보기',
  accept = 'image/*',
  buttonLabel = '사진 추가',
  message,
  id,
  disabled = false,
  className,
  'aria-describedby': describedBy,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isError = status === 'error';

  return (
    <div
      aria-busy={status === 'uploading' || undefined}
      className={cn(
        'flex flex-col gap-8 rounded-12 border p-16',
        isError
          ? 'border-status-error-foreground bg-status-error-background'
          : 'border-neutral bg-surface-subtle',
        disabled && 'opacity-50',
        className,
      )}
    >
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-12 bg-surface-subtle">
        {status === 'uploaded' && previewUrl ? (
          <img alt={previewAlt} className="size-full object-cover" src={previewUrl} />
        ) : (
          <p className="p-16 text-center text-ui-12 font-medium text-muted">
            {copy[status].placeholder}
          </p>
        )}
      </div>
      <p
        aria-live="polite"
        className={cn('text-ui-12', isError ? 'text-status-error-foreground' : 'text-muted')}
      >
        {message ?? copy[status].message}
      </p>
      <input
        accept={accept}
        aria-describedby={describedBy}
        className="sr-only"
        disabled={disabled || status === 'uploading'}
        id={id}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
          // 같은 파일을 다시 골라도 change 가 일어나도록 비운다.
          event.target.value = '';
        }}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
      <Button
        disabled={disabled || status === 'uploading'}
        onClick={() => inputRef.current?.click()}
        size="m"
        variant="secondary"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
