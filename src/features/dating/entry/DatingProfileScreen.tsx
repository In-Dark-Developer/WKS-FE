import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { createDatingProfile } from '@/api/dating';
import { createResult } from '@/api/results';
import { uploadDatingPhoto } from '@/api/uploads';

import { DatingProfileForm, type ProfileSubmitState } from '../profile/DatingProfileForm';
import type { DatingPhotoView } from '../profile/photoView';
import type { DatingProfileInput } from '../profile/profileSchema';
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

  // '뒤로가기'는 들어온 길 그대로 돌아간다: (1/2) 를 거쳤으면 (1/2), 인트로에서 곧장 (2/2) 로 왔으면 인트로.
  // 이 화면이 첫 방문 기록이면(주소로 바로 열었거나 카카오 로그인에서 돌아왔으면) 돌아갈 곳이 없어 인트로로 간다.
  function handleBack() {
    if (location.key === 'default') void navigate(DATING_INTRO_PATH, { replace: true });
    else void navigate(-1);
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

  async function handleSubmit(input: DatingProfileInput) {
    if (submitState === 'submitting' || photo.photoId === undefined) return;
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
