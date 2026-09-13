import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { Icon } from './Icon';

afterEach(() => {
  cleanup();
});

test('아이콘은 장식이라 보조기기에서 숨긴다', () => {
  const { container } = render(<Icon src="/icon.svg" />);

  expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
});
