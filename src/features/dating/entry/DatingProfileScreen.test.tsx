import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// 네트워크는 src/api/ 경계에서 대체한다(CONVENTIONS 8장).
const { createResultMock, saveDatingProfileMock, uploadPhotoMock } = vi.hoisted(() => ({
  createResultMock: vi.fn(),
  saveDatingProfileMock: vi.fn(),
  uploadPhotoMock: vi.fn(),
}));
vi.mock('@/api/results', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/results')>();
  return { ...actual, createResult: createResultMock };
});
vi.mock('@/api/dating', () => ({ saveDatingProfile: saveDatingProfileMock }));
vi.mock('@/api/uploads', () => ({ uploadPhoto: uploadPhotoMock }));

import { DatingProfileScreen } from './DatingProfileScreen';
import type { DatingProfileStart } from './profileLoader';

const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';
const NEW_RESULT_ID = '7b91d26f-2222-4222-8222-222222222222';

const filledSaju = {
  gender: 'FEMALE',
  calendarType: 'SOLAR',
  isLeapMonth: false,
  birthDate: '20030517',
  birthTime: null,
  birthTimeUnknown: true,
  nickname: '달빛토끼',
} as const;

beforeEach(() => {
  // jsdom 에는 미리보기 주소 API 가 없다.
  URL.createObjectURL = vi.fn(() => 'blob:preview');
  URL.revokeObjectURL = vi.fn();
  uploadPhotoMock.mockResolvedValue({ ok: true, data: { photoKey: 'mock-photos/1' } });
  saveDatingProfileMock.mockResolvedValue({ ok: true, data: null });
  createResultMock.mockResolvedValue({ ok: true, data: { resultId: NEW_RESULT_ID } });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

function renderScreen(start: DatingProfileStart) {
  const router = createMemoryRouter(
    [
      { path: '/dating/profile', element: <DatingProfileScreen start={start} /> },
      { path: '/dating/cards', element: <p>Top 3</p> },
    ],
    { initialEntries: ['/dating/profile'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

async function fillDetails() {
  fireEvent.change(screen.getByLabelText('사진 추가'), {
    target: { files: [new File(['x'], 'me.jpg', { type: 'image/jpeg' })] },
  });
  await screen.findByRole('img', { name: '내 소개팅 사진' });
  fireEvent.change(screen.getByRole('textbox', { name: '이름' }), { target: { value: '김채원' } });
  fireEvent.change(screen.getByRole('textbox', { name: '이메일' }), {
    target: { value: 'chaewon@dgu.ac.kr' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: '연락처' }), {
    target: { value: '01012345678' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: '학과' }), {
    target: { value: '컴퓨터공학과' },
  });
  fireEvent.click(screen.getByRole('combobox', { name: 'MBTI' }));
  fireEvent.click(screen.getByRole('option', { name: 'ENTP' }));
  fireEvent.change(screen.getByRole('textbox', { name: '자기소개' }), {
    target: { value: '영화와 전시를 좋아해요.' },
  });
}

const expectedDetails = {
  name: '김채원',
  email: 'chaewon@dgu.ac.kr',
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  department: '컴퓨터공학과',
  mbti: 'ENTP',
  bio: '영화와 전시를 좋아해요.',
};

test('사주가 있으면 (2/2) 만 받아 그 사주로 저장하고 Top 3 로 간다', async () => {
  const router = renderScreen({ initialStep: 2, resultId: RESULT_ID, saju: filledSaju });

  await fillDetails();
  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/dating/cards'));
  expect(createResultMock).not.toHaveBeenCalled();
  expect(saveDatingProfileMock).toHaveBeenCalledWith({
    resultId: RESULT_ID,
    photoKey: 'mock-photos/1',
    ...expectedDetails,
  });
});

test('저장이 실패하면 입력값을 둔 채 안내하고, 다시 저장할 때 사주를 새로 만들지 않는다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  saveDatingProfileMock.mockResolvedValueOnce({ ok: false, error: { kind: 'network' } });
  const router = renderScreen({ initialStep: 2, resultId: null, saju: filledSaju });

  await fillDetails();
  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));

  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('김채원');
  expect(router.state.location.pathname).toBe('/dating/profile');

  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));

  await vi.waitFor(() => expect(router.state.location.pathname).toBe('/dating/cards'));
  expect(createResultMock).toHaveBeenCalledTimes(1);
  expect(saveDatingProfileMock).toHaveBeenLastCalledWith(
    expect.objectContaining({ resultId: NEW_RESULT_ID }),
  );
});

test('사진 업로드가 실패하면 사진 칸에 알리고 저장하지 않는다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  uploadPhotoMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  renderScreen({ initialStep: 2, resultId: RESULT_ID, saju: filledSaju });

  fireEvent.change(screen.getByLabelText('사진 추가'), {
    target: { files: [new File(['x'], 'me.jpg', { type: 'image/jpeg' })] },
  });
  await vi.waitFor(() => expect(uploadPhotoMock).toHaveBeenCalled());
  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));

  expect(await screen.findByText('본인 사진을 한 장 올려 주세요')).toBeInTheDocument();
  expect(saveDatingProfileMock).not.toHaveBeenCalled();
});
