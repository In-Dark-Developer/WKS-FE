import { z } from 'zod';

// GET /compatibilities/{id}/reason 응답(openapi CompatibilityReason) — 두 사람이 같은 내용을 본다(FR-22).
export const compatibilityReasonSchema = z.object({
  why: z.string(),
  together: z.string(),
  conflict: z.string(),
});

export type CompatibilityReason = z.infer<typeof compatibilityReasonSchema>;
