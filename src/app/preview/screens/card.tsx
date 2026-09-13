import type { PreviewScreen } from '@/app/preview/previewScreen';
import { ConnectionCard } from '@/features/share';
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

// SCR-05 인연카드 — 04/T2.
export const preview: PreviewScreen = {
  title: 'SCR-05 인연카드',
  order: 2,
  backdrop: 'result',
  states: {
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
