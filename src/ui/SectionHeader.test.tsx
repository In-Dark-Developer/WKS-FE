import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { SectionHeader } from './SectionHeader';

test('제목, 설명, 액션을 렌더한다', () => {
  render(
    <SectionHeader
      action={<button type="button">전체 보기</button>}
      description="보살님이 점지한 흐름이에요."
      title="오늘의 운명"
    />,
  );

  expect(screen.getByRole('heading', { level: 2, name: '오늘의 운명' })).toBeInTheDocument();
  expect(screen.getByText('보살님이 점지한 흐름이에요.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '전체 보기' })).toBeInTheDocument();
});

test('중첩 섹션에서는 3단계 제목을 쓸 수 있다', () => {
  render(<SectionHeader headingLevel={3} title="행운의 장소" />);

  expect(screen.getByRole('heading', { level: 3, name: '행운의 장소' })).toBeInTheDocument();
});
