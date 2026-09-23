import { cn } from '@/lib/cn';
import { ProfileCard } from '@/ui/ProfileCard';

import { CandidateBack, CandidateFront, CandidatePhotoLayer } from '../card/CandidateFaces';
import { DatingDialog } from '../DatingDialog';
import type { RequestProfileView, SentRequestView } from './requestsView';

type Props = { request: RequestProfileView; onClose: () => void } & (
  | { kind: 'sent'; status: SentRequestView['status']; onCancel: () => void }
  | { kind: 'received'; onAccept: () => void; onDecline: () => void }
);

// 요청함에서 한 사람을 눌렀을 때 뜨는 카드 — Figma 보관함/내가보낸사람/모달(109:2397) · 실패(118:2814) ·
// 나에게보낸사람 앞면(109:2498) · 뒷면(109:2542).
// 보낸 신청은 운명의 실을 보낸 뒤라 더 열 수 없고(FR-29), 받은 신청은 전부 열려 온다(FR-30).
export function RequestDetail(props: Props) {
  const { request, onClose } = props;

  return (
    <DatingDialog
      className="gap-0 rounded-12 bg-transparent p-0 shadow-none"
      label="신청한 인연 카드"
      onClose={onClose}
      open
    >
      <ProfileCard
        back={
          <CandidateBack
            department={request.department}
            name={request.name}
            photo={request.photo}
            reason={request.reason}
          />
        }
        background={<CandidatePhotoLayer photo={request.photo} />}
        front={
          <CandidateFront
            bio={request.bio}
            footer={<Actions {...props} />}
            mbti={request.mbti}
            rank={request.rank}
            relationLabel={request.relationLabel}
            score={request.score}
          />
        }
      />
    </DatingDialog>
  );
}

// 카드 아래 버튼 — Figma cardbutton(118:2869): 활성화(분홍) · 기본(흰) · 비활성화(짙은 회색).
function Actions(props: Props) {
  const pillClass = 'rounded-999 px-20 py-4 font-display text-ui-12 whitespace-nowrap';

  if (props.kind === 'received') {
    return (
      <>
        <button
          className={cn(pillClass, 'text-inverse')}
          data-accept-button=""
          onClick={props.onAccept}
          type="button"
        >
          인연이 되고 싶어요
        </button>
        <button
          className={cn(pillClass, 'bg-neutral-50 text-primary')}
          onClick={props.onDecline}
          type="button"
        >
          다음 기회에...
        </button>
      </>
    );
  }

  return props.status === 'FAILED' ? (
    <p className={cn(pillClass, 'bg-neutral-700 text-inverse')}>매칭에 실패했어요</p>
  ) : (
    <button
      className={cn(pillClass, 'bg-neutral-50 text-primary')}
      onClick={props.onCancel}
      type="button"
    >
      요청 취소
    </button>
  );
}
