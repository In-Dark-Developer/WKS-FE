import { useState } from 'react';

import backIcon from '@/ui/assets/icons/angle-small-left.svg';
import { BlurredPhoto } from '@/ui/BlurredPhoto';
import { Icon } from '@/ui/Icon';
import { Tabs } from '@/ui/Tabs';

import { DatingBackdrop } from '../DatingBackdrop';
import { RequestDetail } from './RequestDetail';
import type { RequestInboxView, RequestProfileView, RequestTab } from './requestsView';

type Props = {
  view: RequestInboxView;
  onBack: () => void;
  // 보낸 신청 취소 · 받은 신청 수락/거절 — 요청 처리와 연락처 공개는 부르는 쪽이 한다(FR-30).
  onCancel: (requestId: string) => void;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  // 미리보기용 시작 상태.
  initialTab?: RequestTab;
  initialOpenId?: string;
};

const tabs = [
  { value: 'sent', label: '보낸 신청' },
  { value: 'received', label: '받은 신청' },
] as const;

// SCR-20 요청함 — Figma 보관함/내가보낸사람(109:1730) · 나에게보낸사람(109:2251) · 각 /모달(109:2397 · 109:2325).
export function RequestInbox({
  view,
  onBack,
  onCancel,
  onAccept,
  onDecline,
  initialTab = 'sent',
  initialOpenId,
}: Props) {
  const [tab, setTab] = useState<RequestTab>(initialTab);
  const [openId, setOpenId] = useState(initialOpenId);
  const rows: readonly RequestProfileView[] = tab === 'sent' ? view.sent : view.received;
  const sentOpen = tab === 'sent' ? view.sent.find((each) => each.id === openId) : undefined;
  const receivedOpen =
    tab === 'received' ? view.received.find((each) => each.id === openId) : undefined;

  function act(handler: (requestId: string) => void, requestId: string) {
    setOpenId(undefined);
    handler(requestId);
  }

  return (
    <div className="flex flex-col gap-24">
      <DatingBackdrop />
      <header className="-mx-16 -mt-16 flex h-[72px] items-center border-b border-neutral-0 px-16">
        <button
          className="flex items-center gap-16 text-ui-16 font-medium text-primary"
          onClick={onBack}
          type="button"
        >
          <Icon className="size-24" src={backIcon} />
          뒤로가기
        </button>
      </header>

      <div className="flex flex-col gap-12">
        <Tabs label="요청함" onChange={setTab} tabs={tabs} value={tab} />
        {rows.length === 0 ? (
          <p className="py-48 text-center text-ui-14 text-muted">
            {tab === 'sent' ? '아직 보낸 신청이 없어요.' : '아직 받은 신청이 없어요.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-8">
            {rows.map((request) => (
              <li key={request.id}>
                <RequestRow onOpen={() => setOpenId(request.id)} request={request} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {sentOpen ? (
        <RequestDetail
          kind="sent"
          onCancel={() => act(onCancel, sentOpen.id)}
          onClose={() => setOpenId(undefined)}
          request={sentOpen}
          status={sentOpen.status}
        />
      ) : null}
      {receivedOpen ? (
        <RequestDetail
          kind="received"
          onAccept={() => act(onAccept, receivedOpen.id)}
          onClose={() => setOpenId(undefined)}
          onDecline={() => act(onDecline, receivedOpen.id)}
          request={receivedOpen}
          status={receivedOpen.status}
        />
      ) : null}
    </div>
  );
}

// 목록 한 줄 — Figma Card/순위(109:1871). 누르면 상대 카드를 띄운다.
function RequestRow({ request, onOpen }: { request: RequestProfileView; onOpen: () => void }) {
  const { photo, name, score } = request;
  const photoSrc = photo.isLocked ? photo.thumbnailUrl : photo.url;

  return (
    <button
      className="flex w-full items-center justify-between gap-12 rounded-16 border border-rose-200 bg-opacity-card-neutral-0-80 p-16 text-left shadow-sm backdrop-blur-sm"
      onClick={onOpen}
      type="button"
    >
      <span className="flex min-w-0 items-center gap-12">
        {photoSrc === null ? (
          <span aria-hidden="true" className="size-40 shrink-0 rounded-999 bg-neutral-300" />
        ) : (
          <BlurredPhoto
            alt=""
            className="size-40 shrink-0 rounded-999 bg-neutral-300"
            isBlurred={photo.isLocked}
            src={photoSrc}
          />
        )}
        {name.isLocked ? (
          <span className="text-ui-16 font-semibold text-primary">
            <span aria-hidden="true" className="blur-sm select-none">
              ○○○
            </span>
            <span className="sr-only">이름을 열지 않은 인연</span>
          </span>
        ) : (
          <span className="truncate text-ui-16 font-semibold text-primary">{name.value}</span>
        )}
      </span>
      {score === null ? null : (
        <span className="flex shrink-0 items-center gap-12">
          <span className="font-display text-ui-12 text-primary">궁합점수</span>
          <span
            className="flex h-[28px] w-[60px] items-center justify-center rounded-999 border border-primary-50 font-display text-ui-12 shadow-sm"
            data-score-pill=""
          >
            {score}점
          </span>
        </span>
      )}
    </button>
  );
}
