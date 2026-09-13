import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { SajuForm } from './SajuForm';

afterEach(() => {
  cleanup();
});

function renderForm(action: (body: unknown) => Promise<unknown> | unknown) {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <SajuForm />,
      action: async ({ request }) => action(await request.json()),
    },
  ]);
  render(<RouterProvider router={router} />);
}

function fillValid() {
  fireEvent.click(screen.getByRole('radio', { name: '여자' }));
  fireEvent.change(screen.getByRole('textbox', { name: '생년월일' }), {
    target: { value: '2002-01-01' },
  });
  fireEvent.click(screen.getByRole('combobox', { name: '태어난 시간' }));
  fireEvent.click(screen.getByRole('option', { name: '묘시(卯時) 05:30 ~ 07:30' }));
  fireEvent.change(screen.getByRole('textbox', { name: '닉네임' }), { target: { value: '보살' } });
}

test('빈 폼을 제출하면 필드별 에러와 안내를 보이고 전송하지 않는다', async () => {
  const action = vi.fn();
  renderForm(action);

  fireEvent.click(screen.getByRole('button', { name: '점지 확인하기' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    '성별을 확인한 뒤 다시 진행해 주세요.',
  );
  expect(screen.getByRole('textbox', { name: '생년월일' })).toHaveAccessibleDescription(
    '생년월일을 숫자 8자리로 작성해 주세요',
  );
  expect(screen.getByRole('textbox', { name: '닉네임' })).toHaveAttribute('aria-invalid', 'true');
  expect(action).not.toHaveBeenCalled();
});

test('올바르게 입력하면 백엔드 입력 모양으로 전송한다', async () => {
  const action = vi.fn(() => null);
  renderForm(action);

  fillValid();
  fireEvent.click(screen.getByRole('button', { name: '점지 확인하기' }));

  await waitFor(() =>
    expect(action).toHaveBeenCalledWith({
      gender: 'FEMALE',
      calendarType: 'SOLAR',
      isLeapMonth: false,
      birthDate: '2002-01-01',
      birthTime: '06:30',
      nickname: '보살',
    }),
  );
});

test("'태어난 시간을 몰라요'를 체크하면 시간 선택이 막히고 null 로 보낸다", async () => {
  const action = vi.fn(() => null);
  renderForm(action);

  fillValid();
  fireEvent.click(screen.getByRole('checkbox', { name: '태어난 시간을 몰라요' }));

  expect(screen.getByRole('combobox', { name: '태어난 시간' })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: '점지 확인하기' }));

  await waitFor(() =>
    expect(action).toHaveBeenCalledWith(expect.objectContaining({ birthTime: null })),
  );
});

test('음력을 고르면 윤달 체크가 나타나고 함께 보낸다', async () => {
  const action = vi.fn(() => null);
  renderForm(action);

  fillValid();
  expect(screen.queryByRole('checkbox', { name: '윤달이에요' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('radio', { name: '음력' }));
  fireEvent.click(screen.getByRole('checkbox', { name: '윤달이에요' }));
  fireEvent.click(screen.getByRole('button', { name: '점지 확인하기' }));

  await waitFor(() =>
    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({ calendarType: 'LUNAR', isLeapMonth: true }),
    ),
  );
});

test('전송 중에는 로딩 버튼을 보이고 연결에 실패하면 입력값을 유지한 채 안내한다', async () => {
  let fail = () => {};
  renderForm(
    () =>
      new Promise((resolve) => {
        fail = () => resolve({ formError: 'connection' });
      }),
  );

  fillValid();
  fireEvent.click(screen.getByRole('button', { name: '점지 확인하기' }));

  expect(await screen.findByRole('button', { name: '처리 중' })).toBeDisabled();

  fail();

  expect(await screen.findByRole('alert')).toHaveTextContent(
    '연결이 원활하지 않아요. 입력한 내용은 유지됩니다.',
  );
  expect(screen.getByRole('textbox', { name: '닉네임' })).toHaveValue('보살');
  expect(screen.getByRole('textbox', { name: '생년월일' })).toHaveValue('20020101');
  expect(screen.getByRole('button', { name: '점지 확인하기' })).toBeEnabled();
});
