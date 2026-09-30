import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { CostText } from './CostText';

afterEach(cleanup);

test('백엔드 비용이 정가보다 싸면 정가에 취소선을 긋고 지금 비용을 함께 적는다', () => {
  const { container } = render(<CostText cost={3} listed={7} />);

  expect(container.querySelector('s')).toHaveTextContent('7');
  expect(container).toHaveTextContent('7 3');
});

test('정가 그대로거나 무료면 취소선 없이 비용만 적는다', () => {
  const { container, rerender } = render(<CostText cost={7} listed={7} />);
  expect(container.querySelector('s')).toBeNull();
  expect(container).toHaveTextContent('7');

  rerender(<CostText cost={0} listed={7} />);
  expect(container.querySelector('s')).toBeNull();
  expect(container).toHaveTextContent('0');
});
