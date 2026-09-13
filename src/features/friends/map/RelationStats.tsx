import { cn } from '@/lib/cn';

import { tierLooks, tierOrder, type CompatibilityTier, type Friend } from './tiers';

type Props = { friends: readonly Friend[] };

// Figma RelationStat(79:430) × 4 — 등급별 색은 지도 최종 v2(558:2659~2674).
const tone: Record<CompatibilityTier, { card: string; orb: string; count: string }> = {
  GUIIN: {
    card: 'border-strong bg-opacity-card-primary-50-50',
    orb: 'bg-primary-200',
    count: 'text-primary-900',
  },
  CHALTTEOK: {
    card: 'border-rose bg-opacity-card-rose-50-50',
    orb: 'bg-rose-200',
    count: 'text-rose-800',
  },
  BEOT: {
    card: 'border-apricot-300 bg-opacity-card-apricot-50-50',
    orb: 'bg-apricot-200',
    count: 'text-apricot-900',
  },
  SEUCHIM: {
    card: 'border-secondary-default bg-opacity-card-neutral-100-50',
    orb: 'bg-neutral-300',
    count: 'text-neutral-900',
  },
};

export function RelationStats({ friends }: Props) {
  return (
    <dl className="grid grid-cols-4 gap-8">
      {tierOrder.map((tier) => (
        <div
          className={cn(
            'flex flex-col-reverse items-center gap-8 rounded-12 border px-8 py-12 backdrop-blur-xs',
            tone[tier].card,
          )}
          key={tier}
        >
          <dt className="text-ui-12 font-medium text-on-accent">{tierLooks[tier].label}</dt>
          <dd
            className={cn(
              'flex size-40 items-center justify-center rounded-999 font-sungkok text-ui-20 leading-none',
              tone[tier].orb,
              tone[tier].count,
            )}
          >
            {friends.filter((friend) => friend.tier === tier).length}
          </dd>
        </div>
      ))}
    </dl>
  );
}
