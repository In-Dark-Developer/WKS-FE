import { redirect } from 'react-router-dom';

import { readSession } from '@/api/session';

// 주소에 결과 id 가 있는 보호 라우트의 loader 에서 먼저 부른다 — 이 브라우저가 만든 결과가 아니면
// (보관된 resultId 가 없거나 주소의 id 와 다르면) 사주 입력으로 보낸다
// (FR-18 · ADR-20260914-result-ownership-in-browser).
export function requireSession(resultId: string | undefined): null {
  const session = readSession();
  if (!session || session.resultId !== resultId) throw redirect('/');
  return null;
}
