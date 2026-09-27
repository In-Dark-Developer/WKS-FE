import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { MOCK_EMAIL_CODE, sendDatingEmailCode, verifyDatingEmailCode } from './emailCodes';
import { datingEmailCodeSentSchema, datingEmailCodeVerifiedSchema } from './schema/emailCodes';

const EMAIL = 'chaewon@dgu.ac.kr';

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

test('발송은 POST /dating/email-codes 에 메일을 보낸다', async () => {
  const sent = { expiresAt: '2026-09-27T12:10:00Z', resendAvailableAt: '2026-09-27T12:01:00Z' };
  requestMock.mockResolvedValue({ ok: true, data: sent });

  await expect(sendDatingEmailCode(EMAIL)).resolves.toEqual({ ok: true, data: sent });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/dating/email-codes', body: { email: EMAIL } },
    datingEmailCodeSentSchema,
  );
});

test('확인은 POST /dating/email-codes/verify 에 메일과 코드를 함께 보낸다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { email: EMAIL, verified: true } });

  await expect(verifyDatingEmailCode(EMAIL, '123456')).resolves.toMatchObject({ ok: true });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/dating/email-codes/verify', body: { email: EMAIL, code: '123456' } },
    datingEmailCodeVerifiedSchema,
  );
});

test('목 모드는 요청 없이 60초 뒤 재발송·10분 만료를 돌려준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-27T12:00:00Z'));

  const pending = sendDatingEmailCode(EMAIL);
  await vi.runAllTimersAsync();

  const outcome = await pending;
  if (!outcome.ok) throw new Error('목 발송은 성공해야 한다');
  // 보낸 시각 기준으로 재발송 60초·만료 10분이다(시각 자체는 발송이 끝난 때라 초 단위로 맞추지 않는다).
  const sentAt = Date.parse(outcome.data.resendAvailableAt) - 60_000;
  expect(Date.parse(outcome.data.expiresAt) - sentAt).toBe(600_000);
  expect(sentAt).toBeGreaterThanOrEqual(Date.parse('2026-09-27T12:00:00Z'));
  expect(requestMock).not.toHaveBeenCalled();
});

test('목 모드는 정해진 코드만 통과시킨다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  await expect(verifyDatingEmailCode(EMAIL, MOCK_EMAIL_CODE)).resolves.toMatchObject({
    ok: true,
    data: { verified: true },
  });
  await expect(verifyDatingEmailCode(EMAIL, '000000')).resolves.toMatchObject({
    ok: false,
    error: { kind: 'api', code: 'INVALID_EMAIL_CODE' },
  });
});
