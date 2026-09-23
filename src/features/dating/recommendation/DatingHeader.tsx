import requestBox from '@/ui/assets/dating/request-box.webp';
import threadYarn from '@/ui/assets/dating/thread-yarn.webp';
import { ThreadCount } from '@/ui/ThreadCount';

type Props = {
  balance: number;
  onOpenRequests: () => void;
};

// 소개팅 상단 — 왼쪽 '운명의 실'과 잔액, 오른쪽 요청함(Figma top_nav 91:1788).
export function DatingHeader({ balance, onOpenRequests }: Props) {
  return (
    <header className="-mx-16 -mt-16 flex items-end justify-between bg-opacity-card-rose-50-50 px-24 pt-8 pb-4">
      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center">
          <img alt="" className="h-32 w-[47px] object-contain" draggable={false} src={threadYarn} />
          <span className="text-ui-12 font-medium text-primary">운명의 실</span>
        </div>
        <ThreadCount count={balance} />
      </div>
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
