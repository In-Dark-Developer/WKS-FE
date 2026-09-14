import type { CompatibilitySummary } from '@/api/schema/result';
import type { Grade } from '@/ui/DestinyCard';
import type { Zodiac } from '@/ui/ZodiacCharacter';

export type FortuneKey = 'marriage' | 'children' | 'love';

// 결과 화면이 그리는 값 — 백엔드 응답(SharedResult)을 이 모양으로 바꾸는 일은 03/T7 toReadingView 가 한다.
export type ReadingView = {
  nickname: string;
  zodiac: Zodiac;
  destiny: { title: string; description: string };
  fortunes: Record<FortuneKey, { grade: Grade; content: string }>;
  luckyPlace: string;
  luckyItem: string;
  // 공유 링크·인연카드 진입에 쓰는 공개 UUID(FR-4·FR-5) — 조립(04/T6)이 share feature 에 넘긴다.
  shareId: string;
  // 친구 궁합 순위(FR-8) — 상대 닉네임·점수·등급, 점수 높은 순. 결과 화면 순위 요약과 궁합 지도(05/T3)가 쓴다.
  // saju 는 friends feature 를 import 하지 않으므로 모양만 같게 둔다(friends 의 Friend).
  friends?: readonly { nickname: string; score: number; tier: CompatibilitySummary['tier'] }[];
};

// 카드 스탬프와 운세 카드의 순서·이름 — 백엔드 fortunes 순서(MARRIAGE → CHILDREN → LOVE)와 같다.
export const fortuneOrder: readonly { key: FortuneKey; label: string }[] = [
  { key: 'marriage', label: '결혼운' },
  { key: 'children', label: '자녀운' },
  { key: 'love', label: '연애운' },
];
