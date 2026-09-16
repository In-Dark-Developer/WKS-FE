import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

import { getResult } from '@/api/results';

import { toReadingView } from './toReadingView';
import type { ReadingView } from './readingView';

// SCR-04 `/reading/:id` loader — GET /results/{id} → ReadingView. 백엔드가 모르는 결과면 보관된 '내 결과'가
// 이미 비워졌으므로(`getResult`) 사주 입력으로 보낸다 — 오류 화면에 두면 이 브라우저는 계속 그 화면만 본다
// (FR-18). 그 밖의 실패는 Response 를 던져 route errorElement(RouteError, SCR-12)가 그린다.
export async function readingLoader({ params }: LoaderFunctionArgs): Promise<ReadingView> {
  const resultId = params.id;
  if (!resultId) throw new Response('resultId 가 없다', { status: 404 });

  const outcome = await getResult(resultId);
  if (!outcome.ok) {
    if (outcome.error.kind === 'api' && outcome.error.code === 'RESULT_NOT_FOUND') {
      throw redirect('/');
    }
    console.error('GET /results/{id} 실패', outcome.error);
    throw new Response('결과를 불러오지 못했다', { status: 503 });
  }

  return toReadingView(outcome.data);
}
