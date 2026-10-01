import type { FormEvent } from 'react';

import { DATING_PHOTO_ACCEPT } from '@/api/schema/dating';
import { Button } from '@/ui/Button';
import { Field } from '@/ui/Field';
import { PhotoUpload } from '@/ui/PhotoUpload';
import { SegmentedControl } from '@/ui/SegmentedControl';
import { Select } from '@/ui/Select';
import { TextArea } from '@/ui/TextArea';
import { TextField } from '@/ui/TextField';

import { EmailVerification } from './EmailVerification';
import type { EmailVerificationView } from './emailVerificationView';
import { BIO_MAX, DEPARTMENT_MAX, NAME_MAX, contactMethodOptions, mbtiOptions } from './options';
import { photoErrorMessage, type DatingPhotoView } from './photoView';
import type { DetailsField, DetailsStepValues } from './profileSchema';
import { StepHeader } from './StepHeader';

type Props = {
  values: DetailsStepValues;
  errors: Partial<Record<DetailsField, string>>;
  photo: DatingPhotoView;
  onPhotoSelect: (file: File) => void;
  onChange: (patch: Partial<DetailsStepValues>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasSubmitFailed: boolean;
  // 제출 실패 안내 — 원인을 아는 화면이 넘긴다(toProfileSubmitError).
  submitError?: string;
  // 등록 마감(readDatingCloseAt) 뒤면 '내 운명 찾아 떠나기'를 비활성하고 마감 안내를 버튼 위에 보인다.
  isClosed?: boolean;
  // 학교 메일 코드 인증 — 연동(10/T1) 전에는 넘기지 않아 인증 없는 메일 입력칸만 보인다.
  emailVerification?: {
    view: EmailVerificationView;
    onSendCode: () => void;
    onVerifyCode: (code: string) => void;
  };
};

const contactPlaceholder = {
  PHONE: '전화번호를 입력해 주세요',
  INSTAGRAM: '인스타그램 아이디를 입력해 주세요',
} as const;

// 업로드 조건은 uploadDatingPhoto 와 같다(JPEG·PNG, 10MB 이하). 문구는 Figma 사주입력폼 (2/2) 134:3639 그대로다.
// 실패 안내는 원인별로 다르다(photoErrorMessage) — 용량·형식·연결을 한 문구로 뭉뚱그리지 않는다(2026-09-29 QA).
// 마감 안내 — 디자인에 없는 상태라 문구는 2026-10-01 소유자 지시, 모양은 기존 토큰으로 그린다.
export const closedNotice = '새로운 인연 접수가 마감됐어요\n다음 인연 때 더 좋은 모습으로 만나요';

const photoGuide =
  'JPEG·PNG, 최대 10MB로 등록해주세요. 현재 화면과 동일하게 상대방에게 보여집니다.';

// (2/2) 이름·사진·학교 메일·연락처·학과·MBTI·자기소개 — Figma 사주입력폼 (2/2) 134:3639.
export function DetailsStep({
  values,
  errors,
  photo,
  onPhotoSelect,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
  hasSubmitFailed,
  submitError,
  isClosed = false,
  emailVerification,
}: Props) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isClosed) return;
    onSubmit();
  }

  return (
    <form className="flex flex-col gap-20" noValidate onSubmit={handleSubmit}>
      <StepHeader onBack={onBack} step={2} title={'소개팅에 들어갈 정보만\n입력하면 끝이에요'} />

      {/* min-w-0 — fieldset 은 기본으로 안쪽 가장 넓은 줄보다 좁아지지 않아 화면 밖으로 튀어나간다. */}
      <fieldset
        className="flex min-w-0 flex-col gap-24 disabled:opacity-80"
        disabled={isSubmitting}
      >
        <Field error={errors.name} help="작성자 이름을 입력해 주세요." label="이름">
          {(control) => (
            <TextField
              {...control}
              appearance="soft"
              autoComplete="name"
              className="bg-surface-default"
              maxLength={NAME_MAX}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="이름을 입력해 주세요"
              value={values.name}
            />
          )}
        </Field>

        <Field error={errors.photo} help="본인을 소개할 사진을 선택해 주세요." label="사진 추가">
          {(control) => (
            <PhotoUpload
              aria-describedby={control['aria-describedby']}
              id={control.id}
              accept={DATING_PHOTO_ACCEPT}
              message={
                photo.status === 'empty'
                  ? photoGuide
                  : photo.status === 'error'
                    ? photoErrorMessage(photo.failure)
                    : undefined
              }
              onSelect={onPhotoSelect}
              previewAlt="내 소개팅 사진"
              previewUrl={photo.previewUrl}
              status={photo.status}
            />
          )}
        </Field>

        {emailVerification ? (
          <EmailVerification
            email={values.email}
            emailError={errors.email}
            onEmailChange={(email) => onChange({ email })}
            onSendCode={emailVerification.onSendCode}
            onVerifyCode={emailVerification.onVerifyCode}
            view={emailVerification.view}
          />
        ) : (
          <Field
            error={errors.email}
            help="소속 확인을 위해 dgu 메일을 작성해주세요."
            label="이메일"
          >
            {(control) => (
              <TextField
                {...control}
                appearance="soft"
                autoComplete="email"
                className="bg-surface-default"
                inputMode="email"
                onChange={(event) => onChange({ email: event.target.value })}
                placeholder="example@domain.com"
                type="email"
                value={values.email}
              />
            )}
          </Field>
        )}

        <Field error={errors.contactValue} help="상대방에게 공개될 정보예요" label="연락처">
          {(control) => (
            <div className="flex flex-col gap-8">
              <SegmentedControl
                appearance="rose"
                label="연락 수단"
                onChange={(contactMethod) => onChange({ contactMethod, contactValue: '' })}
                options={contactMethodOptions}
                value={values.contactMethod}
              />
              <TextField
                {...control}
                appearance="soft"
                className="bg-surface-default"
                inputMode={values.contactMethod === 'PHONE' ? 'numeric' : 'text'}
                onChange={(event) => onChange({ contactValue: event.target.value })}
                placeholder={contactPlaceholder[values.contactMethod]}
                value={values.contactValue}
              />
            </div>
          )}
        </Field>

        <Field error={errors.department} help="소속 학과를 입력해 주세요." label="학과">
          {(control) => (
            <TextField
              {...control}
              appearance="soft"
              className="bg-surface-default"
              maxLength={DEPARTMENT_MAX}
              onChange={(event) => onChange({ department: event.target.value })}
              placeholder="학과를 입력해 주세요"
              value={values.department}
            />
          )}
        </Field>

        <Field error={errors.mbti} help="가장 최근에 확인한 유형을 골라 주세요." label="MBTI">
          {(control) => (
            <Select
              {...control}
              appearance="soft"
              className="bg-surface-default"
              onChange={(mbti) => onChange({ mbti })}
              options={mbtiOptions}
              placeholder="유형을 선택해 주세요"
              value={values.mbti}
            />
          )}
        </Field>

        <Field
          error={errors.bio}
          help="관심사나 함께하고 싶은 활동을 알려 주세요."
          label="자기소개"
        >
          {(control) => (
            <TextArea
              {...control}
              maxLength={BIO_MAX}
              onChange={(event) => onChange({ bio: event.target.value })}
              placeholder="나를 소개하는 이야기를 적어 주세요."
              value={values.bio}
            />
          )}
        </Field>

        {hasSubmitFailed && !isSubmitting ? (
          <p
            className="text-center text-ui-14 font-medium text-status-error-foreground"
            role="alert"
          >
            {submitError ?? '연결이 원활하지 않아요. 입력한 내용은 유지됩니다.'}
          </p>
        ) : null}
      </fieldset>

      {isClosed ? (
        <p
          className="text-center text-ui-14 font-medium whitespace-pre-line text-secondary"
          role="status"
        >
          {closedNotice}
        </p>
      ) : null}

      <Button disabled={isClosed} loading={isSubmitting} type="submit">
        내 운명 찾아 떠나기
      </Button>
    </form>
  );
}
