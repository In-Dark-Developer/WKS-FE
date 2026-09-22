import { z } from 'zod';

// 지도 → 내 사주 이동 기록의 표시 — 이동 기록(history state)은 런타임 경계 입력이라 파싱해서 읽는다.
// 표시를 남기는 쪽(`share.routes.tsx`)과 읽는 쪽(`saju.routes.tsx`)이 같은 모양을 쓰도록 여기 둔다.
export const fromSharedMapState = z.object({ from: z.literal('shared-map') });
