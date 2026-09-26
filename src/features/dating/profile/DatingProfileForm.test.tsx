import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState, type ComponentProps } from 'react';
import { afterEach, expect, test, vi } from 'vitest';

import { DatingProfileForm } from './DatingProfileForm';
import { profileErrorMessages } from './profileSchema';

afterEach(cleanup);

const validSaju = {
  gender: 'FEMALE',
  birthDate: '20030517',
  birthTimeUnknown: true,
  nickname: '달빛토끼',
} as const;

const validDetails = {
  name: '김채원',
  email: 'chaewon@dgu.ac.kr',
  contactValue: '01012345678',
  department: '컴퓨터공학과',
  mbti: 'ENTP',
  bio: '영화와 전시를 좋아해요.',
} as const;

const uploaded = { status: 'uploaded', previewUrl: '/me.webp' } as const;

type FormProps = ComponentProps<typeof DatingProfileForm>;

// 단계는 부르는 쪽이 갖는다 — 테스트에서는 상태 하나로 흉내 낸다.
function StepHost({
  initialStep = 1,
  ...props
}: Omit<FormProps, 'step' | 'onStepChange' | 'onBack'> & { initialStep?: 1 | 2 }) {
  const [step, setStep] = useState(initialStep);
  return (
    <DatingProfileForm {...props} onBack={() => setStep(1)} onStepChange={setStep} step={step} />
  );
}

test('(1/2) 를 비운 채 넘어가려 하면 오류를 보이고 (2/2) 로 가지 않는다', () => {
  render(<StepHost onPhotoSelect={vi.fn()} onSubmit={vi.fn()} photo={{ status: 'empty' }} />);

  fireEvent.click(screen.getByRole('button', { name: '다음으로' }));

  expect(screen.getByText(profileErrorMessages.gender)).toBeInTheDocument();
  expect(screen.getByText(profileErrorMessages.nickname)).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: '프로필 등록 1/2 단계' })).toBeInTheDocument();
});

test('두 단계를 통과하면 사주 정보와 학교 정보를 함께 onSubmit 으로 넘긴다', () => {
  const onSubmit = vi.fn();
  render(
    <StepHost
      initialValues={{ saju: validSaju, details: validDetails }}
      onPhotoSelect={vi.fn()}
      onSubmit={onSubmit}
      photo={uploaded}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '다음으로' }));
  expect(screen.getByRole('progressbar', { name: '프로필 등록 2/2 단계' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));

  expect(onSubmit).toHaveBeenCalledWith({
    saju: {
      gender: 'FEMALE',
      calendarType: 'SOLAR',
      isLeapMonth: false,
      birthDate: '2003-05-17',
      birthTime: null,
      nickname: '달빛토끼',
    },
    details: { ...validDetails, contactMethod: 'PHONE' },
  });
});

test('사진이 올라가지 않았으면 제출하지 않고 사진 오류를 보인다', () => {
  const onSubmit = vi.fn();
  render(
    <StepHost
      initialStep={2}
      initialValues={{ saju: validSaju, details: validDetails }}
      onPhotoSelect={vi.fn()}
      onSubmit={onSubmit}
      photo={{ status: 'empty' }}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));

  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText(profileErrorMessages.photo)).toBeInTheDocument();
});

test('연결에 실패하면 입력값을 둔 채 안내를 보인다', () => {
  render(
    <StepHost
      initialStep={2}
      initialValues={{ saju: validSaju, details: validDetails }}
      onPhotoSelect={vi.fn()}
      onSubmit={vi.fn()}
      photo={uploaded}
      submitState="failed"
    />,
  );

  expect(screen.getByRole('alert')).toHaveTextContent('연결이 원활하지 않아요');
  expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('김채원');
});
