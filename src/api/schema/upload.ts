import { z } from 'zod';

// 사진 업로드 URL 발급(POST /signups/photo-upload-url, 백엔드 api.md §4 2026-09-16) — 이 URL 에 파일을
// 그대로 PUT 한 뒤 photoKey 를 저장 요청에 싣는다. uploadUrl 은 expiresInSeconds(600초) 동안만 쓸 수 있다.
export const photoContentTypeSchema = z.enum(['image/jpeg', 'image/png', 'image/webp']);

export type PhotoContentType = z.infer<typeof photoContentTypeSchema>;

export const photoUploadUrlSchema = z.object({
  uploadUrl: z.url(),
  photoKey: z.string().min(1),
  expiresInSeconds: z.number().int().positive(),
});

export type PhotoUploadUrl = z.infer<typeof photoUploadUrlSchema>;
