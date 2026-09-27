import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';

import type { ApiFailure } from '@/api/client';
import { rerollRecommendations } from '@/api/dating';
import { sendDatingRequest } from '@/api/matchRequests';
import { Toast } from '@/ui/Toast';

import { SendThreadDialog, ThreadSentDialog } from '../thread/ThreadDialogs';
import { UnlockDialog } from '../unlock/UnlockDialog';
import { UnlockDoneDialog } from '../unlock/UnlockDoneDialog';
import { applyUnlockedValues, toUnlockOptions, unlockItems } from '../unlock/unlockFlow';
import type { UnlockItem } from '../unlock/unlockView';
import { DatingCards } from './DatingCards';
import type { DatingCardsView } from './cardsView';

type Props = { view: DatingCardsView };

export const REROLL_FAILED_MESSAGE = '다시 점지하지 못했어요. 인연은 그대로예요.';
export const REROLL_SHORT_MESSAGE = '운명의 실이 부족해 바꾸지 못했어요.';
export const REROLL_NO_MORE_MESSAGE = '지금은 새로 소개할 인연이 없어요. 인연은 그대로예요.';
export const UNLOCK_SHORT_MESSAGE = '운명의 실이 부족해 열지 못했어요.';
export const UNLOCK_FAILED_MESSAGE = '정보를 열지 못했어요. 실은 쓰이지 않았어요.';
export const THREAD_FAILED_MESSAGE = '운명의 실을 보내지 못했어요. 요청함에 넣지 않았어요.';

// 리롤 실패는 셋으로 갈린다 — 잔액 부족(402)·후보 소진(409)·그 밖. 셋 다 카드는 그대로다.
function rerollFailureMessage(error: ApiFailure): string {
  if (error.kind !== 'api') return REROLL_FAILED_MESSAGE;
  if (error.code === 'INSUFFICIENT_THREAD') return REROLL_SHORT_MESSAGE;
  if (error.code === 'DATING_NO_MORE_CANDIDATES') return REROLL_NO_MORE_MESSAGE;
  return REROLL_FAILED_MESSAGE;
}

// SCR-17 오늘의 인연 Top 3 연결(FR-26 · FR-27). 잔액·잠금 비용은 백엔드 값을 그대로 보이고 화면은 계산하지 않는다.
// 해금(FR-28, 11/T1): 카드의 '열람하기'·자물쇠 → 해금 모달(SCR-18) → 고른 항목을 하나씩 연다 → 완료 모달.
// 운명의 실 보내기(FR-29, 11/T2): 열지 않은 항목이 남았으면 확인 모달 → 전송 → 보낸 뒤 모달('보러가기'는 요청함).
// 해금 응답을 얹은 카드 — 얹은 때의 loader 값(base)이 바뀌면(재조회 완료·리롤) 버린다. 재조회 값이 원본이다.
type UnlockPatch = {
  base: DatingCardsView;
  balance: number;
  values: Readonly<Record<string, Partial<Record<UnlockItem, string>>>>;
};

function withPatch(view: DatingCardsView, patch: UnlockPatch | null): DatingCardsView {
  if (patch === null || patch.base !== view) return view;
  return {
    ...view,
    balance: patch.balance,
    candidates: view.candidates.map((candidate) => {
      const values = patch.values[candidate.id];
      return values === undefined ? candidate : applyUnlockedValues(candidate, values);
    }),
  };
}

export function DatingCardsScreen({ view: loaded }: Props) {
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [isRerolling, setIsRerolling] = useState(false);
  const [confirmSendId, setConfirmSendId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSentOpen, setSentOpen] = useState(false);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState<{ items: UnlockItem[]; balance: number } | null>(null);
  const [patch, setPatch] = useState<UnlockPatch | null>(null);
  const view = withPatch(loaded, patch);
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
    if (candidate === undefined || candidate.isThreadSent || candidate.isThreadReceived) return;
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
      const balance = run.balance;
      setUnlocked({ items: run.opened, balance });
      // 응답 값으로 카드를 곧바로 다시 그리고, 추천을 다시 읽어 원본으로 맞춘다.
      setPatch((previous) => ({
        base: loaded,
        balance,
        values: {
          ...(previous?.base === loaded ? previous.values : {}),
          [candidateId]: {
            ...(previous?.base === loaded ? previous.values[candidateId] : undefined),
            ...run.values,
          },
        },
      }));
      void revalidator.revalidate();
    }
    if (run.failure === 'short') setFailedMessage(UNLOCK_SHORT_MESSAGE);
    else if (run.failure === 'error') {
      setFailedMessage(UNLOCK_FAILED_MESSAGE);
      // 궁합 까닭 생성 실패(503)는 차감·해금이 이미 끝난 뒤다(§10.5) — 열린 항목과 잔액을 다시 읽는다.
      void revalidator.revalidate();
    }
  }

  // 잔액이 모자라면 확인 시트가 먼저 막는다(RerollSheet). 그래도 서버가 402 를 줄 수 있어 아래에서 다시 다룬다.
  // 서버는 연타를 막지 않는다 — 두 번 부르면 두 번 차감되므로(WKS-BE §10.4.1) 요청 중에는 여기서 막는다.
  async function handleReroll() {
    if (isRerolling) return;
    setIsRerolling(true);
    const outcome = await rerollRecommendations();
    setIsRerolling(false);
    if (!outcome.ok) {
      // 차감·교체가 실패하면 추천을 그대로 둔다(FR-27).
      console.error('리롤 실패', outcome.error);
      setFailedMessage(rerollFailureMessage(outcome.error));
      return;
    }
    // 잔액도 함께 바뀌므로 loader 를 다시 돌린다.
    void revalidator.revalidate();
  }

  return (
    <>
      <DatingCards
        onOpenReceived={() => void navigate('/dating/requests?tab=received')}
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
