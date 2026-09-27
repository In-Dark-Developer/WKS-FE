import { z } from 'zod';

// 이 탭에서 궁합을 만든 공유 링크와 그 궁합 id — 지도에서 뒤로가기로 돌아온 입력 화면이 입력을 건너뛰지 않게 하고(FR-6),
// 공유 궁합 결과(SCR-24)가 새로고침해도 '나와 주인의 궁합'과 그 이유를 다시 찾게 한다(09/T10).
// 탭을 닫으면 사라지도록 sessionStorage 에 둔다 (ARCHITECTURE Persistence).
const KEY = 'wks:joined-shares';

// 궁합 id 는 V1 이전 백엔드가 주지 않아 없을 수 있다(null).
const joinSchema = z.object({
  shareId: z.string().uuid(),
  compatibilityId: z.number().int().positive().nullable(),
});
type Join = z.infer<typeof joinSchema>;

const joinedSharesSchema = z.union([
  z.object({ v: z.literal(2), joins: z.array(joinSchema) }),
  // v1 — 궁합 id 가 없던 기록. 읽을 때 v2 로 옮긴다.
  z.object({ v: z.literal(1), shareIds: z.array(z.string().uuid()) }).transform(({ shareIds }) => ({
    v: 2 as const,
    joins: shareIds.map((shareId) => ({ shareId, compatibilityId: null })),
  })),
]);

function readJoins(): Join[] {
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
  return parsed.data.joins;
}

export function hasJoinedShare(shareId: string): boolean {
  return readJoins().some((join) => join.shareId === shareId);
}

// 이 탭에서 이 링크로 만든 궁합의 id — 없거나 모르면 null.
export function readJoinedCompatibilityId(shareId: string): number | null {
  return readJoins().find((join) => join.shareId === shareId)?.compatibilityId ?? null;
}

// 궁합을 만들면 부른다. 같은 링크로 다시 만들면(백엔드가 같은 궁합을 200 으로 준다) id 만 새로 쓴다.
export function markShareJoined(shareId: string, compatibilityId: number | null = null): void {
  const joins = readJoins().filter((join) => join.shareId !== shareId);
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ v: 2, joins: [...joins, { shareId, compatibilityId }] }),
    );
  } catch {
    // 저장하지 못하면 뒤로 돌아온 입력 화면이 입력을 건너뛰어 다시 지도로 가고, 결과 화면은 전체 지도로 물러난다.
  }
}
