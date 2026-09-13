type Props = { place: string; item: string };

// Figma Card/Lucky(71:186) Half × 2 — 행운의 장소·아이템.
export function LuckySection({ place, item }: Props) {
  return (
    <dl className="grid grid-cols-2 gap-12">
      <LuckyCard label="행운의 장소" value={place} />
      <LuckyCard label="행운의 아이템" value={item} />
    </dl>
  );
}

function LuckyCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-12 rounded-16 border border-apricot bg-opacity-card-apricot-50-80 p-16 drop-shadow-sm backdrop-blur-xs">
      <dt className="text-ui-14 font-medium text-secondary">{label}</dt>
      <dd className="text-ui-18 font-semibold break-keep text-primary">{value}</dd>
    </div>
  );
}
