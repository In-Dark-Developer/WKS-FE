type Props = { place: string; item: string };

// Figma Card/Lucky(71:186) Half × 2 — 사주 카드 화면(658:5087) 순서대로 행운의 아이템·장소.
export function LuckySection({ place, item }: Props) {
  return (
    <dl className="grid grid-cols-2 gap-12">
      <LuckyCard label="행운의 아이템" value={item} />
      <LuckyCard label="행운의 장소" value={place} />
    </dl>
  );
}

function LuckyCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-12 rounded-16 border border-apricot bg-opacity-card-apricot-50-50 p-16 backdrop-blur-sm">
      <dt className="text-ui-14 font-medium text-secondary">{label}</dt>
      <dd className="text-ui-18 font-semibold break-keep text-primary">{value}</dd>
    </div>
  );
}
