import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { ProfileCard } from './ProfileCard';

afterEach(cleanup);

function renderCard(initialFace?: 'front' | 'back') {
  return render(
    <ProfileCard
      back={<p>뒷면 내용</p>}
      background={<span />}
      front={<p>앞면 내용</p>}
      initialFace={initialFace}
    />,
  );
}

// 두 면을 겹쳐 두고 돌리므로 둘 다 화면에 있다 — 지금 안 보이는 면은 낭독기·탭 이동에서 뺀다.
function faceOf(text: string) {
  return screen.getByText(text).closest('[aria-hidden]');
}

test('처음에는 앞면이 열려 있고, 뒤집으면 뒷면이 열린다', () => {
  renderCard();

  expect(faceOf('앞면 내용')).toHaveAttribute('aria-hidden', 'false');
  expect(faceOf('뒷면 내용')).toHaveAttribute('aria-hidden', 'true');

  fireEvent.click(screen.getByRole('button', { name: '카드 뒤집기' }));

  expect(screen.getByRole('button', { name: '카드 뒤집기' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(faceOf('뒷면 내용')).toHaveAttribute('aria-hidden', 'false');
  expect(faceOf('앞면 내용')).toHaveAttribute('aria-hidden', 'true');
});

// QA(2026-09-28): WebKit 은 흐림 사진에 backface-hidden 을 먹이지 않아 뒷면에 앞면 사진이 좌우로 뒤집혀 비쳤다.
test('안 보이는 면은 회전 절반 뒤 visibility 로 숨긴다', () => {
  renderCard();

  expect(faceOf('앞면 내용')).not.toHaveClass('invisible');
  expect(faceOf('뒷면 내용')).toHaveClass('invisible', 'delay-250');

  fireEvent.click(screen.getByRole('button', { name: '카드 뒤집기' }));

  expect(faceOf('앞면 내용')).toHaveClass('invisible');
  expect(faceOf('뒷면 내용')).not.toHaveClass('invisible');
});

test('initialFace 로 뒷면부터 보일 수 있다', () => {
  renderCard('back');

  expect(faceOf('뒷면 내용')).toHaveAttribute('aria-hidden', 'false');
});

test('뒷면이 없으면 뒤집기 버튼이 없다', () => {
  render(<ProfileCard background={<span />} front={<p>빈 카드</p>} />);

  expect(screen.queryByRole('button', { name: '카드 뒤집기' })).not.toBeInTheDocument();
});

// QA(2026-09-28): 높이만 433px 로 고정돼 화면 폭이 바뀌면 비율이 깨졌다(360px 에서 328×433).
test('카드는 Figma 규격 비율(343:433)과 흰 테두리·radius 12 를 갖는다', () => {
  render(<ProfileCard background={<div />} front={<p>앞면</p>} />);

  const card = screen.getByText('앞면').closest('[data-face]');
  const faceElement = screen.getByText('앞면').closest('[aria-hidden]');

  // 칸은 비율을 잡고, 테두리·모서리는 돌아가는 면이 갖는다(카드째로 뒤집히도록).
  expect(card).toHaveClass('aspect-[343/433]', 'w-full');
  expect(card).not.toHaveClass('h-[433px]');
  expect(faceElement).toHaveClass('rounded-12', 'border-neutral-0');
});

// QA(2026-09-28): 앞뒷면을 숨겼다 보이기만 해서 뒤집는 모습이 없었다 — 홈 운명 카드와 같은 Y축 회전이다.
test('뒤집기는 Y축 회전으로 하고 동작 줄이기 설정에서는 전환이 없다', () => {
  renderCard();

  const inner = document.querySelector('[data-profile-card-inner]');

  expect(inner).toHaveClass(
    'transform-3d',
    'transition-transform',
    'motion-reduce:transition-none',
  );
  expect(inner).not.toHaveClass('rotate-y-180');

  fireEvent.click(screen.getByRole('button', { name: '카드 뒤집기' }));

  expect(document.querySelector('[data-profile-card-inner]')).toHaveClass('rotate-y-180');
});

// QA(2026-09-28): 사진 위 '카드 뒤집기' 칩에 채움이 없어 밝은 사진에서 글자가 묻혔다(Figma 134:2275 흰색 18%).
test('카드 뒤집기 칩은 반투명 채움과 테두리를 갖는다', () => {
  render(<ProfileCard back={<p>뒷면</p>} background={<div />} front={<p>앞면</p>} />);

  expect(screen.getByRole('button', { name: '카드 뒤집기' })).toHaveClass(
    'bg-opacity-card-neutral-0-18',
    'border-neutral-100',
    'backdrop-blur-sm',
  );
});
