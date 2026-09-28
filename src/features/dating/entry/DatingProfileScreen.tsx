import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { createDatingProfile } from '@/api/dating';
import { sendDatingEmailCode, verifyDatingEmailCode } from '@/api/emailCodes';
import { createResult } from '@/api/results';
import { uploadDatingPhoto } from '@/api/uploads';

import { DatingProfileForm, type ProfileSubmitState } from '../profile/DatingProfileForm';
import type { EmailVerificationView } from '../profile/emailVerificationView';
import type { DatingPhotoView } from '../profile/photoView';
import type { DatingProfileInput } from '../profile/profileSchema';
import { toEmailVerificationError, toResendAt } from './emailVerification';
import { DATING_CARDS_PATH, DATING_INTRO_PATH } from './datingEntry';
import type { DatingProfileStart } from './profileLoader';

type Props = { start: DatingProfileStart };

type Photo = DatingPhotoView & { photoId?: string };

// 단계는 주소(`?step=`)에 둔다 — (1/2) → (2/2) 가 방문 기록에 쌓여야 뒤로가기가 (1/2) 로 돌아온다.
// 값이 없거나 틀리면 loader 가 정한 시작 단계다.
function readStep(value: string | null, fallback: 1 | 2): 1 | 2 {
  if (value === '1') return 1;
  if (value === '2') return 2;
  return fallback;
}

// SCR-16 프로필 등록 연결(FR-25) — 사진은 고르는 즉시 올리고, 제출은 (사주가 없으면) 사주 생성 → 프로필 저장
// 순서다. 어느 단계가 실패해도 입력값은 폼에 남고 실패 안내만 뜬다. 저장하면 Top 3 로 간다.
// 저장 요청에 resultId 를 싣지 않는다 — 백엔드가 계정에 연결된 결과를 쓴다(WKS-BE api-spec.md §10.2).
export function DatingProfileScreen({ start }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const step = readStep(searchParams.get('step'), start.initialStep);
  const [photo, setPhoto] = useState<Photo>({ status: 'empty' });
  const [submitState, setSubmitState] = useState<ProfileSubmitState>('idle');
  // 사주를 한 번 만들었으면 프로필 저장만 다시 시도한다 — 재시도마다 새 결과가 생기지 않게.
  const [resultId, setResultId] = useState(start.resultId);
  // 학교 메일 코드 인증(FR-25) — 인증을 마친 주소를 기억해, 메일을 고치면 처음 상태로 돌아간다.
  const [emailVerification, setEmailVerification] = useState<EmailVerificationView>({
    status: 'idle',
  });
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  // 미리보기 주소는 사진을 바꾸거나 화면을 떠날 때 놓는다.
  const previewUrl = photo.previewUrl;
  useEffect(() => {
    if (previewUrl === undefined) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // (1/2) → (2/2) 는 기록을 쌓고, 제출 때 (1/2) 로 되돌리는 건 기록을 바꾼다 — 뒤로가기에 같은 단계가 두 번 남지 않게.
  function handleStepChange(next: 1 | 2) {
    void navigate({ search: `?step=${next}` }, { replace: next === 1 });
  }

  // (2/2) 의 '뒤로가기'는 들어온 길 그대로 돌아간다: (1/2) 를 거쳤으면 (1/2), 인트로에서 곧장 (2/2) 로
  // 왔으면 인트로. 이 화면이 첫 방문 기록이면(주소로 바로 열었거나 카카오 로그인에서 돌아왔으면)
  // 돌아갈 곳이 없어 인트로로 간다.
  // (1/2) 는 늘 인트로로 간다 — 등록을 그만두고 사주를 보러 가거나 다른 일을 하러 갈 수 있게(QA 2026-09-29).
  // 로그인은 쿠키가 들고 있어 화면만 바뀐다. `replace` 로 가 브라우저 뒤로가기에 (1/2) 가 다시 나오지 않는다.
  function handleBack() {
    if (step === 1 || location.key === 'default') {
      void navigate(DATING_INTRO_PATH, { replace: true });
      return;
    }
    void navigate(-1);
  }

  async function handlePhotoSelect(file: File) {
    const nextPreview = URL.createObjectURL(file);
    setPhoto({ status: 'uploading', previewUrl: nextPreview });
    const outcome = await uploadDatingPhoto(file);
    if (!outcome.ok) {
      console.error('사진 업로드 실패', outcome.error);
      setPhoto({ status: 'error' });
      return;
    }
    setPhoto({ status: 'uploaded', previewUrl: nextPreview, photoId: outcome.data.photoId });
  }

  // 사주가 없으면 먼저 만든다 — 계정 연결은 백엔드가 로그인 때 한다(§9 연결·복원 규칙).
  async function ensureResultId(input: DatingProfileInput): Promise<string | null> {
    if (resultId !== null) return resultId;
    const created = await createResult(input.saju);
    if (!created.ok) {
      console.error('POST /results 실패', created.error);
      return null;
    }
    setResultId(created.data.resultId);
    return created.data.resultId;
  }

  async function handleSendCode(email: string) {
    if (emailVerification.status === 'sending') return;
    setEmailVerification((current) => ({ ...current, status: 'sending', error: undefined }));
    const outcome = await sendDatingEmailCode(email);
    if (!outcome.ok) {
      console.error('POST /dating/email-codes 실패', outcome.error);
      setEmailVerification({ status: 'idle', error: toEmailVerificationError(outcome.error) });
      return;
    }
    // 다시 보내면 백엔드가 이전 코드와 인증 상태를 무효로 한다 — 화면도 인증 전으로 되돌린다.
    setVerifiedEmail(null);
    setEmailVerification({
      status: 'sent',
      resendAvailableAt: toResendAt(outcome.data.resendAvailableAt),
    });
  }

  async function handleVerifyCode(email: string, code: string) {
    if (emailVerification.status === 'verifying') return;
    setEmailVerification((current) => ({ ...current, status: 'verifying', error: undefined }));
    const outcome = await verifyDatingEmailCode(email, code);
    if (!outcome.ok) {
      console.error('POST /dating/email-codes/verify 실패', outcome.error);
      setEmailVerification((current) => ({
        ...current,
        status: 'sent',
        error: toEmailVerificationError(outcome.error),
      }));
      return;
    }
    setVerifiedEmail(outcome.data.email);
    setEmailVerification({ status: 'verified' });
  }

  async function handleSubmit(input: DatingProfileInput) {
    if (submitState === 'submitting' || photo.photoId === undefined) return;
    // 인증을 마친 주소로만 등록한다(FR-25) — 인증 뒤 메일을 고쳤으면 그 주소로 다시 받아야 한다.
    if (input.details.email !== verifiedEmail) {
      setEmailVerification((current) => ({
        ...current,
        status: current.status === 'verified' ? 'idle' : current.status,
        error: 'invalid-code',
      }));
      return;
    }
    setSubmitState('submitting');

    if ((await ensureResultId(input)) === null) {
      setSubmitState('failed');
      return;
    }

    const saved = await createDatingProfile({ photoId: photo.photoId, ...input.details });
    if (!saved.ok) {
      console.error('프로필 저장 실패', saved.error);
      setSubmitState('failed');
      return;
    }
    void navigate(DATING_CARDS_PATH, { replace: true });
  }

  return (
    <DatingProfileForm
      emailVerification={{
        onSendCode: (email) => void handleSendCode(email),
        onVerifyCode: (email, code) => void handleVerifyCode(email, code),
        view: emailVerification,
      }}
      initialValues={{ saju: start.saju }}
      onBack={handleBack}
      onPhotoSelect={(file) => void handlePhotoSelect(file)}
      onStepChange={handleStepChange}
      onSubmit={(input) => void handleSubmit(input)}
      photo={photo}
      step={step}
      submitState={submitState}
    />
  );
}
