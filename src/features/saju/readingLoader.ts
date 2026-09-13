import type { LoaderFunctionArgs } from 'react-router-dom';

import { getResult } from '@/api/results';

import { toReadingView } from './toReadingView';
import type { ReadingView } from './readingView';

// SCR-04 `/reading/:id` loader — GET /results/{id} → ReadingView. 404·기타 실패는 Response 를 던져
// route errorElement(RouteError, SCR-12)가 공통 오류 화면을 그리게 한다(원인은 콘솔에만 남긴다).
export async function readingLoader({ params }: LoaderFunctionArgs): Promise<ReadingView> {
  const resultId = params.id;
  if (!resultId) throw new Response('resultId 가 없다', { status: 404 });

  const outcome = await getResult(resultId);
  if (!outcome.ok) {
    if (outcome.error.kind === 'api' && outcome.error.code === 'RESULT_NOT_FOUND') {
      throw new Response(outcome.error.message, { status: 404 });
    }
    console.error('GET /results/{id} 실패', outcome.error);
    throw new Response('결과를 불러오지 못했다', { status: 503 });
  }

  return toReadingView(outcome.data);
}
