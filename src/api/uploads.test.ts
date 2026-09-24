import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { photoUploadUrlSchema } from './schema/upload';
import { uploadPhoto } from './uploads';

const photo = new File(['bytes'], 'me.jpg', { type: 'image/jpeg' });
const issued = {
  uploadUrl: 'https://wks-photos.s3.ap-northeast-2.amazonaws.com/signup-photos/a.jpg?X-Amz=1',
  photoKey: 'signup-photos/a.jpg',
  expiresInSeconds: 600,
};

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test('허용하지 않는 형식은 요청 없이 거절한다', async () => {
  const outcome = await uploadPhoto(new File(['x'], 'me.gif', { type: 'image/gif' }));

  expect(outcome).toMatchObject({ ok: false, error: { kind: 'api', code: 'INVALID_INPUT' } });
  expect(requestMock).not.toHaveBeenCalled();
});

test('업로드 URL 을 받아 같은 Content-Type 으로 PUT 한 뒤 photoKey 를 돌려준다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: issued });
  const fetchSpy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(null, { status: 200 }));

  await expect(uploadPhoto(photo)).resolves.toEqual({
    ok: true,
    data: { photoKey: 'signup-photos/a.jpg' },
  });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/signups/photo-upload-url', body: { contentType: 'image/jpeg' } },
    photoUploadUrlSchema,
  );
  expect(fetchSpy).toHaveBeenCalledWith(issued.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: photo,
  });
});

test('S3 가 거부하면 연결 실패로 돌려준다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: issued });
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 403 }));

  await expect(uploadPhoto(photo)).resolves.toEqual({ ok: false, error: { kind: 'network' } });
});

test('목 모드는 요청 없이 목 photoKey 를 돌려준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  const fetchSpy = vi.spyOn(globalThis, 'fetch');

  const outcome = await uploadPhoto(photo);

  expect(outcome).toMatchObject({
    ok: true,
    data: { photoKey: expect.stringMatching(/^mock-photos\//) },
  });
  expect(requestMock).not.toHaveBeenCalled();
  expect(fetchSpy).not.toHaveBeenCalled();
});
