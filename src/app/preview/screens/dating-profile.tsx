import { useState } from 'react';

import type { PreviewScreen } from '@/app/preview/previewScreen';
import {
  DatingProfileForm,
  type DatingPhotoView,
  type ProfileSubmitState,
} from '@/features/dating';
import fakePhoto from '@/ui/assets/zodiac/zodiac-rabbit.webp';

const UPLOAD_DELAY_MS = 800;
const SUBMIT_DELAY_MS = 1200;

const saju = {
  gender: 'FEMALE',
  birthDate: '20030517',
  birthTime: '12:30',
  nickname: '달빛토끼',
} as const;

const details = {
  name: '김채원',
  email: 'chaewon@dgu.ac.kr',
  contactValue: '01012345678',
  department: '컴퓨터공학과',
  mbti: 'ENTP',
  bio: '처음에는 조금 낯을 가리지만 친해지면 장난도 많아요. 영화나 전시 보러 가는 걸 좋아해요.',
} as const;

type Props = {
  initialStep?: 1 | 2;
  isFilled?: boolean;
  showErrorsInitially?: boolean;
};

// 업로드·제출은 가짜다 — 고른 사진을 잠시 뒤 미리보기로 보이고, 제출은 1.2초 뒤 연결 실패로 끝난다.
function FakeProfileForm({
  initialStep = 1,
  isFilled = false,
  showErrorsInitially = false,
}: Props) {
  const [photo, setPhoto] = useState<DatingPhotoView>(
    isFilled ? { status: 'uploaded', previewUrl: fakePhoto } : { status: 'empty' },
  );
  const [submitState, setSubmitState] = useState<ProfileSubmitState>('idle');
  const [step, setStep] = useState(initialStep);

  function handlePhotoSelect(file: File) {
    setPhoto({ status: 'uploading' });
    setTimeout(
      () => setPhoto({ status: 'uploaded', previewUrl: URL.createObjectURL(file) }),
      UPLOAD_DELAY_MS,
    );
  }

  function handleSubmit() {
    setSubmitState('submitting');
    setTimeout(() => setSubmitState('failed'), SUBMIT_DELAY_MS);
  }

  return (
    <DatingProfileForm
      initialValues={isFilled ? { saju, details } : undefined}
      onBack={() => setStep(1)}
      onPhotoSelect={handlePhotoSelect}
      onStepChange={setStep}
      onSubmit={handleSubmit}
      photo={photo}
      showErrorsInitially={showErrorsInitially}
      step={step}
      submitState={submitState}
    />
  );
}

// SCR-16 소개팅 프로필 등록 — 10/T4 퍼블리싱. 실제 업로드·등록은 연동 Task(10/T1).
export const preview: PreviewScreen = {
  title: 'SCR-16 소개팅 프로필 등록',
  order: 11,
  states: {
    '(1/2) 기본': () => <FakeProfileForm />,
    '(1/2) 오류': () => <FakeProfileForm showErrorsInitially />,
    '(2/2) 기본': () => <FakeProfileForm initialStep={2} />,
    '(2/2) 오류': () => <FakeProfileForm initialStep={2} showErrorsInitially />,
    '(2/2) 채움 → 연결 실패': () => <FakeProfileForm initialStep={2} isFilled />,
  },
};
