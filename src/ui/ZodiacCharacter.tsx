import type { ComponentPropsWithoutRef } from 'react';

import dog from '@/ui/assets/zodiac/zodiac-dog.webp';
import dragon from '@/ui/assets/zodiac/zodiac-dragon.webp';
import horse from '@/ui/assets/zodiac/zodiac-horse.webp';
import monkey from '@/ui/assets/zodiac/zodiac-monkey.webp';
import ox from '@/ui/assets/zodiac/zodiac-ox.webp';
import pig from '@/ui/assets/zodiac/zodiac-pig.webp';
import rabbit from '@/ui/assets/zodiac/zodiac-rabbit.webp';
import rat from '@/ui/assets/zodiac/zodiac-rat.webp';
import rooster from '@/ui/assets/zodiac/zodiac-rooster.webp';
import sheep from '@/ui/assets/zodiac/zodiac-sheep.webp';
import snake from '@/ui/assets/zodiac/zodiac-snake.webp';
import tiger from '@/ui/assets/zodiac/zodiac-tiger.webp';

// 백엔드 Zodiac 값 그대로 (docs/api/openapi.yaml). 캐릭터 이름·이미지는 프론트가 정한다.
export type Zodiac =
  | 'RAT'
  | 'OX'
  | 'TIGER'
  | 'RABBIT'
  | 'DRAGON'
  | 'SNAKE'
  | 'HORSE'
  | 'GOAT'
  | 'MONKEY'
  | 'ROOSTER'
  | 'DOG'
  | 'PIG';

// Figma 「UI 최종 - 개발용」 십이간지 카드(731:4740)의 '○○보살' 이름.
export const bodhisattvaNames: Record<Zodiac, string> = {
  RAT: '찍어보살',
  OX: '소원보살',
  TIGER: '호통보살',
  RABBIT: '깡충보살',
  DRAGON: '용한보살',
  SNAKE: '슬쩍보살',
  HORSE: '말해보살',
  GOAT: '양심보살',
  MONKEY: '재간보살',
  ROOSTER: '꼬꼬보살',
  DOG: '개운보살',
  PIG: '복복보살',
};

const images: Record<Zodiac, string> = {
  RAT: rat,
  OX: ox,
  TIGER: tiger,
  RABBIT: rabbit,
  DRAGON: dragon,
  SNAKE: snake,
  HORSE: horse,
  GOAT: sheep,
  MONKEY: monkey,
  ROOSTER: rooster,
  DOG: dog,
  PIG: pig,
};

type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & { zodiac: Zodiac };

export function ZodiacCharacter({ zodiac, ...props }: Props) {
  return <img alt={bodhisattvaNames[zodiac]} draggable={false} src={images[zodiac]} {...props} />;
}
