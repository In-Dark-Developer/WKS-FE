import type { PreviewScreen } from '@/app/preview/previewScreen';
import { ConnectionCard, ResultCard } from '@/features/share';
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

// 가장 긴 운명 제목(14자, 백엔드 destiny-titles.txt) + 설명 105자 = 119자 (운영 응답 문체).
const longTitle = '인연 하나에 뿌리내린 나무';
const longDescription =
  '단단한 흙과 뜨거운 불의 기운이 만나 속이 깊고 책임감이 아주 강한 성향입니다. 차분하게 내실을 다지며 살아간다면 앞으로의 삶에 평온함과 든든한 안정감이 자연스럽게 찾아올 거예요. 곧 좋은';

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

// 결과 화면 운명 카드 — 04/T2 뒤집기 · 04/T5 인스타 스토리 공유 · 04/T7 결과 화면에 합침.
export const preview: PreviewScreen = {
  title: 'SCR-04 운명 카드 (뒤집기·공유)',
  order: 2,
  backdrop: 'result',
  states: {
    '카드 + 인스타 공유': () => <ResultCard {...card} />,
    앞면: () => <ConnectionCard {...card} />,
    뒷면: () => <ConnectionCard {...card} initialFace="back" />,
    // PRD FR-3 — 운명 제목·설명 합 120자. 말줄임 없이 전문이 보이고 등급 스탬프와 겹치지 않아야 한다.
    '문구 120자': () => (
      <ConnectionCard {...card} description={longDescription} title={longTitle} />
    ),
    '십이간지 12종': () => (
      <div className="flex flex-col gap-16">
        {zodiacs.map((zodiac) => (
          <ConnectionCard key={zodiac} {...card} zodiac={zodiac} />
        ))}
      </div>
    ),
  },
};
