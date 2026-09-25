import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { datingPhotoUploadSchema } from './schema/dating';
import { uploadDatingPhoto } from './uploads';

const photo = new File(['bytes'], 'me.jpg', { type: 'image/jpeg' });
const issued = {
  uploadUrl: 'https://wks-photos.s3.ap-northeast-2.amazonaws.com/dating-photos/a.jpg?X-Amz=1',
  photoId: 'f1c4832a-0000-4000-8000-000000000002',
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
  const outcome = await uploadDatingPhoto(new File(['x'], 'me.gif', { type: 'image/gif' }));

  expect(outcome).toMatchObject({ ok: false, error: { kind: 'api', code: 'INVALID_INPUT' } });
  expect(requestMock).not.toHaveBeenCalled();
});

test('업로드 URL 을 받아 같은 Content-Type 으로 PUT 한 뒤 photoId 를 돌려준다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: issued });
  const fetchSpy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(null, { status: 200 }));

  await expect(uploadDatingPhoto(photo)).resolves.toEqual({
    ok: true,
    data: { photoId: 'f1c4832a-0000-4000-8000-000000000002' },
  });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/dating/profile/photo', body: { contentType: 'image/jpeg' } },
    datingPhotoUploadSchema,
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

  await expect(uploadDatingPhoto(photo)).resolves.toEqual({
    ok: false,
    error: { kind: 'network' },
  });
});

test('목 모드는 요청 없이 목 photoId 를 돌려준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  const fetchSpy = vi.spyOn(globalThis, 'fetch');

  const outcome = await uploadDatingPhoto(photo);

  expect(outcome).toMatchObject({
    ok: true,
    data: { photoId: expect.any(String) },
  });
  expect(requestMock).not.toHaveBeenCalled();
  expect(fetchSpy).not.toHaveBeenCalled();
});
