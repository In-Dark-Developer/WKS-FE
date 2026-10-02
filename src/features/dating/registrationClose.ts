import { useEffect, useState } from 'react';

// 소개팅 프로필 등록 마감 시각 — 이 시각부터 인트로(로그인)와 프로필 (2/2) 의 '내 운명 찾아 떠나기'가 비활성이 되고
// 마감 안내가 보인다(2026-10-01 결정, 축제 종료).
// 운영 배포에만 `VITE_DATING_CLOSE_AT`(ISO 8601, 오프셋 포함 — 예 2026-10-02T02:00:00+09:00)을 둔다(netlify.toml).
// 값이 없거나 읽을 수 없으면 마감하지 않는다 — 개발·dev 배포·미리보기는 막지 않는다(openingGate 와 같은 규칙).
export function readDatingCloseAt(
  raw: string | undefined = import.meta.env.VITE_DATING_CLOSE_AT,
): number | null {
  if (!raw) return null;
  const time = Date.parse(raw);
  if (Number.isNaN(time)) {
    console.error('VITE_DATING_CLOSE_AT 을 읽을 수 없다', raw);
    return null;
  }
  return time;
}

export const DATING_CLOSE_AT = readDatingCloseAt();

// 마감 안내 — 디자인에 없는 상태라 문구는 2026-10-01 소유자 지시, 모양은 화면마다 기존 토큰으로 그린다.
export const closedNotice = '새로운 인연 접수가 마감됐어요\n다음 인연 때 더 좋은 모습으로 만나요';

// setTimeout 의 최대 지연(약 24.8일) — 넘기면 곧바로 불리므로 잘라서 다시 잰다.
const MAX_TIMEOUT = 2_147_483_647;

// 마감 시각이 지났는지 — 화면을 열어 둔 채 마감 시각을 넘겨도 새로고침 없이 바뀐다.
export function useIsClosed(closeAt: number | null): boolean {
  const [now, setNow] = useState(() => Date.now());
  const isClosed = closeAt !== null && now >= closeAt;

  useEffect(() => {
    if (closeAt === null || isClosed) return;
    const timer = setTimeout(() => setNow(Date.now()), Math.min(closeAt - now, MAX_TIMEOUT));
    return () => clearTimeout(timer);
  }, [closeAt, isClosed, now]);

  return isClosed;
}
