// 구슬·배지는 Figma 내보내기 SVG 를 크롬에서 3배 해상도로 구운 PNG 다. SVG 그대로 쓰면 WebKit(iOS Safari·카카오톡 인앱)이
// 흐림·팽창 필터를 CSS 1배 해상도로 계산해 레티나에서 가장자리가 계단처럼 깨진다.
import badgeBeot from '@/ui/assets/orbs/badge-beot.png';
import badgeChaltteok from '@/ui/assets/orbs/badge-chaltteok.png';
import badgeGuiin from '@/ui/assets/orbs/badge-guiin.png';
import badgeSeuchim from '@/ui/assets/orbs/badge-seuchim.png';
import orbBeot from '@/ui/assets/orbs/orb-beot.png';
import orbChaltteok from '@/ui/assets/orbs/orb-chaltteok.png';
import orbGuiin from '@/ui/assets/orbs/orb-guiin.png';
import orbSeuchim from '@/ui/assets/orbs/orb-seuchim.png';

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
