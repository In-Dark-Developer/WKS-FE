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

// 가장 긴 운명 제목(14자, 백엔드 destiny-titles.txt) + 가장 긴 설명(공백 포함 140자, PRD FR-3 · Figma 658:5130).
const longTitle = '인연 하나에 뿌리내린 나무';
const longDescription =
  '우연처럼 시작된 만남도 어쩌면 오래전부터 정해진 인연일지 몰라요. 사주 속 흐름을 따라 나와 잘 맞는 사람을 찾고, 설레는 인연을 직접 만나보세요. 오늘의 작은 선택이 생각지 못한 새로운 사랑의 시작이 될지도 모릅니다. 오늘의 작은 선택이 생각지 못한';

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
    // PRD FR-3 — 설명 140자·긴 제목. 말줄임 없이 전문이 보여야 한다.
    '문구 최대 길이': () => (
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
