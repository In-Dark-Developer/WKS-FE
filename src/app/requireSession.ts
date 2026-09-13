import { redirect } from 'react-router-dom';

import { readSession } from '@/api/session';

// 보호 라우트의 loader 에서 먼저 부른다 — 세션이 없으면 사주 입력으로 보낸다 (FR-18).
export function requireSession(): null {
  if (!readSession()) throw redirect('/');
  return null;
}
