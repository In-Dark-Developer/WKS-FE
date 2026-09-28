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
import type { DatingPhotoView } from './photoView';
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

// 업로드 조건은 uploadDatingPhoto 와 같다(JPG·PNG, 10MB 이하). 실패하면 무엇을 확인할지 같은 조건으로 알린다.
const photoGuide =
  'JPG·PNG, 10MB 이하 사진을 올려 주세요. 현재 화면과 동일하게 상대방에게 보여집니다.';
const photoErrorGuide = 'JPG·PNG, 10MB 이하 사진인지 확인하고 다시 시도해 주세요.';

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
  emailVerification,
}: Props) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="flex flex-col gap-20" noValidate onSubmit={handleSubmit}>
      <StepHeader onBack={onBack} step={2} title={'소개팅에 들어갈 정보만\n입력하면 끝이에요'} />

      {/* 칸이 화면 폭을 따라가게 하는 두 가지(QA 2026-09-29 — 칸이 통째로 오른쪽으로 삐져나갔다).
          `min-w-0`: 브라우저 기본 `fieldset { min-inline-size: min-content }` 이 Chrome 에서 칸을
          325px 아래로 줄지 못하게 했다(폭 357px 아래에서 삐져나감).
          `<fieldset>` 을 배치에 쓰지 않고 안쪽 `div` 가 세로로 쌓는다: WebKit(Safari)은 flex 로 쓴
          `fieldset` 의 폭을 내용 전체 폭(max-content)으로 잡아, 넓은 창에서도 삐져나갔다. */}
      <fieldset className="min-w-0 disabled:opacity-80" disabled={isSubmitting}>
        <div className="flex min-w-0 flex-col gap-24">
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
                      ? photoErrorGuide
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
              연결이 원활하지 않아요. 입력한 내용은 유지됩니다.
            </p>
          ) : null}
        </div>
      </fieldset>

      <Button loading={isSubmitting} type="submit">
        내 운명 찾아 떠나기
      </Button>
    </form>
  );
}
