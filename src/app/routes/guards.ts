import { redirect } from 'react-router-dom';

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
