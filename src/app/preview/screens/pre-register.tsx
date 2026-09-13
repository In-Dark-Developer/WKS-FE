import { useState } from 'react';

import type { PreviewScreen } from '@/app/preview/previewScreen';
import {
  PreRegisterComplete,
  PreRegisterForm,
  PreRegisterModal,
  PreRegisterTeaser,
} from '@/features/profile';

const SUBMIT_DELAY_MS = 1200;

const filled = {
  name: '김운꿰',
  email: 'wks@dongguk.edu',
  phone: '01012345678',
  department: '산업시스템공학과',
  mbti: 'ENFP',
  bio: '축제에서 같이 공연 볼 사람을 찾아요.',
  agreed: true,
} as const;

// 결과 화면 티저 → 사전신청 모달 흐름 — 실제 라우트(`/reading/:id/pre-register`) 연결은 조립 Task 가 한다.
function TeaserToModal() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <PreRegisterTeaser onApply={() => setOpen(true)} state="available" />
      <PreRegisterModal onClose={() => setOpen(false)} open={open} />
    </>
  );
}

// SCR-09 사전신청 모달·SCR-04 티저 — 06/T2. '모달' 은 02/T3 Modal 안, 나머지는 본문만 그린다.
// 제출하면 1.2초 로딩 뒤 '연결 실패' 상태에서는 연결 실패를, 나머지는 완료를 돌려준다.
export const preview: PreviewScreen = {
  title: 'SCR-09 사전신청',
  order: 4,
  backdrop: 'mist',
  states: {
    모달: TeaserToModal,
    기본: () => <PreRegisterForm />,
    '오류(이메일)': () => <PreRegisterForm defaultValues={{ ...filled, email: 'wks@dongguk' }} />,
    '연결 실패': () => <PreRegisterForm defaultValues={filled} />,
    완료: () => <PreRegisterComplete />,
    티저: () => (
      <div className="flex flex-col gap-16">
        <PreRegisterTeaser state="beforeOpen" />
        <PreRegisterTeaser state="available" />
        <PreRegisterTeaser state="closed" />
      </div>
    ),
  },
  action: async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
    const state = new URL(request.url).searchParams.get('state');
    return state === '연결 실패' ? { formError: 'connection' } : { status: 'done' };
  },
};
