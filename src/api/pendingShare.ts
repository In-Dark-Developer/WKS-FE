import { z } from 'zod';

// 공유 링크로 들어와 아직 궁합을 만들지 않은 shareId — 사주 입력 중 새로고침해도 궁합까지 잇기 위해 보관한다.
// 탭을 닫으면 사라지도록 sessionStorage 에 둔다 (PRD FR-6, ARCHITECTURE Persistence).
const KEY = 'wks:pending-share';

const pendingShareSchema = z.object({ v: z.literal(1), shareId: z.string().uuid() });

export function readPendingShare(): string | null {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {
    // 스토리지가 막힌 브라우저는 보관값 없음으로 본다.
    return null;
  }
  if (raw === null) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = null;
  }
  const parsed = pendingShareSchema.safeParse(value);
  if (!parsed.success) {
    clearPendingShare();
    return null;
  }
  return parsed.data.shareId;
}

export function writePendingShare(shareId: string): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ v: 1, shareId }));
  } catch {
    // 저장하지 못하면 사주 입력 뒤에는 공유 흐름이 이어지지 않는다 — 링크를 다시 열면 된다.
  }
}

export function clearPendingShare(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // 지울 수 없는 스토리지는 읽기도 실패하므로 보관값 없음과 같다.
  }
}
