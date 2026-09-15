import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { IntroGate } from './IntroGate';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderGate() {
  return render(
    <IntroGate>
      <h1>사주 입력</h1>
    </IntroGate>,
  );
}

test('첫 방문이면 인트로를 먼저 보여준다', () => {
  renderGate();

  expect(screen.getByLabelText('인트로 영상')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: '사주 입력' })).not.toBeInTheDocument();
});

test('인트로가 끝나면 입력 화면으로 바뀌고 다음 방문에는 인트로가 없다', () => {
  renderGate();
  fireEvent.ended(screen.getByLabelText('인트로 영상'));

  expect(screen.getByRole('heading', { name: '사주 입력' })).toBeInTheDocument();

  cleanup();
  renderGate();

  expect(screen.queryByLabelText('인트로 영상')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '사주 입력' })).toBeInTheDocument();
});
