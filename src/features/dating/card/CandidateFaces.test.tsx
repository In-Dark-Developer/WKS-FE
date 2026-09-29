import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { CandidateBack, CandidateFront } from './CandidateFaces';

afterEach(cleanup);

const front = { rank: 1, relationLabel: '천생연분', mbti: 'ENTP', score: 92, bio: '안녕하세요' };

test('앞면 MBTI 옆에 나이를 년생으로 보인다 (Figma 448:2786)', () => {
  render(<CandidateFront {...front} birthYear="02년생" />);

  expect(screen.getByText('나이')).toBeInTheDocument();
  expect(screen.getByText('02년생')).toBeInTheDocument();
});

// QA(2026-09-28): 점수 원이 관계 유형보다 위로 솟고 MBTI·나이 라벨과 값의 글자 바닥이 어긋났다.
test('점수 원은 관계 유형과 한 줄에 세로 가운데로, MBTI·나이는 글자 바닥선에 맞춘다', () => {
  render(<CandidateFront {...front} birthYear="02년생" />);

  const headline = screen.getByText('천생연분').parentElement;
  expect(headline).toHaveClass('items-center', 'gap-16');
  expect(headline).toContainElement(screen.getByLabelText('궁합 점수 92점'));
  expect(screen.getByLabelText('궁합 점수 92점')).toHaveClass('size-[45px]');
  expect(screen.getByText('MBTI').parentElement).toHaveClass('items-baseline');
});

test('생년월일이 오지 않은 카드는 나이 칸을 그리지 않는다', () => {
  render(<CandidateFront {...front} birthYear={null} />);

  expect(screen.queryByText('나이')).not.toBeInTheDocument();
});

const photo = { isLocked: false, url: '/photo.webp' } as const;

test('해금은 됐는데 값이 아직 없는 항목은 0개가 아니라 다시 열기로 보인다', () => {
  render(
    <CandidateBack
      department={{ isLocked: false, value: '경영학과' }}
      name={{ isLocked: true, cost: 7 }}
      onUnlock={vi.fn()}
      photo={photo}
      reason={{ isLocked: true, cost: 0 }}
    />,
  );

  expect(screen.getByRole('button', { name: /궁합 이유 다시 열기/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /이름 7개로 열기/ })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /0개로 열기/ })).not.toBeInTheDocument();
});

test('궁합 이유는 백엔드 문장의 줄바꿈을 그대로 두고 긴 글도 카드 폭 안에서 줄을 바꾼다', () => {
  render(
    <CandidateBack
      department={{ isLocked: false, value: '경영학과' }}
      name={{ isLocked: false, value: '이서연' }}
      photo={photo}
      reason={{ isLocked: false, value: '첫 문장이에요.\n둘째 문장이에요.' }}
    />,
  );

  const reason = screen.getByText(/첫 문장이에요\./);
  expect(reason.textContent).toBe('첫 문장이에요.\n둘째 문장이에요.');
  expect(reason).toHaveClass('whitespace-pre-line', 'wrap-anywhere');
});

test('궁합 이유를 모르는 상대는 흐리게 가리지 않고 없음 안내를 보인다 (11/T9)', () => {
  render(
    <CandidateBack
      department={{ isLocked: false, value: '경영학과' }}
      name={{ isLocked: false, value: '이서연' }}
      photo={photo}
      reason={null}
    />,
  );

  expect(screen.getByText('궁합 이유는 오늘의 인연 카드에서만 볼 수 있어요.')).toBeInTheDocument();
  expect(screen.queryByText(/잠겨 있어요/)).not.toBeInTheDocument();
});
