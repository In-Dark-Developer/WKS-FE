import { fortuneOrder, type ReadingView } from '../readingView';

type Props = { fortunes: ReadingView['fortunes'] };

// Figma Card/Fortune(71:154) × 3 — 결혼운·자녀운·연애운 풀이.
export function FortuneSection({ fortunes }: Props) {
  return (
    <div className="flex flex-col gap-16">
      {fortuneOrder.map(({ key, label }) => (
        <article
          className="flex flex-col gap-12 rounded-16 border border-default bg-opacity-card-neutral-0-80 p-16 drop-shadow-sm backdrop-blur-xs"
          key={key}
        >
          <h3 className="text-ui-18 font-semibold text-primary">{label}</h3>
          <p className="text-ui-16 break-keep text-secondary">{fortunes[key].content}</p>
        </article>
      ))}
    </div>
  );
}
