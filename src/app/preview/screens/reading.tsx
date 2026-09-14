import type { PreviewScreen } from '@/app/preview/previewScreen';
import { FortuneLoading, ReadingResult, type ReadingView } from '@/features/saju';
import { DestinyCard } from '@/ui/DestinyCard';
import type { Zodiac } from '@/ui/ZodiacCharacter';

const view: ReadingView = {
  nickname: '달빛토끼',
  zodiac: 'PIG',
  destiny: {
    title: '꽃길만 걷는 인연',
    description:
      '당신은 사람을 편하게 만드는 기운을 타고났어요.\n마음을 먼저 열면 오래 곁에 머무는 인연이 찾아와요.',
  },
  fortunes: {
    marriage: {
      grade: 'SS',
      content: '서로의 속도를 맞춰 가는 사람을 만나요. 서두르지 않아도 인연은 제자리를 찾아와요.',
    },
    children: {
      grade: 'A+',
      content: '따뜻한 집안 분위기를 만드는 힘이 있어요. 작은 약속을 지키는 습관이 복을 불러요.',
    },
    love: {
      grade: 'B',
      content:
        '마음을 열고 작은 대화를 시작해 보세요. 익숙한 하루 속에서 새로운 인연을 만날 수 있어요.',
    },
  },
  luckyPlace: '만해광장',
  luckyItem: '작은 책 한 권',
  shareId: '9f0d3f1e-0000-4000-8000-000000000001',
};

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

// SCR-03·04 사주 결과 — 03/T5.
export const preview: PreviewScreen = {
  title: 'SCR-04 사주 결과',
  order: 1,
  backdrop: 'result',
  states: {
    결과: () => <ReadingResult view={view} />,
    '긴 제목': () => (
      <ReadingResult
        view={{
          ...view,
          nickname: '여덟글자닉네임',
          destiny: { title: '깔깔깔깔깔깔깔깔깔깔깔깔', description: view.destiny.description },
        }}
      />
    ),
    '십이간지 12종': () => (
      <div className="flex flex-col gap-16">
        {zodiacs.map((zodiac) => (
          <DestinyCard
            description={view.destiny.description}
            grades={[
              { label: '결혼운', grade: 'S' },
              { label: '자녀운', grade: 'A' },
              { label: '연애운', grade: 'B+' },
            ]}
            key={zodiac}
            nickname={view.nickname}
            title={view.destiny.title}
            zodiac={zodiac}
          />
        ))}
      </div>
    ),
    대기: () => <FortuneLoading state="loading" />,
    지연: () => <FortuneLoading state="delayed" />,
    에러: () => <FortuneLoading onRetry={() => undefined} state="error" />,
  },
};
