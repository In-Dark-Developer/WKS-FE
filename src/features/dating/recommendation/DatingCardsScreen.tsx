import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';

import { rerollRecommendations } from '@/api/dating';
import { sendDatingRequest } from '@/api/matchRequests';
import { Toast } from '@/ui/Toast';

import { SendThreadDialog, ThreadSentDialog } from '../thread/ThreadDialogs';
import { UnlockDialog } from '../unlock/UnlockDialog';
import { UnlockDoneDialog } from '../unlock/UnlockDoneDialog';
import { toUnlockOptions, unlockItems } from '../unlock/unlockFlow';
import type { UnlockItem } from '../unlock/unlockView';
import { DatingCards } from './DatingCards';
import type { DatingCardsView } from './cardsView';

type Props = { view: DatingCardsView };

export const REROLL_FAILED_MESSAGE = '다시 점지하지 못했어요. 인연은 그대로예요.';
export const UNLOCK_SHORT_MESSAGE = '운명의 실이 부족해 열지 못했어요.';
export const UNLOCK_FAILED_MESSAGE = '정보를 열지 못했어요. 실은 쓰이지 않았어요.';
export const UNLOCK_PARTIAL_MESSAGE = '나머지 정보는 열지 못했어요. 다시 시도해 주세요.';
export const THREAD_FAILED_MESSAGE = '운명의 실을 보내지 못했어요. 요청함에 넣지 않았어요.';

// SCR-17 오늘의 인연 Top 3 연결(FR-26 · FR-27). 잔액·잠금 비용은 백엔드 값을 그대로 보이고 화면은 계산하지 않는다.
// 해금(FR-28, 11/T1): 카드의 '열람하기'·자물쇠 → 해금 모달(SCR-18) → 고른 항목을 하나씩 연다 → 완료 모달.
// 운명의 실 보내기(FR-29, 11/T2): 열지 않은 항목이 남았으면 확인 모달 → 전송 → 보낸 뒤 모달('보러가기'는 요청함).
export function DatingCardsScreen({ view }: Props) {
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [confirmSendId, setConfirmSendId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSentOpen, setSentOpen] = useState(false);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState<{ items: UnlockItem[]; balance: number } | null>(null);
  const unlockTarget = view.candidates.find((candidate) => candidate.id === unlockingId);

  async function sendThread(candidateId: string) {
    setConfirmSendId(null);
    setIsSending(true);
    const outcome = await sendDatingRequest(candidateId);
    setIsSending(false);
    if (!outcome.ok) {
      // 실패하면 요청함에 넣지 않는다(FR-29) — 백엔드가 만들지 않았다.
      console.error('POST /dating/requests 실패', outcome.error);
      setFailedMessage(THREAD_FAILED_MESSAGE);
      return;
    }
    setSentOpen(true);
    // 보낸 상대의 카드에서 해금·보내기를 거둔다(FR-29).
    void revalidator.revalidate();
  }

  function handleSendThread(candidateId: string) {
    if (isSending) return;
    const candidate = view.candidates.find((each) => each.id === candidateId);
    if (candidate === undefined || candidate.isThreadSent) return;
    const hasLocked = [
      candidate.photo,
      candidate.name,
      candidate.department,
      candidate.reason,
    ].some((field) => field.isLocked);
    // 열지 않은 항목이 남았으면 '보낸 뒤에는 더 볼 수 없다'를 먼저 확인받는다(FR-29).
    if (hasLocked) setConfirmSendId(candidateId);
    else void sendThread(candidateId);
  }

  async function handleUnlock(candidateId: string, items: readonly UnlockItem[]) {
    setUnlockingId(null);
    setIsUnlocking(true);
    const run = await unlockItems(candidateId, items);
    setIsUnlocking(false);
    if (run.opened.length > 0 && run.balance !== null) {
      setUnlocked({ items: run.opened, balance: run.balance });
      // 열린 값과 잔액을 카드에 다시 그린다 — 값은 추천 응답이 원본이다.
      void revalidator.revalidate();
    }
    if (run.failure === 'short') setFailedMessage(UNLOCK_SHORT_MESSAGE);
    else if (run.failure === 'error') {
      setFailedMessage(run.opened.length > 0 ? UNLOCK_PARTIAL_MESSAGE : UNLOCK_FAILED_MESSAGE);
    }
  }

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
        onOpenRequests={() => void navigate('/dating/requests')}
        onOpenUnlock={(candidateId) => {
          // 여는 중에는 다시 열지 않는다 — 같은 항목을 두 번 부르는 일을 막는다(차감은 백엔드가 한 번만 한다).
          if (!isUnlocking) setUnlockingId(candidateId);
        }}
        onReroll={() => void handleReroll()}
        onSendThread={handleSendThread}
        view={view}
      />
      {unlockTarget === undefined ? null : (
        <UnlockDialog
          balance={view.balance}
          key={unlockTarget.id}
          onClose={() => setUnlockingId(null)}
          onConfirm={(items) => void handleUnlock(unlockTarget.id, items)}
          open
          options={toUnlockOptions(unlockTarget)}
        />
      )}
      <SendThreadDialog
        onClose={() => setConfirmSendId(null)}
        onSend={() => {
          if (confirmSendId !== null) void sendThread(confirmSendId);
        }}
        open={confirmSendId !== null}
      />
      <ThreadSentDialog
        onClose={() => setSentOpen(false)}
        onOpenRequests={() => void navigate('/dating/requests?tab=sent')}
        open={isSentOpen}
      />
      <UnlockDoneDialog
        balance={unlocked?.balance ?? 0}
        items={unlocked?.items ?? []}
        onClose={() => setUnlocked(null)}
        open={unlocked !== null}
      />
      <Toast
        message={failedMessage ?? ''}
        onClose={() => setFailedMessage(null)}
        open={failedMessage !== null}
      />
    </>
  );
}
