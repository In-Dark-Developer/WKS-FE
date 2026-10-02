import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { submitFeedback } from './feedbacks';
import { feedbackAcceptedSchema } from './schema/feedback';

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
});

test('POST /feedbacks 에 내용을 보낸다', async () => {
  const accepted = { message: '피드백이 접수되었습니다. 감사합니다.' };
  requestMock.mockResolvedValue({ ok: true, data: accepted });

  await expect(submitFeedback('다음에도 올게요')).resolves.toEqual({ ok: true, data: accepted });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/feedbacks', body: { content: '다음에도 올게요' } },
    feedbackAcceptedSchema,
  );
});

test('목 모드는 요청 없이 접수된 것처럼 돌려준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  await expect(submitFeedback('좋았어요')).resolves.toMatchObject({ ok: true });
  expect(requestMock).not.toHaveBeenCalled();
});
