import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { PreRegisterModal } from './PreRegisterModal';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function renderModal(onClose = vi.fn(), result: unknown = { status: 'done', mailSent: true }) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <PreRegisterModal
            defaultValues={{
              name: '김운꿰',
              email: 'wks@dongguk.edu',
              contactMethod: 'PHONE',
              contactValue: '01012345678',
              gender: 'MALE',
              preferGender: 'FEMALE',
              agreed: true,
            }}
            onClose={onClose}
            open
          />
        ),
        action: async () => result,
      },
    ],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
  return onClose;
}

test('모달 안에 사전신청 폼을 보이고 배경 스크롤을 잠근다', () => {
  renderModal();

  const dialog = screen.getByRole('dialog', { name: '사전신청' });
  expect(dialog).toContainElement(screen.getByRole('heading', { name: /가을 축제/ }));
  expect(document.body.style.overflow).toBe('hidden');
});

test('닫기 버튼과 ESC 로 닫는다', () => {
  const onClose = renderModal();

  fireEvent.click(screen.getByRole('button', { name: '닫기' }));
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(onClose).toHaveBeenCalledTimes(2);
});

test('신청이 끝나면 완료 화면의 확인으로 닫는다', async () => {
  const onClose = renderModal();

  fireEvent.click(screen.getByRole('button', { name: '사전 신청하기' }));
  fireEvent.click(await screen.findByRole('button', { name: '확인' }));

  expect(onClose).toHaveBeenCalledOnce();
});
