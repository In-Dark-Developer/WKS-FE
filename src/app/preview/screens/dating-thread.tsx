import type { PreviewScreen } from '@/app/preview/previewScreen';
import { SendThreadDialog, ThreadSentDialog } from '@/features/dating';

import { Cards } from './dating-cards';

const noop = () => {};

// SCR-19 운명의 실 확인 모달 — 11/T3 퍼블리싱. 전송 연결은 11/T2.
export const preview: PreviewScreen = {
  title: 'SCR-19 운명의 실 모달',
  order: 14,
  states: {
    '보내기 확인': () => (
      <>
        <Cards />
        <SendThreadDialog onClose={noop} onSend={noop} open />
      </>
    ),
    '보낸 뒤': () => (
      <>
        <Cards />
        <ThreadSentDialog onClose={noop} onOpenRequests={noop} open />
      </>
    ),
  },
};
