import { useState, type FormEvent } from 'react';
import { useActionData, useNavigation, useSubmit } from 'react-router-dom';

import { cn } from '@/lib/cn';
import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { Field } from '@/ui/Field';
import { SegmentedControl } from '@/ui/SegmentedControl';
import { TermsSheet } from '@/ui/TermsSheet';
import { Select } from '@/ui/Select';
import { TextField } from '@/ui/TextField';

import { FortuneLoading } from './FortuneLoading';

import {
  initialSajuFormValues,
  sajuActionDataSchema,
  validateSajuForm,
  type SajuField,
  type SajuFormValues,
} from './formSchema';
import { NICKNAME_MAX, birthTimeOptions, calendarOptions, genderOptions } from './options';

// SCR-02 사주 입력 — Figma 「UI 최종 - 개발용」 수정본 기본·오류·연결문제·로딩중.
// 검증을 통과하면 현재 라우트의 action 에 SajuInput 을 JSON 으로 보낸다. action 은 연결 실패 시
// `{ formError: 'connection' }` 을 돌려주고, 폼은 입력값을 그대로 둔 채 안내한다.
// 모든 이름이 받침으로 끝나 조사는 '을'이다.
const fieldLabels: Record<SajuField, string> = {
  gender: '성별',
  calendarType: '달력 기준',
  birthDate: '생년월일',
  birthTime: '태어난 시간',
  nickname: '닉네임',
};
const fieldOrder: readonly SajuField[] = [
  'gender',
  'calendarType',
  'birthDate',
  'birthTime',
  'nickname',
];

function ErrorLabel({ children, invalid }: { children: string; invalid: boolean }) {
  return <span className={cn(invalid && 'text-status-error-foreground')}>{children}</span>;
}

type Props = {
  // 제목 아래 설명 — 공유 링크 입력(SCR-06)은 링크 주인 닉네임이 든 문구다(Figma 720:3653).
  description?: string;
  submitLabel?: string;
};

export function SajuForm({
  description = '생년월일로 점지받는 나의 인연',
  submitLabel = '점지 확인하기',
}: Props) {
  const [values, setValues] = useState<SajuFormValues>(initialSajuFormValues);
  const [attempted, setAttempted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const submit = useSubmit();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';
  // 제출부터 다음 화면이 뜰 때까지(action 뒤 redirect 의 loader 포함) 결과 대기 화면(SCR-03)을 보인다.
  // 폼은 숨기기만 해서 실패로 돌아와도 입력값이 남는다.
  const waiting = navigation.state !== 'idle' && navigation.formMethod !== undefined;
  const actionData = sajuActionDataSchema.safeParse(useActionData());

  const validation = validateSajuForm(values);
  const errors = attempted && !validation.success ? validation.fieldErrors : {};
  const firstInvalid = fieldOrder.find((field) => errors[field]);
  const formMessage = firstInvalid
    ? `${fieldLabels[firstInvalid]}을 확인한 뒤 다시 진행해 주세요.`
    : actionData.success && !submitting
      ? '연결이 원활하지 않아요. 입력한 내용은 유지됩니다.'
      : undefined;

  function update(patch: Partial<SajuFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (validation.success)
      submit(validation.data, { method: 'post', encType: 'application/json' });
  }

  const nicknameLength = [...values.nickname].length;

  return (
    <>
      {waiting ? <FortuneLoading state="loading" /> : null}
      <form
        className="flex flex-col gap-40 pt-24"
        hidden={waiting}
        noValidate
        onSubmit={handleSubmit}
      >
        <header className="flex flex-col gap-8">
          <h1 className="font-display text-display-28 text-primary">운명도 꿰어야 사랑이다</h1>
          <p className="text-ui-14 text-inverse">{description}</p>
        </header>

        <fieldset className="flex flex-col gap-24 disabled:opacity-80" disabled={submitting}>
          <div className="flex flex-col gap-24 rounded-16 border border-default bg-opacity-card-neutral-0-50 px-12 pt-12 pb-16 backdrop-blur-[25px]">
            <Field
              error={errors.gender}
              help="성별을 선택해 주세요"
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

            <Field help="생일의 달력 기준을 선택해 주세요." label="달력 기준">
              {(control) => (
                <div className="flex flex-col gap-8">
                  <SegmentedControl
                    appearance="accent"
                    aria-describedby={control['aria-describedby']}
                    label="달력 기준"
                    onChange={(calendarType) =>
                      update({
                        calendarType,
                        isLeapMonth: calendarType === 'LUNAR' && values.isLeapMonth,
                      })
                    }
                    options={calendarOptions}
                    value={values.calendarType}
                  />
                  {values.calendarType === 'LUNAR' ? (
                    <Checkbox
                      appearance="accent"
                      checked={values.isLeapMonth}
                      label="윤달이에요"
                      onChange={(event) => update({ isLeapMonth: event.target.checked })}
                    />
                  ) : null}
                </div>
              )}
            </Field>

            <Field
              error={errors.birthDate}
              help="숫자 8자리로 입력해 주세요."
              label={<ErrorLabel invalid={Boolean(errors.birthDate)}>생년월일</ErrorLabel>}
            >
              {(control) => (
                <TextField
                  {...control}
                  appearance="soft"
                  autoComplete="bday"
                  inputMode="numeric"
                  maxLength={8}
                  onChange={(event) => update({ birthDate: event.target.value.replace(/\D/g, '') })}
                  placeholder="예: 20020101"
                  value={values.birthDate}
                />
              )}
            </Field>

            <Field
              error={errors.birthTime}
              label={<ErrorLabel invalid={Boolean(errors.birthTime)}>태어난 시간</ErrorLabel>}
            >
              {(control) => (
                <div className="flex flex-col gap-8">
                  <Select
                    {...control}
                    appearance="soft"
                    disabled={values.birthTimeUnknown}
                    onChange={(birthTime) => update({ birthTime })}
                    options={birthTimeOptions}
                    placeholder="시간을 선택해 주세요"
                    value={values.birthTime}
                  />
                  <Checkbox
                    appearance="accent"
                    checked={values.birthTimeUnknown}
                    label="태어난 시간을 몰라요"
                    onChange={(event) =>
                      update({
                        birthTimeUnknown: event.target.checked,
                        birthTime: event.target.checked ? null : values.birthTime,
                      })
                    }
                  />
                </div>
              )}
            </Field>
          </div>

          <Field
            error={errors.nickname}
            help={`${nicknameLength}/${NICKNAME_MAX}`}
            label={<ErrorLabel invalid={Boolean(errors.nickname)}>닉네임</ErrorLabel>}
          >
            {(control) => (
              <TextField
                {...control}
                appearance="soft-apricot"
                autoComplete="nickname"
                onChange={(event) => update({ nickname: event.target.value })}
                placeholder="어떻게 불러드릴까요?"
                value={values.nickname}
              />
            )}
          </Field>

          {formMessage ? (
            <p
              className="text-center text-ui-14 font-medium text-status-error-foreground"
              role="alert"
            >
              {formMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-8">
            <p className="flex items-center gap-8 text-ui-14 font-medium text-apricot-500">
              입력 정보는 사주 확인에 사용됩니다
              <button className="underline" onClick={() => setTermsOpen(true)} type="button">
                자세히
              </button>
            </p>
            <p className="text-ui-12 text-secondary">
              서비스 목적과 정보 사용 안내를 확인해 주세요.
            </p>
          </div>
        </fieldset>

        <Button loading={submitting} type="submit" variant="apricot">
          {submitLabel}
        </Button>
      </form>

      <TermsSheet onClose={() => setTermsOpen(false)} open={termsOpen} />
    </>
  );
}
