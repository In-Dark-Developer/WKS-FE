import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('drops falsy conditional classes', () => {
    const selected = false;
    expect(cn('p-16', selected && 'bg-surface-muted', undefined, { 'text-muted': true })).toBe(
      'p-16 text-muted',
    );
  });

  it('keeps the later class within the same token scale', () => {
    expect(cn('p-16', 'p-8')).toBe('p-8');
    expect(cn('rounded-12', 'rounded-999')).toBe('rounded-999');
    expect(cn('text-ui-14', 'text-display-24')).toBe('text-display-24');
    expect(cn('text-primary', 'text-muted')).toBe('text-muted');
  });

  it('keeps font size and text color together', () => {
    expect(cn('text-ui-14', 'text-primary')).toBe('text-ui-14 text-primary');
    expect(cn('text-primary', 'text-ui-14')).toBe('text-primary text-ui-14');
  });
});
