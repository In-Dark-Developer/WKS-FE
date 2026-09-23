import type { CompatibilitySummary } from '@/api/schema/result';
import type { Grade } from '@/ui/DestinyCard';
import type { Zodiac } from '@/ui/ZodiacCharacter';

export type FortuneKey = 'marriage' | 'children' | 'love';

export type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

// 결과 화면이 그리는 값 — 백엔드 응답(SharedResult)을 이 모양으로 바꾸는 일은 03/T7 toReadingView 가 한다.
export type ReadingView = {
  nickname: string;
  zodiac: Zodiac;
  destiny: { title: string; description: string };
  fortunes: Record<FortuneKey, { grade: Grade; content: string }>;
  // 사주 원국의 오행 개수 — 합계 8(출생 시간 입력) 또는 6(몰라요).
  elements: Record<ElementKey, number>;
  luckyPlace: string;
  luckyItem: string;
  // 공유 링크·인연카드 진입에 쓰는 공개 UUID(FR-4·FR-5) — 조립(04/T6)이 share feature 에 넘긴다.
  shareId: string;
  // 나와 잘 맞는 오행 + 이유(FR-3 V1) — 옛 결과는 null 이고 화면은 그 영역을 그리지 않는다.
  elementMatch: { element: ElementKey; korean: string; reason: string } | null;
  // 친구 궁합 순위(FR-8) — 상대 닉네임·점수·등급, 점수 높은 순. 결과 화면 순위 요약과 궁합 지도(05/T3)가 쓴다.
  // saju 는 friends feature 를 import 하지 않으므로 모양만 같게 둔다(friends 의 Friend).
  friends?: readonly {
    nickname: string;
    score: number;
    tier: CompatibilitySummary['tier'];
    compatibilityId?: number;
  }[];
};

// 카드 스탬프와 운세 카드의 순서·이름 — 백엔드 fortunes 순서(MARRIAGE → CHILDREN → LOVE)와 같다.
export const fortuneOrder: readonly { key: FortuneKey; label: string }[] = [
  { key: 'marriage', label: '결혼운' },
  { key: 'children', label: '자녀운' },
  { key: 'love', label: '연애운' },
];

// 오행 카드 순서·이름 — Figma 결과 화면(982:3446)의 목 → 화 → 토 → 금 → 수.
export const elementOrder: readonly { key: ElementKey; label: string }[] = [
  { key: 'wood', label: '목' },
  { key: 'fire', label: '화' },
  { key: 'earth', label: '토' },
  { key: 'metal', label: '금' },
  { key: 'water', label: '수' },
];
