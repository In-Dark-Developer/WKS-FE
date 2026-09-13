import { cn } from '@/lib/cn';

type Props = { src: string; className?: string };

// Figma 아이콘 SVG 를 마스크로 그려 글자색(currentColor)을 따르게 한다. 장식용이라 읽히지 않는다.
export function Icon({ src, className }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-24 shrink-0 bg-current mask-contain mask-center mask-no-repeat',
        className,
      )}
      // Vite 가 작은 SVG 를 따옴표가 든 data URI 로 인라인하므로 url() 안을 따옴표로 감싼다.
      style={{ maskImage: `url("${src}")` }}
    />
  );
}
