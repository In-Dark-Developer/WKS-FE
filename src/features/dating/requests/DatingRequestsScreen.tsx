import { useState } from 'react';
import { useNavigate, useRevalidator } from 'react-router-dom';

import { acceptDatingRequest, rejectDatingRequest } from '@/api/matchRequests';
import { Toast } from '@/ui/Toast';

import { RequestInbox } from './RequestInbox';
import type { RequestInboxView, RequestTab } from './requestsView';

type Props = { view: RequestInboxView; initialTab?: RequestTab };

export const ACCEPTED_MESSAGE = '인연이 닿았어요! 카드에서 연락처를 확인하세요.';
export const RESPOND_FAILED_MESSAGE = '응답하지 못했어요. 잠시 후 다시 시도해 주세요.';
// 백엔드에 요청 취소 경로가 없다(WKS-BE api-spec §11) — 문의 중이라 안내만 한다.
export const CANCEL_UNAVAILABLE_MESSAGE = '요청 취소는 아직 준비 중이에요.';

// SCR-20 요청함 연결(FR-30) — 수락하면 성립해 상대 연락처가 카드에 보이고, 거절하면 보이지 않는다.
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

  return (
    <>
      <RequestInbox
        initialTab={initialTab}
        onAccept={(requestId) => void respond(requestId, 'accept')}
        onBack={() => void navigate('/dating/cards')}
        onCancel={() => setMessage(CANCEL_UNAVAILABLE_MESSAGE)}
        onDecline={(requestId) => void respond(requestId, 'decline')}
        view={view}
      />
      <Toast message={message ?? ''} onClose={() => setMessage(null)} open={message !== null} />
    </>
  );
}
