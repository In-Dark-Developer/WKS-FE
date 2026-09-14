import type { FortuneKey, ReadingView } from '../readingView';

type Props = { fortunes: ReadingView['fortunes'] };

// 운세 카드 순서 — 사주 카드 화면(658:5088)은 연애운·결혼운·자녀운이다. 카드 스탬프 줄(결혼·자녀·연애)과 다르다.
const sectionOrder: readonly { key: FortuneKey; label: string }[] = [
  { key: 'love', label: '연애운' },
  { key: 'marriage', label: '결혼운' },
  { key: 'children', label: '자녀운' },
];

// Figma Card/Fortune(71:154) × 3, 간격 24.
export function FortuneSection({ fortunes }: Props) {
  return (
    <div className="flex flex-col gap-24">
      {sectionOrder.map(({ key, label }) => (
        <article
          className="flex flex-col gap-12 rounded-16 border border-default bg-opacity-card-neutral-0-50 p-16 backdrop-blur-sm"
          key={key}
        >
          <h3 className="text-ui-18 font-semibold text-primary">{label}</h3>
          <p className="text-ui-16 break-keep text-secondary">{fortunes[key].content}</p>
        </article>
      ))}
    </div>
  );
}
