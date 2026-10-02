import { useState } from 'react';

import { DATING_PHOTO_ACCEPT } from '@/api/schema/dating';
import { DATING_PHOTO_MAX_BYTES, type PhotoUploadFailure } from '@/api/uploads';
import type { PreviewScreen } from '@/app/preview/previewScreen';
import {
  DatingProfileForm,
  toProfileSubmitError,
  type DatingPhotoView,
  type EmailVerificationView,
  type ProfileSubmitState,
} from '@/features/dating';
import fakePhoto from '@/ui/assets/zodiac/zodiac-rabbit.webp';

const UPLOAD_DELAY_MS = 800;
const SUBMIT_DELAY_MS = 1200;
const EMAIL_DELAY_MS = 800;
const RESEND_COOLDOWN_MS = 60_000;
// 가짜 인증은 이 코드만 받는다.
const FAKE_CODE = '123456';

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
  verification?: EmailVerificationView;
  // 사진 업로드 실패를 그대로 보여 주는 상태 — 고르지 않아도 그 안내가 떠 있다.
  photoFailure?: PhotoUploadFailure;
  // 제출 실패 안내 — 실제 화면은 백엔드 오류 코드로 정한다(toProfileSubmitError).
  submitError?: string;
  // 등록 마감 뒤 — 버튼 비활성과 마감 안내를 본다.
  isClosed?: boolean;
};

// 업로드·제출·메일 인증은 가짜다 — 인증 코드는 123456 만 맞다.
// 업로드·제출은 가짜다 — 고른 사진을 잠시 뒤 미리보기로 보이고, 제출은 1.2초 뒤 연결 실패로 끝난다.
function FakeProfileForm({
  initialStep = 1,
  isFilled = false,
  showErrorsInitially = false,
  verification = { status: 'idle' },
  photoFailure,
  submitError,
  isClosed = false,
}: Props) {
  const [photo, setPhoto] = useState<DatingPhotoView>(() => {
    if (photoFailure !== undefined) return { status: 'error', failure: photoFailure };
    return isFilled ? { status: 'uploaded', previewUrl: fakePhoto } : { status: 'empty' };
  });
  const [submitState, setSubmitState] = useState<ProfileSubmitState>('idle');
  const [step, setStep] = useState(initialStep);
  const [emailView, setEmailView] = useState(verification);

  function handleSendCode() {
    setEmailView({ status: 'sending' });
    setTimeout(
      () => setEmailView({ status: 'sent', resendAvailableAt: Date.now() + RESEND_COOLDOWN_MS }),
      EMAIL_DELAY_MS,
    );
  }

  function handleVerifyCode(_email: string, code: string) {
    setEmailView((current) => ({ ...current, status: 'verifying', error: undefined }));
    setTimeout(
      () =>
        setEmailView((current) =>
          code === FAKE_CODE
            ? { status: 'verified' }
            : { ...current, status: 'sent', error: 'invalid-code' },
        ),
      EMAIL_DELAY_MS,
    );
  }

  // 미리보기에서도 실제와 같은 조건으로 거른다 — 형식·용량 안내를 파일을 골라 확인할 수 있다.
  function handlePhotoSelect(file: File) {
    setPhoto({ status: 'uploading' });
    setTimeout(() => {
      if (!DATING_PHOTO_ACCEPT.split(',').includes(file.type)) {
        setPhoto({ status: 'error', failure: 'type' });
        return;
      }
      if (file.size > DATING_PHOTO_MAX_BYTES) {
        setPhoto({ status: 'error', failure: 'size' });
        return;
      }
      setPhoto({ status: 'uploaded', previewUrl: URL.createObjectURL(file) });
    }, UPLOAD_DELAY_MS);
  }

  function handleSubmit() {
    setSubmitState('submitting');
    setTimeout(() => setSubmitState('failed'), SUBMIT_DELAY_MS);
  }

  return (
    <DatingProfileForm
      closeAt={isClosed ? 0 : null}
      emailVerification={{
        view: emailView,
        onSendCode: handleSendCode,
        onVerifyCode: handleVerifyCode,
      }}
      initialValues={isFilled ? { saju, details } : undefined}
      onBack={() => setStep(1)}
      onPhotoSelect={handlePhotoSelect}
      onStepChange={setStep}
      onSubmit={handleSubmit}
      photo={photo}
      showErrorsInitially={showErrorsInitially}
      step={step}
      submitError={submitError}
      submitState={submitState}
    />
  );
}

// SCR-16 소개팅 프로필 등록 — 10/T4 퍼블리싱. 학교 메일 코드 인증은 10/T5. 실제 업로드·등록은 연동 Task(10/T1).
export const preview: PreviewScreen = {
  title: 'SCR-16 소개팅 프로필 등록',
  order: 11,
  states: {
    '(1/2) 기본': () => <FakeProfileForm />,
    '(1/2) 오류': () => <FakeProfileForm showErrorsInitially />,
    '(2/2) 기본': () => <FakeProfileForm initialStep={2} />,
    '(2/2) 오류': () => <FakeProfileForm initialStep={2} showErrorsInitially />,
    '(2/2) 채움 → 연결 실패': () => <FakeProfileForm initialStep={2} isFilled />,
    // 등록 마감(2026-10-02 02:00 KST) 뒤 — 제출 버튼 비활성과 마감 안내.
    '(2/2) 등록 마감': () => <FakeProfileForm initialStep={2} isClosed isFilled />,
    // 사진 업로드 실패 — 원인별 안내(2026-09-29 QA). 사진을 직접 골라도 형식·용량은 같은 안내가 뜬다.
    '(2/2) 사진 실패(형식)': () => <FakeProfileForm initialStep={2} photoFailure="type" />,
    '(2/2) 사진 실패(용량)': () => <FakeProfileForm initialStep={2} photoFailure="size" />,
    '(2/2) 사진 실패(크기)': () => <FakeProfileForm initialStep={2} photoFailure="pixels" />,
    '(2/2) 사진 실패(열 수 없음)': () => (
      <FakeProfileForm initialStep={2} photoFailure="unreadable" />
    ),
    '(2/2) 사진 실패(로그인 풀림)': () => <FakeProfileForm initialStep={2} photoFailure="auth" />,
    '(2/2) 사진 실패(거절)': () => <FakeProfileForm initialStep={2} photoFailure="rejected" />,
    '(2/2) 사진 실패(연결)': () => <FakeProfileForm initialStep={2} photoFailure="network" />,
    // 제출 실패 — 백엔드 오류 코드별 안내(toProfileSubmitError).
    '(2/2) 제출 실패(사진 거절)': () => (
      <FakeProfileForm
        initialStep={2}
        isFilled
        submitError={toProfileSubmitError({
          kind: 'api',
          code: 'INVALID_INPUT',
          message: '사진이 너무 큽니다.',
        })}
      />
    ),
    '(2/2) 제출 실패(이미 등록)': () => (
      <FakeProfileForm
        initialStep={2}
        isFilled
        submitError={toProfileSubmitError({
          kind: 'api',
          code: 'DATING_PROFILE_CONFLICT',
          message: '이미 등록된 프로필입니다.',
        })}
      />
    ),
    '(2/2) 제출 실패(로그인 풀림)': () => (
      <FakeProfileForm
        initialStep={2}
        isFilled
        submitError={toProfileSubmitError({
          kind: 'api',
          code: 'UNAUTHENTICATED',
          message: '로그인이 필요합니다.',
        })}
      />
    ),
    '(2/2) 메일 인증 코드 발송됨': () => (
      <FakeProfileForm
        initialStep={2}
        isFilled
        verification={{ status: 'sent', resendAvailableAt: Date.now() + RESEND_COOLDOWN_MS }}
      />
    ),
    '(2/2) 메일 인증 코드 오류': () => (
      <FakeProfileForm
        initialStep={2}
        isFilled
        verification={{ status: 'sent', error: 'invalid-code' }}
      />
    ),
    '(2/2) 메일 인증 발송 제한': () => (
      <FakeProfileForm
        initialStep={2}
        isFilled
        verification={{ status: 'idle', error: 'rate-limited' }}
      />
    ),
    '(2/2) 메일 인증 완료': () => (
      <FakeProfileForm initialStep={2} isFilled verification={{ status: 'verified' }} />
    ),
  },
};
