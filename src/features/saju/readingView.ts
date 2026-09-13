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
};

// 카드 스탬프와 운세 카드의 순서·이름 — 백엔드 fortunes 순서(MARRIAGE → CHILDREN → LOVE)와 같다.
export const fortuneOrder: readonly { key: FortuneKey; label: string }[] = [
  { key: 'marriage', label: '결혼운' },
  { key: 'children', label: '자녀운' },
  { key: 'love', label: '연애운' },
];
