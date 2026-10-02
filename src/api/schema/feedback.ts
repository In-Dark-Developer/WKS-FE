import { z } from 'zod';

// 축제 종료 뒤 피드백 — docs/api/openapi.yaml `/feedbacks` (WKS-BE api-spec §13).
export const feedbackAcceptedSchema = z.object({
  message: z.string(),
});

export type FeedbackAccepted = z.infer<typeof feedbackAcceptedSchema>;
