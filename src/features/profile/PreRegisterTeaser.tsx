import { Button } from '@/ui/Button';

type State = 'beforeOpen' | 'available' | 'closed';

type Props = { state: State; onApply?: () => void };

// 문구는 디자인 예시 그대로 — '9/30' 은 와이어프레임 문구이며 일정 확정이 아니다(Figma 설명).
const copy: Record<State, { title: string; description: string; action: string }> = {
  beforeOpen: {
    title: '곧, 새로운 인연이 찾아옵니다',
    description: '축제 인연 소개팅은 9/30에 오픈됩니다',
    action: '사전 신청하기',
  },
  available: {
    title: '당신의 축제 인연을 만나보세요',
    description: '작은 우연으로 시작하는 특별한 만남',
    action: '신청하기',
  },
  closed: {
    title: '신청이 마감되었어요',
    description: '함께해 주셔서 감사합니다.',
    action: '신청 마감',
  },
};

// SCR-04 사전신청 티저 — Figma 디자인시스템 PreRegistrationTeaser(82:605). 결과 화면 teaser 슬롯에 들어간다(FR-9).
export function PreRegisterTeaser({ state, onApply }: Props) {
  const { title, description, action } = copy[state];

  return (
    <section
      aria-labelledby={`pre-register-teaser-${state}`}
      className="flex flex-col gap-24 rounded-20 bg-surface-brand p-24"
    >
      <h2 className="font-display text-display-20 text-primary" id={`pre-register-teaser-${state}`}>
        {title}
      </h2>
      <p className="text-ui-14 text-secondary">{description}</p>
      <Button disabled={state === 'closed'} onClick={onApply} size="l">
        {action}
      </Button>
    </section>
  );
}
