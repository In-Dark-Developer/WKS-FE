import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { Notice } from './Notice';

test('안내 제목과 내용을 note로 렌더한다', () => {
  render(<Notice title="알아두세요">같은 브라우저로 다시 찾아와 주세요.</Notice>);

  const notice = screen.getByRole('note');

  expect(notice).toHaveTextContent('알아두세요');
  expect(notice).toHaveTextContent('같은 브라우저로 다시 찾아와 주세요.');
});
