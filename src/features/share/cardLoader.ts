import type { LoaderFunctionArgs } from 'react-router-dom';

import { getResult } from '@/api/results';
import type { Result } from '@/api/schema/result';
import type { Grade } from '@/ui/DestinyCard';
import type { Zodiac } from '@/ui/ZodiacCharacter';

// 인연카드 화면(ConnectionCardScreen)이 그리는 값 — 화면 컴포넌트는 `src/api/` 를 모른다
// (공지 publishing-first). 응답을 이 모양으로 바꾸는 일은 아래 toCardView 가 한다.
export type CardView = {
  nickname: string;
  zodiac: Zodiac;
  title: string;
  description: string;
  grades: readonly { label: string; grade: Grade }[];
  shareId: string;
};

// 카드 스탬프의 순서·이름. saju 의 fortuneOrder 와 같은 값이지만 features 끼리는 import 하지
// 않으므로(ARCHITECTURE Dependency Direction) 여기서 다시 적는다.
const gradeOrder: readonly { category: Result['fortunes'][number]['category']; label: string }[] = [
  { category: 'MARRIAGE', label: '결혼운' },
  { category: 'CHILDREN', label: '자녀운' },
  { category: 'LOVE', label: '연애운' },
];

function toCardView(result: Result): CardView {
  return {
    nickname: result.nickname,
    zodiac: result.zodiac,
    title: result.destiny.title,
    description: result.destiny.description,
    grades: gradeOrder.map(({ category, label }) => {
      const found = result.fortunes.find((fortune) => fortune.category === category);
      // 계약(openapi Result)이 fortunes 를 MARRIAGE·CHILDREN·LOVE 3개로 보장한다 — 없으면 계약 위반이다.
      if (!found) throw new Error(`fortune 응답에 ${category} 가 없다`);
      return { label, grade: found.grade };
    }),
    shareId: result.shareId,
  };
}

// SCR-05 `/reading/:id/card` loader — GET /results/{id} → CardView. 결과 화면(readingLoader)과
// 같은 규칙으로 실패를 Response 로 던져 route errorElement(SCR-12)가 공통 오류 화면을 그리게 한다.
export async function cardLoader({ params }: LoaderFunctionArgs): Promise<CardView> {
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

  return toCardView(outcome.data);
}
