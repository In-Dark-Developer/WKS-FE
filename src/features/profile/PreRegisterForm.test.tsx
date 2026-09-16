import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import type { PreRegisterValues } from './formSchema';
import { PreRegisterForm } from './PreRegisterForm';

afterEach(cleanup);

const filled: Partial<PreRegisterValues> = {
  name: '김운꿰',
  email: 'wks@dongguk.edu',
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  gender: 'MALE',
  preferGender: 'FEMALE',
};

function renderForm(
  defaultValues: Partial<PreRegisterValues>,
  result: unknown = { status: 'done', mailSent: true },
) {
  const action = vi.fn(async () => result);
  const router = createMemoryRouter(
    [{ path: '/', element: <PreRegisterForm defaultValues={defaultValues} />, action }],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
  return action;
}

test('모든 항목에 라벨이 있고 연락처는 수단 택1 이다', () => {
  renderForm({});

  for (const name of ['이름', '이메일', '연락처', '학과', '자기소개']) {
    expect(screen.getByLabelText(name)).toBeInTheDocument();
  }
  expect(screen.getByRole('combobox', { name: 'MBTI' })).toBeInTheDocument();
  for (const name of ['연락 수단', '성별', '찾는 인연']) {
    expect(screen.getByRole('radiogroup', { name })).toBeInTheDocument();
  }
  expect(screen.getByText('보관 기간')).toBeInTheDocument();
});

test('연락 수단을 인스타그램으로 바꾸면 값 칸이 비고 아이디를 받는다', () => {
  renderForm(filled);

  fireEvent.click(screen.getByRole('radio', { name: '인스타그램' }));

  expect(screen.getByLabelText('연락처')).toHaveValue('');
  expect(screen.getByLabelText('연락처')).toHaveAttribute('placeholder', '@instagram');
});

test('동의하기 전에는 제출 버튼이 잠겨 요청이 나가지 않는다', () => {
  const action = renderForm(filled);

  const submit = screen.getByRole('button', { name: '사전 신청하기' });
  expect(submit).toBeDisabled();
  fireEvent.submit(submit.closest('form')!);

  expect(action).not.toHaveBeenCalled();
});

test('이메일 형식이 틀리면 필드 오류를 보이고 요청하지 않는다', async () => {
  const action = renderForm({ ...filled, email: 'wks@dongguk', agreed: true });

  fireEvent.click(screen.getByRole('button', { name: '사전 신청하기' }));

  expect(await screen.findByText('이메일 주소를 확인해 주세요')).toBeInTheDocument();
  expect(screen.getByLabelText('이메일')).toHaveAttribute('aria-invalid', 'true');
  expect(action).not.toHaveBeenCalled();
});

test('전화번호가 비면 필드 오류를 보인다', async () => {
  renderForm({ ...filled, contactValue: '', agreed: true });

  fireEvent.click(screen.getByRole('button', { name: '사전 신청하기' }));

  expect(await screen.findByText('전화번호를 숫자 10~11자리로 입력해 주세요')).toBeInTheDocument();
});

test('제출이 성공하면 완료 상태를 보인다', async () => {
  const action = renderForm({ ...filled, agreed: true });

  fireEvent.click(screen.getByRole('button', { name: '사전 신청하기' }));

  expect(await screen.findByRole('heading', { name: '신청이 완료되었습니다' })).toBeInTheDocument();
  expect(action).toHaveBeenCalledOnce();
});

test('연결에 실패하면 입력값을 유지한 채 다시 신청하게 한다', async () => {
  renderForm({ ...filled, agreed: true }, { formError: 'connection' });

  fireEvent.click(screen.getByRole('button', { name: '사전 신청하기' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('신청을 완료하지 못했어요.');
  expect(screen.getByRole('button', { name: '다시 신청하기' })).toBeInTheDocument();
  expect(screen.getByLabelText('이름')).toHaveValue('김운꿰');
});

test('성별·찾는 인연을 고르지 않으면 필드 오류를 보이고 요청하지 않는다', async () => {
  const action = renderForm({ ...filled, gender: null, preferGender: null, agreed: true });

  fireEvent.click(screen.getByRole('button', { name: '사전 신청하기' }));

  expect(await screen.findByText('성별을 선택해 주세요')).toBeInTheDocument();
  expect(screen.getByText('어떤 인연을 찾는지 선택해 주세요')).toBeInTheDocument();
  expect(action).not.toHaveBeenCalled();
});
