import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { datingPhotoUploadSchema } from './schema/dating';
import { DATING_PHOTO_MAX_BYTES, uploadDatingPhoto } from './uploads';

const photo = new File(['bytes'], 'me.jpg', { type: 'image/jpeg' });
const issued = {
  uploadUrl: 'https://wks-photos.s3.ap-northeast-2.amazonaws.com/dating-photos/a.jpg?X-Amz=1',
  photoId: 'f1c4832a-0000-4000-8000-000000000002',
  expiresInSeconds: 600,
};

// jsdom 에는 createImageBitmap 이 없다 — 없으면 화소 검사를 건너뛰므로 기본은 한도 안의 사진으로 둔다.
function stubImageBitmap(size: { width: number; height: number }) {
  vi.stubGlobal(
    'createImageBitmap',
    vi.fn(() => Promise.resolve({ ...size, close: () => {} })),
  );
}

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
  stubImageBitmap({ width: 1200, height: 1600 });
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('허용하지 않는 형식은 요청 없이 형식 실패로 돌려준다', async () => {
  const outcome = await uploadDatingPhoto(new File(['x'], 'me.gif', { type: 'image/gif' }));

  expect(outcome).toEqual({ ok: false, failure: 'type' });
  expect(requestMock).not.toHaveBeenCalled();
});

test('WEBP 는 소개팅 사진으로 받지 않아 요청 없이 거절한다', async () => {
  const outcome = await uploadDatingPhoto(new File(['x'], 'me.webp', { type: 'image/webp' }));

  expect(outcome).toEqual({ ok: false, failure: 'type' });
  expect(requestMock).not.toHaveBeenCalled();
});

test('10MB 를 넘는 사진은 요청 없이 용량 실패로 돌려준다', async () => {
  const big = new File([new Uint8Array(DATING_PHOTO_MAX_BYTES + 1)], 'big.png', {
    type: 'image/png',
  });

  const outcome = await uploadDatingPhoto(big);

  expect(outcome).toEqual({ ok: false, failure: 'size' });
  expect(requestMock).not.toHaveBeenCalled();
});

test('화소가 한도를 넘으면 요청 없이 크기 실패로 돌려준다 — 백엔드가 저장 때 거절하는 조건이다', async () => {
  stubImageBitmap({ width: 8000, height: 6000 });

  const outcome = await uploadDatingPhoto(photo);

  expect(outcome).toEqual({ ok: false, failure: 'pixels' });
  expect(requestMock).not.toHaveBeenCalled();
});

test('브라우저가 열지 못하는 파일은 요청 없이 열 수 없음으로 돌려준다', async () => {
  vi.stubGlobal(
    'createImageBitmap',
    vi.fn(() => Promise.reject(new Error('decode failed'))),
  );

  const outcome = await uploadDatingPhoto(photo);

  expect(outcome).toEqual({ ok: false, failure: 'unreadable' });
  expect(requestMock).not.toHaveBeenCalled();
});

test('로그인이 풀리면 로그인 실패로 구분해 돌려준다', async () => {
  requestMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요합니다.' },
  });

  await expect(uploadDatingPhoto(photo)).resolves.toEqual({ ok: false, failure: 'auth' });
});

test('발급이 연결 문제로 실패하면 연결 실패로 돌려준다', async () => {
  requestMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(uploadDatingPhoto(photo)).resolves.toEqual({ ok: false, failure: 'network' });
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

test('S3 가 파일을 거부하면(403) 다시 고르라는 거절로 돌려준다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: issued });
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 403 }));

  await expect(uploadDatingPhoto(photo)).resolves.toEqual({ ok: false, failure: 'rejected' });
});

test('S3 가 5xx 면 연결 실패로 돌려준다 — 같은 파일로 다시 시도할 일이다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: issued });
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 503 }));

  await expect(uploadDatingPhoto(photo)).resolves.toEqual({ ok: false, failure: 'network' });
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
