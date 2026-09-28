import { cn } from '@/lib/cn';

import { tierLooks, tierOrder, type CompatibilityTier, type Friend } from './tiers';

type Props = { friends: readonly Friend[] };

// Figma v1.0 RelationStat(8:71 — 16:1979~1982) × 4 — 판은 등급 표면색 50% + 등급 테두리, 원은 표면색(스침만 흰색).
const tone: Record<CompatibilityTier, { card: string; orb: string }> = {
  GUIIN: { card: 'border-strong bg-opacity-card-primary-50-50', orb: 'bg-primary-50' },
  CHALTTEOK: { card: 'border-rose bg-opacity-card-rose-50-50', orb: 'bg-rose-50' },
  BEOT: { card: 'border-apricot-300 bg-opacity-card-apricot-50-50', orb: 'bg-apricot-50' },
  SEUCHIM: { card: 'border-secondary-default bg-opacity-card-neutral-100-50', orb: 'bg-neutral-0' },
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
          {/* 원 44px 은 Space 토큰에 없어 값으로 둔다. 숫자는 UI/20/700 검정(Text/Neutral). */}
          <dd
            className={cn(
              'flex size-[44px] items-center justify-center rounded-999 text-ui-20 font-bold text-primary',
              tone[tier].orb,
            )}
          >
            {friends.filter((friend) => friend.tier === tier).length}
          </dd>
        </div>
      ))}
    </dl>
  );
}
