import requestBox from '@/ui/assets/dating/request-box.webp';
import threadYarn from '@/ui/assets/dating/thread-yarn.webp';

type Props = {
  onOpenThreadGuide: () => void;
  onOpenRequests: () => void;
};

// 소개팅 상단 — 왼쪽 '운명의 실'(누르면 재화 안내 모달), 오른쪽 요청함(Figma top_nav `91:1790`).
// 보유 개수는 여기 두지 않고 재화 안내 모달에서만 보인다(2026-09-27 결정).
// 두 칸은 56px 높이 안에서 그림이 위, 글자가 아래에 붙는다 — 그림 높이가 달라(47×32 · 41×38)
// 간격이 각각 6px·0px 로 생긴다(Figma 는 justify-between 으로 그렸다).
export function DatingHeader({ onOpenThreadGuide, onOpenRequests }: Props) {
  return (
    <header className="-mx-16 -mt-16 flex items-center justify-between bg-opacity-card-rose-50-50 px-24 pt-8 pb-4">
      <button
        aria-label="운명의 실 획득 방법 보기"
        className="flex h-[56px] flex-col items-center justify-between"
        onClick={onOpenThreadGuide}
        type="button"
      >
        <img alt="" className="h-32 w-[47px] object-contain" draggable={false} src={threadYarn} />
        <span className="text-ui-12 font-medium text-primary">운명의 실</span>
      </button>
      <button
        className="flex h-[56px] flex-col items-center justify-between"
        onClick={onOpenRequests}
        type="button"
      >
        <img
          alt=""
          className="h-[38px] w-[41px] object-contain"
          draggable={false}
          src={requestBox}
        />
        <span className="text-ui-12 font-medium text-primary">요청함</span>
      </button>
    </header>
  );
}
