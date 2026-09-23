import type { Result } from '@/api/schema/result';

import type { ElementKey, ReadingView } from './readingView';

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
    elements: result.elements,
    luckyPlace: result.luckyPlace,
    luckyItem: result.luckyItem,
    shareId: result.shareId,
    elementMatch: result.elementMatch
      ? {
          element: elementKeyOf[result.elementMatch.element],
          korean: result.elementMatch.korean,
          reason: result.elementMatch.reason,
        }
      : null,
    friends: toFriends(result),
  };
}

const elementKeyOf = {
  WOOD: 'wood',
  FIRE: 'fire',
  EARTH: 'earth',
  METAL: 'metal',
  WATER: 'water',
} as const satisfies Record<NonNullable<Result['elementMatch']>['element'], ElementKey>;

// 궁합 한 건의 `nickname` 은 백엔드가 이미 고른 상대 닉네임이다(내가 링크 주인이든 방문자든).
// 순위는 점수 높은 순(FR-8)이고 같은 점수는 응답 순서(최근 순)를 지킨다.
function toFriends(result: Result): NonNullable<ReadingView['friends']> {
  return result.compatibilities
    .map(({ nickname, score, tier }) => ({ nickname, score, tier }))
    .sort((a, b) => b.score - a.score);
}
