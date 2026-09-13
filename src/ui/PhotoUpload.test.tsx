import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { Field } from './Field';
import { PhotoUpload } from './PhotoUpload';

afterEach(() => {
  cleanup();
});

test('파일을 고르면 onSelect 로 넘긴다', () => {
  const onSelect = vi.fn();
  render(
    <Field label="사진 추가">
      {(control) => <PhotoUpload {...control} onSelect={onSelect} status="empty" />}
    </Field>,
  );

  const file = new File(['x'], 'me.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText('사진 추가'), { target: { files: [file] } });

  expect(onSelect).toHaveBeenCalledWith(file);
  expect(screen.getByText('사진을 추가해 주세요')).toBeInTheDocument();
});

test('업로드 중에는 버튼을 누를 수 없다', () => {
  render(<PhotoUpload onSelect={() => {}} status="uploading" />);

  expect(screen.getByRole('button', { name: '사진 추가' })).toBeDisabled();
  expect(screen.getByText('업로드 중 · 잠시만 기다려 주세요')).toBeInTheDocument();
});

test('올린 뒤에는 미리보기를, 실패하면 오류 문구를 보인다', () => {
  const { rerender } = render(
    <PhotoUpload onSelect={() => {}} previewUrl="blob:photo" status="uploaded" />,
  );

  expect(screen.getByRole('img', { name: '선택한 사진 미리보기' })).toHaveAttribute(
    'src',
    'blob:photo',
  );

  rerender(<PhotoUpload onSelect={() => {}} status="error" />);

  expect(screen.getByText('파일을 확인하고 다시 시도해 주세요')).toBeInTheDocument();
});
