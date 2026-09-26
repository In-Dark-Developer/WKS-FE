import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';

import { acceptDatingRequest, cancelDatingRequest, rejectDatingRequest } from '@/api/matchRequests';
import { Toast } from '@/ui/Toast';

import { RequestInbox } from './RequestInbox';
import type { RequestInboxView, RequestTab } from './requestsView';

type Props = { view: RequestInboxView; initialTab?: RequestTab };

export const ACCEPTED_MESSAGE = '인연이 닿았어요! 카드에서 연락처를 확인하세요.';
export const RESPOND_FAILED_MESSAGE = '응답하지 못했어요. 잠시 후 다시 시도해 주세요.';
export const CANCELLED_MESSAGE = '요청을 취소했어요.';
export const CANCEL_FAILED_MESSAGE = '요청을 취소하지 못했어요. 잠시 후 다시 시도해 주세요.';

// SCR-20 요청함 연결(FR-30) — 수락하면 성립해 상대 연락처가 카드에 보이고, 거절하면 보이지 않는다.
// 보낸 신청은 응답 전에만 취소할 수 있고, 취소하면 목록에서 빠진다.
export function DatingRequestsScreen({ view, initialTab }: Props) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [message, setMessage] = useState<string | null>(null);

  async function respond(requestId: string, answer: 'accept' | 'decline') {
    const outcome =
      answer === 'accept'
        ? await acceptDatingRequest(requestId)
        : await rejectDatingRequest(requestId);
    if (!outcome.ok) {
      console.error('요청 응답 실패', outcome.error);
      setMessage(RESPOND_FAILED_MESSAGE);
      return;
    }
    if (answer === 'accept') setMessage(ACCEPTED_MESSAGE);
    void revalidator.revalidate();
  }

  // 상대가 먼저 응답했으면 409 — 어느 실패든 목록을 다시 읽어 지금 상태를 보인다.
  async function cancel(requestId: string) {
    const outcome = await cancelDatingRequest(requestId);
    if (!outcome.ok) {
      console.error('요청 취소 실패', outcome.error);
      setMessage(CANCEL_FAILED_MESSAGE);
    } else {
      setMessage(CANCELLED_MESSAGE);
    }
    void revalidator.revalidate();
  }

  return (
    <>
      <RequestInbox
        initialTab={initialTab}
        onAccept={(requestId) => void respond(requestId, 'accept')}
        onBack={() => void navigate('/dating/cards')}
        onCancel={(requestId) => void cancel(requestId)}
        onDecline={(requestId) => void respond(requestId, 'decline')}
        view={view}
      />
      <Toast message={message ?? ''} onClose={() => setMessage(null)} open={message !== null} />
    </>
  );
}
