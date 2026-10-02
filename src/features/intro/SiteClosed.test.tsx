import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

const { submitFeedbackMock } = vi.hoisted(() => ({ submitFeedbackMock: vi.fn() }));
vi.mock('@/api/feedbacks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/feedbacks')>();
  return { ...actual, submitFeedback: submitFeedbackMock };
});

import { SiteClosed } from './SiteClosed';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  // jsdom 에는 navigator.clipboard 가 없다 — 시험이 심은 것을 지운다.
  Reflect.deleteProperty(navigator, 'clipboard');
});

test('피드백을 적어 보내면 앞뒤 공백을 지워 서버로 보내고 안내 화면으로 돌아온다', async () => {
  submitFeedbackMock.mockResolvedValue({ ok: true, data: { message: '접수' } });
  render(<SiteClosed />);

  fireEvent.click(screen.getByRole('button', { name: '다음을 위한 피드백 남기기' }));
  const submit = screen.getByRole('button', { name: '피드백 실 전달하기' });
  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByRole('textbox', { name: '피드백' }), {
    target: { value: '  궁합 지도가 좋았어요  ' },
  });
  fireEvent.click(submit);

  expect(submitFeedbackMock).toHaveBeenCalledWith('궁합 지도가 좋았어요');
  expect(
    await screen.findByRole('button', { name: '다음을 위한 피드백 남기기' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('피드백 실이 잘 전달됐어요');
});

test('보내지 못하면 피드백 화면에 남아 적은 글을 지키고 다시 보내라고 알린다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  submitFeedbackMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  render(<SiteClosed initialView="feedback" />);

  const textbox = screen.getByRole('textbox', { name: '피드백' });
  fireEvent.change(textbox, { target: { value: '좋았어요' } });
  fireEvent.click(screen.getByRole('button', { name: '피드백 실 전달하기' }));

  expect(await screen.findByRole('status')).toHaveTextContent('피드백 실을 보내지 못했어요');
  expect(textbox).toHaveValue('좋았어요');
  expect(screen.getByRole('button', { name: '피드백 실 전달하기' })).toBeEnabled();
});

test('피드백 화면에서 뒤로가기를 누르면 사이트를 떠나지 않고 안내 화면으로 돌아온다', async () => {
  render(<SiteClosed />);

  fireEvent.click(screen.getByRole('button', { name: '다음을 위한 피드백 남기기' }));
  expect(screen.getByRole('textbox', { name: '피드백' })).toBeInTheDocument();

  window.history.back();

  expect(
    await screen.findByRole('button', { name: '다음을 위한 피드백 남기기' }),
  ).toBeInTheDocument();
  expect(submitFeedbackMock).not.toHaveBeenCalled();
});

test('공백만 적으면 보낼 수 없다', () => {
  render(<SiteClosed initialView="feedback" />);

  fireEvent.change(screen.getByRole('textbox', { name: '피드백' }), { target: { value: '   ' } });

  expect(screen.getByRole('button', { name: '피드백 실 전달하기' })).toBeDisabled();
});

test('운명과 이어졌다면 커피 모달에서 계좌번호를 복사하고, ESC 로 닫는다', async () => {
  const writeText = vi.fn(() => Promise.resolve());
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  render(<SiteClosed />);

  fireEvent.click(screen.getByRole('button', { name: '혹시 운명과 이어지셨나요?' }));
  const dialog = screen.getByRole('dialog', { name: '연결을 진심으로 축하드립니다.' });
  await act(async () => {
    fireEvent.click(within(dialog).getByRole('button', { name: '커피 사주기' }));
  });

  expect(writeText).toHaveBeenCalledWith('28370204038174');
  expect(screen.getByRole('status')).toHaveTextContent('국민은행 28370204038174');

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
