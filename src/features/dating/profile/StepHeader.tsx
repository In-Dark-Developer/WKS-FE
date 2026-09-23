import { cn } from '@/lib/cn';
import backIcon from '@/ui/assets/icons/angle-small-left.svg';
import { Icon } from '@/ui/Icon';

type Props = {
  step: 1 | 2;
  title: string;
  // (2/2) 의 '뒤로가기' — (1/2) 에는 없다(Figma 134:3490).
  onBack?: () => void;
};

// 프로필 등록 단계 머리 — 진행 막대 두 칸 · '(n/2)' · 제목(Figma 134:3773 · 134:3585).
export function StepHeader({ step, title, onBack }: Props) {
  return (
    <header className="flex flex-col gap-20">
      {onBack ? (
        <button
          className="flex items-center gap-4 self-start text-ui-14 text-secondary"
          onClick={onBack}
          type="button"
        >
          <Icon src={backIcon} />
          뒤로가기
        </button>
      ) : null}
      <div className="flex flex-col items-end">
        <div
          aria-label={`프로필 등록 ${step}/2 단계`}
          aria-valuemax={2}
          aria-valuemin={1}
          aria-valuenow={step}
          className="flex w-full gap-4"
          role="progressbar"
        >
          <span className="h-[6px] flex-1 rounded-999 bg-rose-300" />
          <span
            className={cn(
              'h-[6px] flex-1 rounded-999',
              step === 2 ? 'bg-rose-300' : 'bg-neutral-100',
            )}
          />
        </div>
        <p aria-hidden="true" className="text-ui-14 text-disabled">
          ({step}/2)
        </p>
      </div>
      <h1 className="font-display text-display-24 whitespace-pre-line text-primary">{title}</h1>
    </header>
  );
}
