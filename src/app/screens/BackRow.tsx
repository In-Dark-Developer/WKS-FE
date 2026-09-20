import angleSmallLeft from '@/ui/assets/icons/angle-small-left.svg';
import { Icon } from '@/ui/Icon';

// 화면 맨 위 '뒤로가기' 줄(Figma 720:3587) — 결과 화면과 궁합 지도가 같은 모양을 쓴다.
// 어디로 돌아가는지는 라우트가 정한다.
export function BackRow({ onBack }: { onBack: () => void }) {
  return (
    <button
      className="flex items-center gap-16 text-ui-16 font-medium text-on-brand"
      onClick={onBack}
      type="button"
    >
      <Icon src={angleSmallLeft} />
      뒤로가기
    </button>
  );
}
