import { useId } from 'react';

import threadYarn from '@/ui/assets/dating/thread-yarn.webp';
import { Button } from '@/ui/Button';
import { ThreadCount } from '@/ui/ThreadCount';

import { DatingDialog } from '../DatingDialog';

type Props = {
  open: boolean;
  // 이번에 받은 개수와 받은 뒤 보유 수 — 둘 다 백엔드가 준 값이다(FR-32).
  amount: number;
  balance: number;
  partnerName: string;
  onClose: () => void;
};

// SCR-23 협업 실 지급 — Figma v1.0 「축사 연결」 1.2 로그인 성공(228:4441).
// 소개팅 공용 모달을 그대로 쓴다(퍼블리싱 Task 가 없는 화면이라 새 표현 컴포넌트를 만들지 않는다).
export function RewardGrantedDialog({ open, amount, balance, partnerName, onClose }: Props) {
  const titleId = useId();

  return (
    <DatingDialog labelledBy={titleId} onClose={onClose} open={open}>
      <img alt="" className="h-[64px] w-[94px] object-contain" draggable={false} src={threadYarn} />

      <div className="flex flex-col items-center gap-12 text-center">
        <h2 className="font-display text-display-20 text-apricot-900" id={titleId}>
          운명의 실이
          <br />
          지급되었어요!
        </h2>
        <p className="text-ui-14 text-secondary">
          {partnerName}에서 오신 것을 환영해요.
          <br />
          운명의 실 {amount}개를 드렸어요.
        </p>
        <ThreadCount count={balance} />
      </div>

      <Button className="w-full" onClick={onClose} size="m">
        운명의 짝 찾아보기
      </Button>
    </DatingDialog>
  );
}
