import earthIcon from '@/ui/assets/elements/element-earth.png';
import fireIcon from '@/ui/assets/elements/element-fire.png';
import metalIcon from '@/ui/assets/elements/element-metal.png';
import waterIcon from '@/ui/assets/elements/element-water.png';
import woodIcon from '@/ui/assets/elements/element-wood.png';

import { elementOrder, type ElementKey, type ReadingView } from '../readingView';

import './ElementsSection.css';

type Props = { elements: ReadingView['elements'] };

// 막대 칸 수 — 출생 시간까지 넣은 원국 8글자가 한 오행에 몰릴 수 있는 최대다.
const SLOTS = 8;

// 아이콘은 Figma 내보내기 SVG(inner shadow 필터)를 크롬에서 3배로 구운 PNG 다 — SVG 필터는 WebKit 이 1배로 계산해
// iOS 에서 깨진다(구슬·배지와 같은 이유).
const icons: Record<ElementKey, string> = {
  wood: woodIcon,
  fire: fireIcon,
  earth: earthIcon,
  metal: metalIcon,
  water: waterIcon,
};

// SCR-04 음양오행 — Figma 결과 화면(982:3446, 1038:3774). 오행마다 아이콘·이름·8칸 막대로 개수를 보인다.
export function ElementsSection({ elements }: Props) {
  return (
    <dl aria-label="오행 분포" data-reading-elements="">
      {elementOrder.map(({ key, label }) => {
        const count = Math.min(elements[key], SLOTS);
        return (
          <div
            className="flex min-w-0 flex-col items-center gap-4 rounded-16 border border-apricot bg-opacity-card-apricot-50-50 p-8 backdrop-blur-sm"
            data-element={key}
            key={key}
          >
            {/* 아이콘 → 8 → 이름 → 4 → 막대 (Figma 1038:3723). */}
            <dt className="flex w-full flex-col items-center gap-8 font-display text-display-20 text-primary">
              <img alt="" data-reading-element-icon="" src={icons[key]} />
              {label}
            </dt>
            <dd className="flex w-full justify-center">
              <span className="sr-only">{elements[key]}개</span>
              <span aria-hidden="true" data-reading-element-bars="">
                {Array.from({ length: SLOTS }, (_, slot) => (
                  <span data-filled={slot < count || undefined} key={slot} />
                ))}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
