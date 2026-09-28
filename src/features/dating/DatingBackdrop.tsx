import type { ReactNode } from 'react';

import './dating.css';

type Props = {
  // 'intro' 는 배경 위에 어둠을 덮고 children(흐린 카드 벽)을 그 아래에 깐다.
  variant?: 'default' | 'intro';
  children?: ReactNode;
};

// 소개팅 화면들이 같이 쓰는 고정 배경 — 분홍→크림→하늘 그라데이션과 별자리 선.
export function DatingBackdrop({ variant = 'default', children }: Props) {
  return (
    <div aria-hidden="true" data-dating-backdrop={variant}>
      {children}
    </div>
  );
}
