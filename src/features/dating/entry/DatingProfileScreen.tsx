import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveDatingProfile } from '@/api/dating';
import { createResult } from '@/api/results';
import { uploadPhoto } from '@/api/uploads';

import { DatingProfileForm, type ProfileSubmitState } from '../profile/DatingProfileForm';
import type { DatingPhotoView } from '../profile/photoView';
import type { DatingProfileInput } from '../profile/profileSchema';
import { DATING_CARDS_PATH } from './datingEntry';
import type { DatingProfileStart } from './profileLoader';

type Props = { start: DatingProfileStart };

type Photo = DatingPhotoView & { photoKey?: string };

// SCR-16 프로필 등록 연결(FR-25) — 사진은 고르는 즉시 올리고, 제출은 (사주가 없으면) 사주 생성 → 프로필 저장
// 순서다. 어느 단계가 실패해도 입력값은 폼에 남고 실패 안내만 뜬다. 저장하면 Top 3 로 간다.
export function DatingProfileScreen({ start }: Props) {
  const navigate = useNavigate();
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

  async function handlePhotoSelect(file: File) {
    const nextPreview = URL.createObjectURL(file);
    setPhoto({ status: 'uploading', previewUrl: nextPreview });
    const outcome = await uploadPhoto(file);
    if (!outcome.ok) {
      console.error('사진 업로드 실패', outcome.error);
      setPhoto({ status: 'error' });
      return;
    }
    setPhoto({ status: 'uploaded', previewUrl: nextPreview, photoKey: outcome.data.photoKey });
  }

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
    if (submitState === 'submitting' || photo.photoKey === undefined) return;
    setSubmitState('submitting');

    const savedResultId = await ensureResultId(input);
    if (savedResultId === null) {
      setSubmitState('failed');
      return;
    }

    const saved = await saveDatingProfile({
      resultId: savedResultId,
      photoKey: photo.photoKey,
      ...input.details,
    });
    if (!saved.ok) {
      console.error('프로필 저장 실패', saved.error);
      setSubmitState('failed');
      return;
    }
    void navigate(DATING_CARDS_PATH, { replace: true });
  }

  return (
    <DatingProfileForm
      initialStep={start.initialStep}
      initialValues={{ saju: start.saju }}
      onPhotoSelect={(file) => void handlePhotoSelect(file)}
      onSubmit={(input) => void handleSubmit(input)}
      photo={photo}
      submitState={submitState}
    />
  );
}
