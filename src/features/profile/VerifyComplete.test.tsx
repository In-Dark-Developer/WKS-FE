import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';

import { VerifyComplete } from './VerifyComplete';

afterEach(cleanup);

test('인증 완료를 알리고 처음으로 돌아가는 링크를 준다', () => {
  render(
    <MemoryRouter>
      <VerifyComplete />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '이메일 인증이 끝났어요' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '처음으로 돌아가기' })).toHaveAttribute('href', '/');
});
