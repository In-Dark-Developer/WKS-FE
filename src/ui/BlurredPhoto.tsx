import { cn } from '@/lib/cn';

type Props = {
  // 잠긴 사진은 썸네일 주소만 받는다 — 원본 주소는 해금 전까지 화면에 오지 않는다(FR-28 · NFR-4).
  src: string;
  alt: string;
  isBlurred: boolean;
  className?: string;
};

// 사진을 흐리게 가리는 틀 — 흐림 가장자리가 비치지 않게 조금 키워 넣고 틀 밖을 자른다(Figma 101:2071 blur 10).
export function BlurredPhoto({ src, alt, isBlurred, className }: Props) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <img
        alt={alt}
        className={cn('size-full object-cover', isBlurred && 'scale-110 blur-[10px]')}
        draggable={false}
        src={src}
      />
    </div>
  );
}
