import type { FormEvent } from 'react';

import { Button } from '@/ui/Button';
import { Checkbox } from '@/ui/Checkbox';
import { Field } from '@/ui/Field';
import { SegmentedControl } from '@/ui/SegmentedControl';
import { Select } from '@/ui/Select';
import { TextField } from '@/ui/TextField';

import { NICKNAME_MAX, birthTimeOptions, calendarOptions, genderOptions } from './options';
import type { SajuField, SajuStepValues } from './profileSchema';
import { StepHeader } from './StepHeader';

type Props = {
  values: SajuStepValues;
  errors: Partial<Record<SajuField, string>>;
  onChange: (patch: Partial<SajuStepValues>) => void;
  onNext: () => void;
};

// (1/2) 사주 정보 — Figma 사주입력폼 (1/2) 134:3490. 값·오류는 DatingProfileForm 이 들고 있다.
export function SajuStep({ values, errors, onChange, onNext }: Props) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNext();
  }

  return (
    <form className="flex flex-col gap-20" noValidate onSubmit={handleSubmit}>
      <StepHeader step={1} title={'나의 운명을 찾기 위해\n본인의 사주를 입력해주세요.'} />

      <div className="flex flex-col gap-40">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-24 rounded-16 border border-default bg-opacity-card-neutral-0-50 px-12 pt-12 pb-16 backdrop-blur-[25px]">
            <Field error={errors.gender} help="성별을 선택해주세요" label="성별">
              {(control) => (
                <SegmentedControl
                  appearance="rose"
                  aria-describedby={control['aria-describedby']}
                  label="성별"
                  onChange={(gender) => onChange({ gender })}
                  options={genderOptions}
                  value={values.gender}
                />
              )}
            </Field>

            <Field help="생일의 달력 기준을 선택해 주세요." label="달력 기준">
              {(control) => (
                <div className="flex flex-col gap-8">
                  <SegmentedControl
                    appearance="rose"
                    aria-describedby={control['aria-describedby']}
                    label="달력 기준"
                    onChange={(calendarType) =>
                      onChange({
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
                      onChange={(event) => onChange({ isLeapMonth: event.target.checked })}
                    />
                  ) : null}
                </div>
              )}
            </Field>

            <Field error={errors.birthDate} help="숫자 8자리로 입력해 주세요." label="생년월일">
              {(control) => (
                <TextField
                  {...control}
                  appearance="soft"
                  autoComplete="bday"
                  className="bg-surface-default"
                  inputMode="numeric"
                  maxLength={8}
                  onChange={(event) =>
                    onChange({ birthDate: event.target.value.replace(/\D/g, '') })
                  }
                  placeholder="예: 20020101"
                  value={values.birthDate}
                />
              )}
            </Field>

            <Field error={errors.birthTime} label="태어난 시간">
              {(control) => (
                <div className="flex flex-col gap-8">
                  <Select
                    {...control}
                    appearance="soft"
                    disabled={values.birthTimeUnknown}
                    onChange={(birthTime) => onChange({ birthTime })}
                    options={birthTimeOptions}
                    placeholder="시간을 선택해 주세요"
                    value={values.birthTime}
                  />
                  <Checkbox
                    appearance="accent"
                    checked={values.birthTimeUnknown}
                    label="태어난 시간을 몰라요"
                    onChange={(event) =>
                      onChange({
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
            help={`${[...values.nickname].length}/${NICKNAME_MAX}`}
            label="닉네임"
          >
            {(control) => (
              <TextField
                {...control}
                appearance="soft"
                autoComplete="nickname"
                className={
                  errors.nickname ? 'bg-surface-default' : 'border-rose bg-surface-default'
                }
                onChange={(event) => onChange({ nickname: event.target.value })}
                placeholder="어떻게 불러드릴까요?"
                value={values.nickname}
              />
            )}
          </Field>
        </div>

        <div className="flex flex-col gap-8">
          <p className="text-ui-14 font-medium text-rose-500">입력 정보는 사주 확인에 사용됩니다</p>
          <p className="text-ui-12 text-secondary">서비스 목적과 정보 사용 안내를 확인해 주세요.</p>
        </div>

        <Button type="submit">다음으로</Button>
      </div>
    </form>
  );
}
