import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { ZodiacCharacter, bodhisattvaNames, type Zodiac } from '@/ui/ZodiacCharacter';

afterEach(cleanup);

test('띠마다 보살 이름을 대체 텍스트로 가진 캐릭터 이미지를 그린다', () => {
  const zodiacs = Object.keys(bodhisattvaNames) as Zodiac[];
  render(
    <>
      {zodiacs.map((zodiac) => (
        <ZodiacCharacter key={zodiac} zodiac={zodiac} />
      ))}
    </>,
  );

  const images = screen.getAllByRole('img');
  expect(images).toHaveLength(12);
  expect(new Set(images.map((image) => image.getAttribute('src'))).size).toBe(12);
  expect(screen.getByRole('img', { name: '복복보살' })).toBeInTheDocument();
});
