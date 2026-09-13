import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { Modal } from './Modal';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

test('open 이 false 면 아무것도 그리지 않는다', () => {
  render(
    <Modal onClose={vi.fn()} open={false} title="제목">
      내용
    </Modal>,
  );

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('open 이면 제목·내용을 보이고 첫 포커스는 대화상자 안에 있다', () => {
  render(
    <Modal onClose={vi.fn()} open title="제목">
      <button type="button">내용 버튼</button>
    </Modal>,
  );

  const dialog = screen.getByRole('dialog', { name: '제목' });
  expect(dialog).toBeInTheDocument();
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
});

test('닫기 버튼을 누르면 onClose 가 불린다', () => {
  const onClose = vi.fn();
  render(
    <Modal onClose={onClose} open title="제목">
      내용
    </Modal>,
  );

  fireEvent.click(screen.getByRole('button', { name: '닫기' }));

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('배경을 누르면 onClose 가 불린다', () => {
  const onClose = vi.fn();
  render(
    <Modal onClose={onClose} open title="제목">
      내용
    </Modal>,
  );

  // Modal 은 document.body 에 포털로 그려져 render() 의 container 밖에 있다.
  const backdrop = document.body.querySelector('[aria-hidden="true"]');
  expect(backdrop).not.toBeNull();
  fireEvent.click(backdrop as Element);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('Escape 를 누르면 onClose 가 불린다', () => {
  const onClose = vi.fn();
  render(
    <Modal onClose={onClose} open title="제목">
      내용
    </Modal>,
  );

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('열려 있는 동안 배경 스크롤을 잠그고 닫히면 되돌린다', () => {
  const { rerender } = render(
    <Modal onClose={vi.fn()} open title="제목">
      내용
    </Modal>,
  );

  expect(document.body.style.overflow).toBe('hidden');

  rerender(
    <Modal onClose={vi.fn()} open={false} title="제목">
      내용
    </Modal>,
  );

  expect(document.body.style.overflow).toBe('');
});

test('Tab 은 대화상자 안의 포커스만 순환한다(포커스 트랩)', () => {
  render(
    <Modal onClose={vi.fn()} open title="제목">
      <button type="button">본문 버튼</button>
    </Modal>,
  );

  // DOM 순서상 첫 포커스는 헤더의 닫기 버튼이고 마지막은 본문 버튼이다.
  const closeButton = screen.getByRole('button', { name: '닫기' });
  const last = screen.getByRole('button', { name: '본문 버튼' });

  last.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(document.activeElement).toBe(closeButton);

  closeButton.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(last);
});

test('닫히면 열기 전 포커스를 되돌려준다', () => {
  const opener = document.createElement('button');
  document.body.appendChild(opener);
  opener.focus();

  const { unmount } = render(
    <Modal onClose={vi.fn()} open title="제목">
      내용
    </Modal>,
  );
  expect(document.activeElement).not.toBe(opener);

  unmount();
  expect(document.activeElement).toBe(opener);
  opener.remove();
});
