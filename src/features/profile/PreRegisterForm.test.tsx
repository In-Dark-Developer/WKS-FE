import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import type { PreRegisterValues } from './formSchema';
import { PreRegisterForm } from './PreRegisterForm';

afterEach(cleanup);

const filled: Partial<PreRegisterValues> = {
  name: '김운꿰',
  email: 'wks@dongguk.edu',
  phone: '01012345678',
};

function renderForm(
  defaultValues: Partial<PreRegisterValues>,
  result: unknown = { status: 'done' },
) {
  const action = vi.fn(async () => result);
  const router = createMemoryRouter(
    [{ path: '/', element: <PreRegisterForm defaultValues={defaultValues} />, action }],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
  return action;
}

test('모든 항목에 라벨이 있고 전화번호는 필수, 인스타그램은 선택이다', () => {
  renderForm({});

  for (const name of [
    '이름',
    '이메일',
    '전화번호',
    '인스타그램 아이디 (선택)',
    '학과',
    '자기소개',
  ]) {
    expect(screen.getByLabelText(name)).toBeInTheDocument();
  }
  expect(screen.getByRole('combobox', { name: 'MBTI' })).toBeInTheDocument();
  expect(screen.getByText('보관 기간')).toBeInTheDocument();
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

  expect(await screen.findByText('이메일 형식을 확인해 주세요')).toBeInTheDocument();
  expect(screen.getByLabelText('이메일')).toHaveAttribute('aria-invalid', 'true');
  expect(action).not.toHaveBeenCalled();
});

test('전화번호가 비면 필드 오류를 보인다', async () => {
  renderForm({ ...filled, phone: '', agreed: true });

  fireEvent.click(screen.getByRole('button', { name: '사전 신청하기' }));

  expect(await screen.findByText('전화번호를 숫자 10~11자리로 입력해 주세요')).toBeInTheDocument();
});

test('제출이 성공하면 완료 상태를 보인다', async () => {
  const action = renderForm({ ...filled, instagram: '@wks.fe', agreed: true });

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
