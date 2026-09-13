import type { PreviewScreen } from '@/app/preview/previewScreen';
import { ConnectionCard, ConnectionCardScreen } from '@/features/share';
import type { Zodiac } from '@/ui/ZodiacCharacter';

const card = {
  nickname: '달빛토끼',
  zodiac: 'PIG',
  title: '이런 운명',
  description:
    '당신은 이런 운명을 타고나서 이런 운명을 맞게 될 거임.\n설명 설명 이런 운명이 무엇인지에 대한 설명 두 줄 정도',
  grades: [
    { label: '결혼운', grade: 'SS' },
    { label: '자녀운', grade: 'A+' },
    { label: '연애운', grade: 'B' },
  ],
} as const;

const zodiacs: readonly Zodiac[] = [
  'RAT',
  'OX',
  'TIGER',
  'RABBIT',
  'DRAGON',
  'SNAKE',
  'HORSE',
  'GOAT',
  'MONKEY',
  'ROOSTER',
  'DOG',
  'PIG',
];

// SCR-05 인연카드 — 04/T2 퍼블리싱 · 04/T5 화면(공유·저장).
export const preview: PreviewScreen = {
  title: 'SCR-05 인연카드',
  order: 2,
  backdrop: 'result',
  states: {
    화면: () => <ConnectionCardScreen {...card} shareId="9f0d3f1e-0000-4000-8000-000000000001" />,
    앞면: () => <ConnectionCard {...card} />,
    뒷면: () => <ConnectionCard {...card} initialFace="back" />,
    '십이간지 12종': () => (
      <div className="flex flex-col gap-16">
        {zodiacs.map((zodiac) => (
          <ConnectionCard key={zodiac} {...card} zodiac={zodiac} />
        ))}
      </div>
    ),
  },
};
