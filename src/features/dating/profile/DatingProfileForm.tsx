import { useState } from 'react';

import { DatingBackdrop } from '../DatingBackdrop';
import { DetailsStep } from './DetailsStep';
import type { DatingPhotoView } from './photoView';
import {
  initialDetailsStepValues,
  initialSajuStepValues,
  validateDetailsStep,
  validateSajuStep,
  type DatingProfileInput,
  type DetailsStepValues,
  type SajuStepValues,
} from './profileSchema';
import { SajuStep } from './SajuStep';

// 제출 상태 — 연동 Task 가 onSubmit 뒤의 요청 결과를 넘긴다. 'failed' 면 입력값을 둔 채 안내만 띄운다.
export type ProfileSubmitState = 'idle' | 'submitting' | 'failed';

type Props = {
  photo: DatingPhotoView;
  onPhotoSelect: (file: File) => void;
  // 두 단계를 모두 통과하면 한 번 부른다. 네트워크 호출은 부르는 쪽이 한다.
  onSubmit: (input: DatingProfileInput) => void;
  submitState?: ProfileSubmitState;
  // 지금 단계는 부르는 쪽이 갖는다 — 단계를 방문 기록에 쌓아 브라우저 뒤로가기가 이전 단계로 가게 한다.
  step: 1 | 2;
  onStepChange: (step: 1 | 2) => void;
  // (2/2) 의 '뒤로가기' — 어디로 돌아갈지(이전 단계 · 인트로)는 부르는 쪽이 정한다.
  onBack: () => void;
  // 아래 둘은 미리보기·복귀용 시작 상태다.
  initialValues?: {
    saju?: Partial<SajuStepValues>;
    details?: Partial<Omit<DetailsStepValues, 'isPhotoReady'>>;
  };
  showErrorsInitially?: boolean;
};

// SCR-16 소개팅 프로필 등록 — (1/2) 사주 정보 → (2/2) 이름·사진·학교 정보(FR-25).
export function DatingProfileForm({
  photo,
  onPhotoSelect,
  onSubmit,
  submitState = 'idle',
  step,
  onStepChange,
  onBack,
  initialValues,
  showErrorsInitially = false,
}: Props) {
  const [saju, setSaju] = useState<SajuStepValues>({
    ...initialSajuStepValues,
    ...initialValues?.saju,
  });
  const [details, setDetails] = useState({
    ...initialDetailsStepValues,
    ...initialValues?.details,
  });
  const [attempted, setAttempted] = useState({
    saju: showErrorsInitially && step === 1,
    details: showErrorsInitially && step === 2,
  });

  const sajuResult = validateSajuStep(saju);
  const detailsResult = validateDetailsStep({
    ...details,
    isPhotoReady: photo.status === 'uploaded',
  });
  const sajuErrors = attempted.saju && !sajuResult.success ? sajuResult.fieldErrors : {};
  const detailsErrors =
    attempted.details && !detailsResult.success ? detailsResult.fieldErrors : {};

  function handleNext() {
    setAttempted((current) => ({ ...current, saju: true }));
    if (sajuResult.success) onStepChange(2);
  }

  function handleSubmit() {
    setAttempted({ saju: true, details: true });
    // (2/2) 에서 곧바로 시작했을 수 있다 — (1/2) 가 틀렸으면 그 단계로 돌려보낸다.
    if (!sajuResult.success) {
      onStepChange(1);
      return;
    }
    if (detailsResult.success) onSubmit({ saju: sajuResult.data, details: detailsResult.data });
  }

  return (
    <>
      <DatingBackdrop />
      {step === 1 ? (
        <SajuStep
          errors={sajuErrors}
          onChange={(patch) => setSaju((current) => ({ ...current, ...patch }))}
          onNext={handleNext}
          values={saju}
        />
      ) : (
        <DetailsStep
          errors={detailsErrors}
          hasSubmitFailed={submitState === 'failed'}
          isSubmitting={submitState === 'submitting'}
          onBack={onBack}
          onChange={(patch) => setDetails((current) => ({ ...current, ...patch }))}
          onPhotoSelect={onPhotoSelect}
          onSubmit={handleSubmit}
          photo={photo}
          values={{ ...details, isPhotoReady: photo.status === 'uploaded' }}
        />
      )}
    </>
  );
}
