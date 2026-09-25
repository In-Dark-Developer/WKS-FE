import { useState } from 'react';
import { useRevalidator } from 'react-router-dom';

import { rerollRecommendations } from '@/api/dating';
import { Toast } from '@/ui/Toast';

import { DatingCards } from './DatingCards';
import type { DatingCardsView } from './cardsView';

type Props = { view: DatingCardsView };

export const REROLL_FAILED_MESSAGE = '다시 점지하지 못했어요. 인연은 그대로예요.';

// SCR-17 오늘의 인연 Top 3 연결(FR-26 · FR-27). 잔액·잠금 비용은 백엔드 값을 그대로 보이고 화면은 계산하지 않는다.
// 해금(FR-28)·운명의 실 보내기(FR-29)·요청함(FR-30)은 Phase 11 이 붙인다 — 갈 화면이 아직 없어
// 지금은 눌러도 아무 일도 하지 않는다(없는 경로로 보내면 오류 화면이 뜬다).
export function DatingCardsScreen({ view }: Props) {
  const revalidator = useRevalidator();
  const [failedMessage, setFailedMessage] = useState<string | null>(null);

  // 잔액이 모자라면 확인 시트가 먼저 막는다(RerollSheet) — 여기까지 오지 않는다.
  async function handleReroll() {
    const outcome = await rerollRecommendations();
    if (!outcome.ok) {
      // 차감·교체가 실패하면 추천을 그대로 둔다(FR-27).
      console.error('리롤 실패', outcome.error);
      setFailedMessage(REROLL_FAILED_MESSAGE);
      return;
    }
    // 잔액도 함께 바뀌므로 loader 를 다시 돌린다.
    void revalidator.revalidate();
  }

  return (
    <>
      <DatingCards
        onOpenRequests={() => {}}
        onOpenUnlock={() => {}}
        onReroll={() => void handleReroll()}
        onSendThread={() => {}}
        view={view}
      />
      <Toast
        message={failedMessage ?? ''}
        onClose={() => setFailedMessage(null)}
        open={failedMessage !== null}
      />
    </>
  );
}
