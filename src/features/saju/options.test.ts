import { expect, test } from 'vitest';

import { birthTimeOptions } from './options';

test('시진은 자시를 새벽·밤 두 칸으로 나눈 13칸이고 값은 칸의 가운데 시각이다', () => {
  expect(birthTimeOptions).toHaveLength(13);
  expect(new Set(birthTimeOptions.map((option) => option.value)).size).toBe(13);
  expect(birthTimeOptions[0]).toEqual({ value: '00:45', label: '자시(子時) 00:00 ~ 01:30' });
  expect(birthTimeOptions.at(-1)).toEqual({ value: '23:45', label: '자시(子時) 23:30 ~ 24:00' });
  expect(birthTimeOptions.find((option) => option.label.startsWith('묘시'))?.value).toBe('06:30');
});
