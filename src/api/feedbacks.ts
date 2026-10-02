import { request, type ApiOutcome } from './client';
import { feedbackAcceptedSchema, type FeedbackAccepted } from './schema/feedback';

// 서버가 앞뒤 공백을 지운 뒤 보는 최대 길이(WKS-BE api-spec §13).
export const FEEDBACK_MAX_LENGTH = 2000;

// `VITE_API_MOCK=true` 면 요청 없이 접수된 것처럼 흉내 낸다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';
const MOCK_DELAY_MS = 400;

// POST /feedbacks — 로그인 없이 보낸다. 비었거나 2,000자를 넘으면 400 INVALID_INPUT 이다.
export async function submitFeedback(content: string): Promise<ApiOutcome<FeedbackAccepted>> {
  if (isMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return { ok: true, data: { message: '피드백이 접수되었습니다. 감사합니다.' } };
  }
  return request({ method: 'POST', path: '/feedbacks', body: { content } }, feedbackAcceptedSchema);
}
