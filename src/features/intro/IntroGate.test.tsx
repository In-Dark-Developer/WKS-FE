import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { IntroGate } from './IntroGate';
import { resetTeaserPassed } from './introSeen';

afterEach(() => {
  cleanup();
  localStorage.clear();
  resetTeaserPassed();
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

function renderGateWithTeaser() {
  return render(
    <IntroGate
      teaser={(pass) => (
        <button onClick={pass} type="button">
          내 사주 보기
        </button>
      )}
    >
      <h1>사주 입력</h1>
    </IntroGate>,
  );
}

test('인트로가 끝나면 티저가 뜨고, 티저를 지나야 입력 화면이 된다', () => {
  renderGateWithTeaser();
  fireEvent.ended(screen.getByLabelText('인트로 영상'));

  expect(screen.getByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: '사주 입력' })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '내 사주 보기' }));

  expect(screen.getByRole('heading', { name: '사주 입력' })).toBeInTheDocument();
});

test('인트로만 보고 티저를 지나지 않았으면 다음 접속에 티저부터 뜬다', () => {
  renderGateWithTeaser();
  fireEvent.ended(screen.getByLabelText('인트로 영상'));
  cleanup();
  renderGateWithTeaser();

  expect(screen.queryByLabelText('인트로 영상')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
});

test('같은 접속 안에서 티저를 지났으면 다시 들어와도 입력 화면을 본다', () => {
  renderGateWithTeaser();
  fireEvent.ended(screen.getByLabelText('인트로 영상'));
  fireEvent.click(screen.getByRole('button', { name: '내 사주 보기' }));
  cleanup();
  renderGateWithTeaser();

  expect(screen.getByRole('heading', { name: '사주 입력' })).toBeInTheDocument();
});

test('티저를 지났어도 새로 접속하면 인트로 없이 티저가 먼저 뜬다', () => {
  renderGateWithTeaser();
  fireEvent.ended(screen.getByLabelText('인트로 영상'));
  fireEvent.click(screen.getByRole('button', { name: '내 사주 보기' }));
  cleanup();
  resetTeaserPassed(); // 새 페이지 로드
  renderGateWithTeaser();

  expect(screen.queryByLabelText('인트로 영상')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '내 사주 보기' })).toBeInTheDocument();
});
