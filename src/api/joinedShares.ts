import { z } from 'zod';

// 이 탭에서 궁합을 만든 공유 링크의 shareId 목록 — 지도에서 뒤로가기로 돌아온 입력 화면이 입력을 건너뛰지 않게 한다.
// 탭을 닫으면 사라지도록 sessionStorage 에 둔다 (PRD FR-6, ARCHITECTURE Persistence).
const KEY = 'wks:joined-shares';

const joinedSharesSchema = z.object({ v: z.literal(1), shareIds: z.array(z.string().uuid()) });

function readShareIds(): string[] {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {
    // 스토리지가 막힌 브라우저는 기록 없음으로 본다.
    return [];
  }
  if (raw === null) return [];

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = null;
  }
  const parsed = joinedSharesSchema.safeParse(value);
  if (!parsed.success) {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // 지울 수 없는 스토리지는 읽기도 실패하므로 기록 없음과 같다.
    }
    return [];
  }
  return parsed.data.shareIds;
}

export function hasJoinedShare(shareId: string): boolean {
  return readShareIds().includes(shareId);
}

export function markShareJoined(shareId: string): void {
  const shareIds = readShareIds();
  if (shareIds.includes(shareId)) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ v: 1, shareIds: [...shareIds, shareId] }));
  } catch {
    // 저장하지 못하면 뒤로 돌아온 입력 화면이 입력을 건너뛰어 다시 지도로 간다.
  }
}
