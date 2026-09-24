import { redirect } from 'react-router-dom';

import { getMe, isUnauthenticated, type Me } from '@/api/me';
import { readSession } from '@/api/session';

// 라우트 가드는 이 파일만 갖는다 — 진입 조건이 늘어나도 loader 가 조건을 직접 읽지 않게 한다.
// 주소에 결과 id 가 있는 보호 라우트의 loader 에서 먼저 부른다 — 이 브라우저가 만든 결과가 아니면
// (보관된 resultId 가 없거나 주소의 id 와 다르면) 사주 입력으로 보낸다
// (FR-18 · ADR-20260914-result-ownership-in-browser).
export function requireSaju(resultId: string | undefined): null {
  const session = readSession();
  if (!session || session.resultId !== resultId) throw redirect('/');
  return null;
}

// 주소에 결과 id 가 없는 보호 라우트(궁합 지도 `/me/map`)의 loader 에서 부른다 — 보관된 resultId 가
// 없으면 사주 입력으로 보내고, 있으면 그 값('내 결과')을 돌려준다 (FR-18).
export function requireMyResultId(): string {
  const session = readSession();
  if (!session) throw redirect('/');
  return session.resultId;
}

// 소개팅 화면(`/dating/*`)의 loader 에서 부른다 — 로그인 여부는 GET /me 응답으로만 판단한다(ARCHITECTURE V1).
// 비로그인(401)은 소개팅 인트로로 보내고, 그 밖의 조회 실패는 오류 화면(다시 시도)으로 넘긴다.
export async function requireAuth(): Promise<Me> {
  const outcome = await getMe();
  if (outcome.ok) return outcome.data;
  if (isUnauthenticated(outcome)) throw redirect('/dating');
  console.error('GET /me 실패', outcome.error);
  throw new Response('내 정보를 불러오지 못했다', { status: 503 });
}

// 프로필을 등록해야 들어가는 소개팅 화면(Top 3 등) — 없으면 프로필 등록으로 보낸다(FR-24).
export async function requireDatingProfile(): Promise<Me> {
  const me = await requireAuth();
  if (!me.hasDatingProfile) throw redirect('/dating/profile');
  return me;
}
