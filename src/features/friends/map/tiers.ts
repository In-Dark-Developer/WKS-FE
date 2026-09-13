import badgeBeot from '@/ui/assets/orbs/badge-beot.svg';
import badgeChaltteok from '@/ui/assets/orbs/badge-chaltteok.svg';
import badgeGuiin from '@/ui/assets/orbs/badge-guiin.svg';
import badgeSeuchim from '@/ui/assets/orbs/badge-seuchim.svg';
import orbBeot from '@/ui/assets/orbs/orb-beot.svg';
import orbChaltteok from '@/ui/assets/orbs/orb-chaltteok.svg';
import orbGuiin from '@/ui/assets/orbs/orb-guiin.svg';
import orbSeuchim from '@/ui/assets/orbs/orb-seuchim.svg';

// 백엔드 CompatibilityTier 값 그대로 (docs/api/openapi.yaml) — 등급은 백엔드가 정하고 화면은 계산하지 않는다(FR-7).
export type CompatibilityTier = 'GUIIN' | 'CHALTTEOK' | 'BEOT' | 'SEUCHIM';

export type Friend = { nickname: string; score: number; tier: CompatibilityTier };

export const tierOrder: readonly CompatibilityTier[] = ['GUIIN', 'CHALTTEOK', 'BEOT', 'SEUCHIM'];

// Figma 지도 최종 v2(558:2625)의 등급별 모양 — 지도 구슬은 등급이 높을수록 크다.
export const tierLooks: Record<
  CompatibilityTier,
  { label: string; orb: string; orbSize: number; badge: string }
> = {
  GUIIN: { label: '귀인', orb: orbGuiin, orbSize: 30.6, badge: badgeGuiin },
  CHALTTEOK: { label: '찰떡', orb: orbChaltteok, orbSize: 27.54, badge: badgeChaltteok },
  BEOT: { label: '벗', orb: orbBeot, orbSize: 24.786, badge: badgeBeot },
  SEUCHIM: { label: '스침', orb: orbSeuchim, orbSize: 22.032, badge: badgeSeuchim },
};
