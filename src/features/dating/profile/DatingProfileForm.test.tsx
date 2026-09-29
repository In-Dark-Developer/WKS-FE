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

// 2026-09-29 QA: 백엔드가 사진을 거절해도 연결 문제로만 보였다 — 라우트가 정한 안내를 그대로 보인다.
test('제출 실패 안내가 주어지면 기본 연결 문구 대신 그것을 보인다', () => {
  render(
    <StepHost
      initialStep={2}
      initialValues={{ saju: validSaju, details: validDetails }}
      onPhotoSelect={vi.fn()}
      onSubmit={vi.fn()}
      photo={uploaded}
      submitError="사진을 등록하지 못했어요. 10MB 이하의 JPEG·PNG 사진으로 다시 올려 주세요."
      submitState="failed"
    />,
  );

  expect(screen.getByRole('alert')).toHaveTextContent('사진을 등록하지 못했어요');
  expect(screen.getByRole('alert')).not.toHaveTextContent('연결이 원활하지 않아요');
});

test('학교 메일이 아니면 제출하지 않고 메일 칸에 도메인 오류를 보인다', () => {
  const onSubmit = vi.fn();
  render(
    <StepHost
      initialStep={2}
      initialValues={{ saju: validSaju, details: { ...validDetails, email: 'me@gmail.com' } }}
      onPhotoSelect={vi.fn()}
      onSubmit={onSubmit}
      photo={uploaded}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));

  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText(profileErrorMessages.emailDomain)).toBeInTheDocument();
});

test('메일 인증 요청에는 (2/2) 의 지금 메일 값을 앞뒤 공백 없이 싣는다', () => {
  const onSendCode = vi.fn();
  const onVerifyCode = vi.fn();
  render(
    <StepHost
      emailVerification={{ view: { status: 'sent' }, onSendCode, onVerifyCode }}
      initialStep={2}
      initialValues={{ saju: validSaju, details: { ...validDetails, email: ' me@dgu.ac.kr ' } }}
      onPhotoSelect={vi.fn()}
      onSubmit={vi.fn()}
      photo={uploaded}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '재발송' }));
  fireEvent.change(screen.getByLabelText('인증 코드'), { target: { value: '654321' } });
  fireEvent.click(screen.getByRole('button', { name: '확인' }));

  expect(onSendCode).toHaveBeenCalledWith('me@dgu.ac.kr');
  expect(onVerifyCode).toHaveBeenCalledWith('me@dgu.ac.kr', '654321');
});

test('(2/2) 사진 칸은 JPEG·PNG 만 고르게 하고 올릴 수 있는 조건을 안내한다', () => {
  const { container } = render(
    <StepHost
      initialStep={2}
      onPhotoSelect={vi.fn()}
      onSubmit={vi.fn()}
      photo={{ status: 'empty' }}
    />,
  );

  expect(container.querySelector('input[type="file"]')).toHaveAttribute(
    'accept',
    'image/jpeg,image/png',
  );
  expect(screen.getByText(/JPEG·PNG, 최대 10MB로 등록해주세요/)).toBeInTheDocument();
});

test('원인을 모르는 사진 실패는 확인할 조건을 함께 알린다', () => {
  render(
    <StepHost
      initialStep={2}
      onPhotoSelect={vi.fn()}
      onSubmit={vi.fn()}
      photo={{ status: 'error' }}
    />,
  );

  expect(
    screen.getByText('JPEG·PNG, 10MB 이하 사진인지 확인하고 다시 시도해 주세요.'),
  ).toBeInTheDocument();
});

// 2026-09-29 QA: 용량이 넘쳐도 '연결이 원활하지 않아요' 로만 보였다 — 원인을 그대로 알린다.
test('용량 초과는 용량 문제라고 알린다', () => {
  render(
    <StepHost
      initialStep={2}
      onPhotoSelect={vi.fn()}
      onSubmit={vi.fn()}
      photo={{ status: 'error', failure: 'size' }}
    />,
  );

  expect(screen.getByText(/사진 용량이 10MB를 넘어요/)).toBeInTheDocument();
  expect(screen.queryByText(/연결이 원활하지 않아요/)).not.toBeInTheDocument();
});

test('형식이 맞지 않으면 형식 문제라고 알린다', () => {
  render(
    <StepHost
      initialStep={2}
      onPhotoSelect={vi.fn()}
      onSubmit={vi.fn()}
      photo={{ status: 'error', failure: 'type' }}
    />,
  );

  expect(screen.getByText(/JPEG·PNG 사진만 올릴 수 있어요/)).toBeInTheDocument();
});

// QA(2026-09-28): (2/2) MBTI 칸만 배경이 달라 보였다 — 다른 입력 칸과 같은 흰 배경이어야 한다.
test('(2/2) MBTI 칸은 다른 입력 칸과 같은 배경이다 (Figma 134:3639)', () => {
  render(
    <DatingProfileForm
      onBack={vi.fn()}
      onPhotoSelect={vi.fn()}
      onStepChange={vi.fn()}
      onSubmit={vi.fn()}
      photo={uploaded}
      step={2}
    />,
  );

  const mbti = screen.getByRole('combobox', { name: 'MBTI' });
  const department = screen.getByRole('textbox', { name: '학과' });

  expect(mbti).toHaveClass('bg-surface-default');
  // 학과 칸은 배경을 감싸는 요소가 갖는다 — 두 칸이 같은 토큰을 쓰는지 본다.
  expect(department.closest('div')).toHaveClass('bg-surface-default');
});

test('(2/2) 연락처 칸 아래에 상대방에게 공개된다고 안내한다', () => {
  render(
    <DatingProfileForm
      onBack={vi.fn()}
      onPhotoSelect={vi.fn()}
      onStepChange={vi.fn()}
      onSubmit={vi.fn()}
      photo={uploaded}
      step={2}
    />,
  );

  expect(screen.getByText('상대방에게 공개될 정보예요')).toBeInTheDocument();
});

// QA(2026-09-29 '화면 탈출'): fieldset 은 기본으로 안쪽 가장 넓은 줄보다 좁아지지 않아 폭 400px 이하 폰에서 넘쳤다.
test('(2/2) 입력 묶음은 화면 폭보다 넓어지지 않는다', () => {
  const { container } = render(
    <StepHost initialStep={2} onPhotoSelect={vi.fn()} onSubmit={vi.fn()} photo={uploaded} />,
  );

  expect(container.querySelector('fieldset')).toHaveClass('min-w-0');
});
