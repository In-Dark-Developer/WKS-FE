// 서비스 오픈 시각 — 그 전에는 어떤 주소로 들어와도 오픈 대기 화면만 보인다(2026-09-28 결정).
// 운영 배포에만 `VITE_OPEN_AT`(ISO 8601, 오프셋 포함 — 예 2026-09-29T09:00:00+09:00)을 둔다(netlify.toml).
// 값이 없거나 읽을 수 없으면 대기 없이 연다 — 개발·dev 배포·미리보기는 막지 않는다.
export function readOpenAt(raw: string | undefined = import.meta.env.VITE_OPEN_AT): number | null {
  if (!raw) return null;
  const time = Date.parse(raw);
  if (Number.isNaN(time)) {
    console.error('VITE_OPEN_AT 을 읽을 수 없다', raw);
    return null;
  }
  return time;
}

// 화면에 보이는 오픈 시각은 한국 시각으로 쓴다 — 기기 시간대와 무관하게 '9월 29일 오전 9시'.
export function formatOpenAt(openAt: number): string {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).formatToParts(openAt);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  const minute = part('minute') === '00' ? '' : ` ${Number(part('minute'))}분`;
  return `${part('month')}월 ${part('day')}일 ${part('dayPeriod')} ${part('hour')}시${minute}`;
}

// 남은 시간 — 하루가 넘으면 'N일 HH:MM:SS', 아니면 'HH:MM:SS'.
export function formatRemaining(milliseconds: number): string {
  const total = Math.max(0, Math.ceil(milliseconds / 1000));
  const days = Math.floor(total / 86_400);
  const clock = [Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
  return days > 0 ? `${days}일 ${clock}` : clock;
}
