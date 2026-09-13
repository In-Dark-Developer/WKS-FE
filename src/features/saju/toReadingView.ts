import type { Result } from '@/api/schema/result';

import type { ReadingView } from './readingView';

type FortuneCategory = Result['fortunes'][number]['category'];

function findFortune(result: Result, category: FortuneCategory) {
  const found = result.fortunes.find((fortune) => fortune.category === category);
  // 계약(openapi Result)이 fortunes 를 MARRIAGE·CHILDREN·LOVE 3개로 보장한다 — 없으면 계약 위반이다.
  if (!found) throw new Error(`fortune 응답에 ${category} 가 없다`);
  return { grade: found.grade, content: found.content };
}

// 계약(Result, `docs/api/openapi.yaml`)을 결과 화면이 그리는 뷰 모델(ReadingView)로 바꾼다.
// `src/api/`를 아는 것은 이 파일뿐이다 — ReadingResult 등 화면 컴포넌트는 이 결과물만 받는다.
export function toReadingView(result: Result): ReadingView {
  return {
    nickname: result.nickname,
    zodiac: result.zodiac,
    destiny: result.destiny,
    fortunes: {
      marriage: findFortune(result, 'MARRIAGE'),
      children: findFortune(result, 'CHILDREN'),
      love: findFortune(result, 'LOVE'),
    },
    luckyPlace: result.luckyPlace,
    luckyItem: result.luckyItem,
  };
}
