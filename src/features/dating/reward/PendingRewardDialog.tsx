import { useEffect, useState } from 'react';

import { takePendingReward, type PendingReward } from '@/api/rewards';
import { getWallet } from '@/api/wallet';

import { RewardGrantedDialog } from './RewardGrantedDialog';

type Granted = PendingReward & { balance: number };

// 로그인 뒤 도착한 소개팅 화면에서 제휴 지급을 한 번만 알린다(FR-32 · SCR-23).
// 보관된 지급은 꺼내는 즉시 지워지므로 새로고침·재방문에 다시 뜨지 않는다.
export function PendingRewardDialog() {
  const [granted, setGranted] = useState<Granted | null>(null);

  useEffect(() => {
    const reward = takePendingReward();
    if (reward === null) return;

    let isActive = true;
    // 보유 수는 원장에서 읽는다 — 지급이 이미 반영돼 있다(FR-31).
    void getWallet().then((outcome) => {
      if (!isActive) return;
      if (!outcome.ok) {
        console.error('GET /wallet 실패', outcome.error);
        // 잔액을 못 읽어도 지급 사실은 알린다 — 받은 개수만 보인다.
        setGranted({ ...reward, balance: reward.amount });
        return;
      }
      setGranted({ ...reward, balance: outcome.data.balance });
    });
    return () => {
      isActive = false;
    };
  }, []);

  if (granted === null) return null;

  return (
    <RewardGrantedDialog
      amount={granted.amount}
      balance={granted.balance}
      onClose={() => setGranted(null)}
      open
      partnerName={granted.partnerName}
    />
  );
}
