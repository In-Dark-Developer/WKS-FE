import { fortuneOrder, type ReadingView } from '../readingView';

type Props = { fortunes: ReadingView['fortunes'] };

// 순서·이름은 `fortuneOrder` 하나가 정한다 — 카드 스탬프 줄과 이 카드들이 같은 순서여야 한다(QA 2026-09-28).

// Figma Card/Fortune(71:154) × 3, 간격 24.
export function FortuneSection({ fortunes }: Props) {
  return (
    <div className="flex flex-col gap-24">
      {fortuneOrder.map(({ key, label }) => (
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
