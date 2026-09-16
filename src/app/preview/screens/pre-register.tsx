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
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  department: '산업시스템공학과',
  mbti: 'ENFP',
  bio: '축제에서 같이 공연 볼 사람을 찾아요.',
  gender: 'MALE',
  preferGender: 'FEMALE',
  agreed: true,
} as const;

// 결과 화면 사전신청 섹션 → 모달 흐름 — 실제 라우트는 `/reading/:id/pre-register` 다(06/T4).
function TeaserToModal() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <PreRegisterTeaser onApply={() => setOpen(true)} />
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
    '이미 신청함': () => <PreRegisterForm defaultValues={filled} />,
    완료: () => <PreRegisterComplete />,
    티저: () => <PreRegisterTeaser />,
  },
  action: async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
    const state = new URL(request.url).searchParams.get('state');
    if (state === '연결 실패') return { formError: 'connection' };
    if (state === '이미 신청함') return { formError: 'duplicate' };
    return { status: 'done', mailSent: true };
  },
};
