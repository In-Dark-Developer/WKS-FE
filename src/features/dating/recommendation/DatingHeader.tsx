import requestBox from '@/ui/assets/dating/request-box.webp';
import threadYarn from '@/ui/assets/dating/thread-yarn.webp';
import { ThreadCount } from '@/ui/ThreadCount';

type Props = {
  balance: number;
  onOpenThreadGuide: () => void;
  onOpenRequests: () => void;
};

// 소개팅 상단 — 왼쪽 '운명의 실'과 잔액(누르면 재화 안내 모달), 오른쪽 요청함(Figma top_nav 91:1788).
export function DatingHeader({ balance, onOpenThreadGuide, onOpenRequests }: Props) {
  return (
    <header className="-mx-16 -mt-16 flex items-end justify-between bg-opacity-card-rose-50-50 px-24 pt-8 pb-4">
      <button
        aria-label={`운명의 실 ${balance}개 — 획득 방법 보기`}
        className="flex items-end gap-8"
        onClick={onOpenThreadGuide}
        type="button"
      >
        <span className="flex flex-col items-center">
          <img alt="" className="h-32 w-[47px] object-contain" draggable={false} src={threadYarn} />
          <span className="text-ui-12 font-medium text-primary">운명의 실</span>
        </span>
        <ThreadCount count={balance} />
      </button>
      <button className="flex flex-col items-center" onClick={onOpenRequests} type="button">
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
