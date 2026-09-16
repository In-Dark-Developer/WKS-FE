import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// src/ui/tokens/theme.css 가 Tailwind 기본 스케일을 Figma 이름으로 바꿨으므로 같은 목록을 알려준다.
// 모르면 text-ui-14 를 글자색으로 보고 text-primary 와 합칠 때 하나를 지운다.
const twMerge = extendTailwindMerge({
  override: {
    theme: {
      spacing: ['0', '4', '8', '12', '16', '20', '24', '32', '40', '48'],
      radius: ['0', '8', '12', '16', '20', '999'],
      text: [
        'ui-12',
        'ui-14',
        'ui-16',
        'ui-18',
        'ui-20',
        'ui-24',
        'ui-28',
        'ui-32',
        'display-20',
        'display-24',
        'display-28',
        'display-32',
        'display-40',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
