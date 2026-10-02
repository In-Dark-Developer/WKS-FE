import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

const track = vi.fn();
vi.mock('@/lib/analytics', () => ({ track: (...args: unknown[]) => track(...args) }));

import { SiteClosed } from './SiteClosed';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // jsdom 에는 navigator.clipboard 가 없다 — 시험이 심은 것을 지운다.
  Reflect.deleteProperty(navigator, 'clipboard');
});

test('피드백을 적어 보내면 Amplitude 로 본문을 보내고 안내 화면으로 돌아온다', async () => {
  render(<SiteClosed />);

  fireEvent.click(screen.getByRole('button', { name: '다음을 위한 피드백 남기기' }));
  const submit = screen.getByRole('button', { name: '피드백 실 전달하기' });
  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByRole('textbox', { name: '피드백' }), {
    target: { value: '  궁합 지도가 좋았어요  ' },
  });
  fireEvent.click(submit);

  expect(track).toHaveBeenCalledWith('feedback_submitted', { text: '궁합 지도가 좋았어요' });
  expect(screen.getByRole('status')).toHaveTextContent('피드백 실이 잘 전달됐어요');
  expect(screen.getByRole('button', { name: '다음을 위한 피드백 남기기' })).toBeInTheDocument();
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

  expect(writeText).toHaveBeenCalledOnce();
  expect(screen.getByRole('status')).toHaveTextContent('계좌번호를 복사했어요');

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
