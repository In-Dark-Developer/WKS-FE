import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useActionData, useNavigation, useSubmit } from 'react-router-dom';

import { cn } from '@/lib/cn';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { Field } from '@/ui/Field';
import { Notice } from '@/ui/Notice';
import { PhotoUpload } from '@/ui/PhotoUpload';
import { SegmentedControl } from '@/ui/SegmentedControl';
import { Select } from '@/ui/Select';
import { TextArea } from '@/ui/TextArea';
import { TermsSheet } from '@/ui/TermsSheet';
import { TextField } from '@/ui/TextField';

import { consentNotice } from './consent';
import {
  BIO_MAX,
  initialPreRegisterValues,
  preRegisterActionDataSchema,
  validatePreRegister,
  type PreRegisterValues,
} from './formSchema';
import { contactMethodOptions, genderOptions, mbtiOptions, preferGenderOptions } from './options';
import { PreRegisterComplete } from './PreRegisterComplete';

type Props = {
  defaultValues?: Partial<PreRegisterValues>;
  // 완료 화면의 '확인' — 모달을 닫는 일은 조립하는 쪽이 한다.
  onDone?: () => void;
};

// 제출 실패 안내 — 연결 실패만 디자인(695:2644)에 있고, 나머지는 백엔드가 구분해 주는 경우다.
const submitFailureMessages = {
  connection: '신청을 완료하지 못했어요.\n입력 내용을 유지한 채 다시 시도해 주세요.',
  duplicate: '이미 신청한 이메일이에요.\n인증 메일을 확인해 주세요.',
  domain: '학교 웹메일로만 신청할 수 있어요.\n학교 계정으로 다시 입력해 주세요.',
} as const;

function ErrorLabel({ children, invalid }: { children: string; invalid: boolean }) {
  return <span className={cn(invalid && 'text-status-error-foreground')}>{children}</span>;
}

// SCR-09 사전신청 모달 본문 — Figma 「UI 최종 - 개발용」 수정본 사전신청 모달 기본·오류·로딩·연결 실패·완료(695:2614~2654).
// 검증을 통과하고 동의했을 때만 현재 라우트의 action 에 PreRegisterInput 을 JSON 으로 보낸다(FR-17).
// 연락처는 디자인의 전화/인스타 택1 세그먼트가 아니라 전화번호 필수 + 인스타그램 선택이다(FR-10).
export function PreRegisterForm({ defaultValues, onDone }: Props) {
  const [values, setValues] = useState<PreRegisterValues>({
    ...initialPreRegisterValues,
    ...defaultValues,
  });
  const [photoUrl, setPhotoUrl] = useState<string>();
  const photoUrlRef = useRef<string>(undefined);
  const [attempted, setAttempted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const submit = useSubmit();
  const submitting = useNavigation().state === 'submitting';
  const actionData = preRegisterActionDataSchema.safeParse(useActionData());

  // 미리보기 URL 은 브라우저 자원이라 사진을 바꾸거나 화면이 닫히면 돌려준다.
  useEffect(
    () => () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    },
    [],
  );

  if (actionData.success && 'status' in actionData.data)
    return <PreRegisterComplete mailSent={actionData.data.mailSent} onDone={onDone} />;

  const validation = validatePreRegister(values);
  const errors = attempted && !validation.success ? validation.fieldErrors : {};
  // 제출이 실패로 돌아왔을 때만 안내를 띄운다 — 다시 제출하는 동안에는 지운다.
  const failure =
    actionData.success && !submitting && 'formError' in actionData.data
      ? actionData.data.formError
      : null;

  function handlePhoto(file: File) {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = URL.createObjectURL(file);
    setPhotoUrl(photoUrlRef.current);
  }

  function update(patch: Partial<PreRegisterValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (validation.success && values.agreed) {
      submit(validation.data, { method: 'post', encType: 'application/json' });
    }
  }

  return (
    <form className="flex flex-col gap-24 pt-24" noValidate onSubmit={handleSubmit}>
      <header className="flex flex-col gap-12">
        <h1 className="font-display text-display-24 break-keep whitespace-pre-line text-primary">
          {'가을 축제,\n나에게 어떤 인연이 찾아올까?'}
        </h1>
        <p className="text-ui-12 font-medium text-disabled">
          내가 입력한 정보에 한해 상대방의 정보도 확인하실 수 있습니다.
        </p>
      </header>

      <fieldset className="flex flex-col gap-24 disabled:opacity-80" disabled={submitting}>
        <Field
          error={errors.name}
          help="신청자 이름을 입력해 주세요."
          label={<ErrorLabel invalid={Boolean(errors.name)}>이름</ErrorLabel>}
        >
          {(control) => (
            <TextField
              {...control}
              appearance="soft"
              autoComplete="name"
              onChange={(event) => update({ name: event.target.value })}
              placeholder="이름을 입력해 주세요"
              value={values.name}
            />
          )}
        </Field>

        <Field help="본인을 소개할 사진을 선택해 주세요." label="사진 추가">
          {(control) => (
            <PhotoUpload
              {...control}
              accept="image/*"
              onSelect={handlePhoto}
              previewAlt="선택한 사진"
              previewUrl={photoUrl}
              status={photoUrl ? 'uploaded' : 'empty'}
            />
          )}
        </Field>

        <Field
          error={errors.email}
          help="안내를 받을 이메일을 입력해 주세요."
          label={<ErrorLabel invalid={Boolean(errors.email)}>이메일</ErrorLabel>}
        >
          {(control) => (
            <TextField
              {...control}
              appearance="soft"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => update({ email: event.target.value })}
              placeholder="example@domain.com"
              type="email"
              value={values.email}
            />
          )}
        </Field>

        <Field
          error={errors.contactValue}
          help={
            values.contactMethod === 'PHONE'
              ? '연락받을 수단 한 가지를 선택해 주세요.'
              : '매칭이 성립한 상대에게만 보여요.'
          }
          label={<ErrorLabel invalid={Boolean(errors.contactValue)}>연락처</ErrorLabel>}
        >
          {(control) => (
            <div className="flex flex-col gap-8">
              <SegmentedControl
                appearance="accent"
                aria-describedby={control['aria-describedby']}
                label="연락 수단"
                onChange={(contactMethod) => update({ contactMethod, contactValue: '' })}
                options={contactMethodOptions}
                value={values.contactMethod}
              />
              {values.contactMethod === 'PHONE' ? (
                <TextField
                  {...control}
                  appearance="soft"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={11}
                  onChange={(event) =>
                    update({ contactValue: event.target.value.replace(/\D/g, '') })
                  }
                  placeholder="전화번호를 입력해 주세요"
                  type="tel"
                  value={values.contactValue}
                />
              ) : (
                <TextField
                  {...control}
                  appearance="soft"
                  autoCapitalize="none"
                  onChange={(event) => update({ contactValue: event.target.value })}
                  placeholder="@instagram"
                  value={values.contactValue}
                />
              )}
            </div>
          )}
        </Field>

        <Field help="소속 학과를 입력해 주세요." label="학과">
          {(control) => (
            <TextField
              {...control}
              appearance="soft"
              onChange={(event) => update({ department: event.target.value })}
              placeholder="학과를 입력해 주세요"
              value={values.department}
            />
          )}
        </Field>

        <Field help="가장 최근에 확인한 유형을 골라 주세요." label="MBTI">
          {(control) => (
            <Select
              {...control}
              appearance="soft"
              onChange={(mbti) => update({ mbti })}
              options={mbtiOptions}
              placeholder="유형을 선택해 주세요"
              value={values.mbti}
            />
          )}
        </Field>

        {/* 글자 수는 TextArea 가 스스로 그린다 — 안내 문구에 또 적지 않는다. */}
        <Field help="관심사나 함께하고 싶은 활동을 알려 주세요." label="자기소개">
          {(control) => (
            <TextArea
              {...control}
              maxLength={BIO_MAX}
              onChange={(event) => update({ bio: event.target.value })}
              placeholder="나를 소개하는 이야기를 적어 주세요."
              value={values.bio}
            />
          )}
        </Field>

        <Field
          error={errors.gender}
          help="소개팅 매칭에 쓰여요."
          label={<ErrorLabel invalid={Boolean(errors.gender)}>성별</ErrorLabel>}
        >
          {(control) => (
            <SegmentedControl
              appearance="accent"
              aria-describedby={control['aria-describedby']}
              label="성별"
              onChange={(gender) => update({ gender })}
              options={genderOptions}
              value={values.gender}
            />
          )}
        </Field>

        <Field
          error={errors.preferGender}
          help="어떤 인연을 찾고 있는지 알려 주세요."
          label={<ErrorLabel invalid={Boolean(errors.preferGender)}>찾는 인연</ErrorLabel>}
        >
          {(control) => (
            <SegmentedControl
              appearance="accent"
              aria-describedby={control['aria-describedby']}
              label="찾는 인연"
              onChange={(preferGender) => update({ preferGender })}
              options={preferGenderOptions}
              value={values.preferGender}
            />
          )}
        </Field>

        <Notice title={consentNotice.title}>
          <dl className="flex flex-col gap-4">
            {consentNotice.items.map(({ label, value }) => (
              <div className="flex gap-8" key={label}>
                <dt className="shrink-0 font-medium">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {/* 약관 전문은 시트로 연다 — 고지 요약은 위 목록, 동의는 아래 체크박스가 받는다(FR-17). */}
          <button
            className="mt-8 text-ui-12 font-medium text-primary underline"
            onClick={() => setTermsOpen(true)}
            type="button"
          >
            이용약관 자세히 보기
          </button>
        </Notice>
        <Checkbox
          checked={values.agreed}
          label={consentNotice.agreeLabel}
          onChange={(event) => update({ agreed: event.target.checked })}
        />
      </fieldset>

      {failure ? (
        <p
          className="text-center text-ui-12 whitespace-pre-line text-status-error-foreground"
          role="alert"
        >
          {submitFailureMessages[failure]}
        </p>
      ) : null}

      <TermsSheet onClose={() => setTermsOpen(false)} open={termsOpen} />

      <Button
        disabled={!values.agreed}
        loading={submitting}
        size="l"
        type="submit"
        variant="accent"
      >
        {failure === 'connection' ? '다시 신청하기' : '사전 신청하기'}
      </Button>
    </form>
  );
}
